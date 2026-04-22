const { spawn } = require("child_process");
const path = require("path");
const ClassTimetable = require("../models/ClassTimetable");
const Course = require("../models/Course");
const Program = require("../models/Program");
const Semester = require("../models/Semester");
const Room = require("../models/Room");
const DeptTimeSlot = require("../models/DeptTimeSlot");
const CourseTeacherMap = require("../models/CourseTeacherMap");
const User = require("../models/User");
const ExamTimetable = require("../models/ExamTimetable");

/* =========================================
   GENERATE TIMETABLE (AI PROCESS)
========================================= */

exports.generateTimetable = async (req, res) => {
  try {
    const { programId, semesterId, batchYear } = req.body;

    /* LOAD METADATA */
    const courses = await Course.find({ program_id: programId, semester_id: semesterId });
    if (courses.length === 0) {
      return res.status(400).json({ message: "No courses found for this program/semester" });
    }

    const rooms = await Room.find();
    const slots = await DeptTimeSlot.find().sort({ slot_order: 1 });

    /* LOAD TEACHER MAP */
    const searchYear = String(batchYear);
    const teacherMaps = await CourseTeacherMap.find({ batch_year: searchYear });
    const users = await User.find();

    /* BUILD COURSE DATA FOR AI */
  

const coursesWithTeacher = [];

for (const course of courses) {

  const map = teacherMaps.find(
    m => String(m.course_id) === String(course._id)
  );

  let teacherName = "TBD";
  let teacherId = "";

  if (map) {

    const user = users.find(
      u => String(u._id) === String(map.user_id)
    );

    if (user) {
      teacherName = user.name;
      teacherId = user._id.toString();
    }

  } else {

    console.warn("⚠ No teacher mapping found for:", course.course_name);

  }

  coursesWithTeacher.push({
    course_name: course.course_name,
    teacher: teacherName,
    user_id: teacherId,
    type: course.course_type,
    hours: course.hours_per_week
  });

}

    /* PYTHON INPUT - MUST MATCH ai/generate_timetable.py expectations! */
    const inputData = {
      courses: coursesWithTeacher,
      rooms: rooms.map(r => ({ room_name: r.room_name })), // Script expects list of objects with room_name
      slots: slots.map(s => ({ slot_label: s.slot_label })) // Script expects list of objects with slot_label
    };

    const scriptPath = path.join(__dirname, "../ai/generate_timetable.py");
    const pyProcess = spawn("python", [scriptPath]);
    
    // Send input via stdin
    pyProcess.stdin.write(JSON.stringify(inputData));
    pyProcess.stdin.end();

    let scriptOutput = "";
    let scriptError = "";

    pyProcess.stdout.on("data", (data) => {
      scriptOutput += data.toString();
    });

    pyProcess.stderr.on("data", (data) => {
      scriptError += data.toString();
      console.error("AI Script Error:", data.toString());
    });

    pyProcess.on("error", (err) => {
        console.error("Failed to start AI process:", err);
        if (!res.headersSent) res.status(500).json({ message: "Failed to start AI process" });
    });

    pyProcess.on("close", async (code) => {
      if (code !== 0) {
        console.error(`AI Process exited with code ${code}. Error: ${scriptError}`);
        if (!res.headersSent) return res.status(500).json({ message: "AI generation failed: " + scriptError.split('\n')[0] });
        return;
      }

      try {
        const generated = JSON.parse(scriptOutput);

        /* SAVE TO DB */
        await ClassTimetable.deleteMany({
          program_id: String(programId),
          semester_id: String(semesterId)
        });

        for (const row of generated) {
          if (row.slot === "period4") continue;

          const courseInfo = coursesWithTeacher.find(
            c => c.course_name.toLowerCase() === row.course.toLowerCase()
          );

          const finalTeacherName = (row.teacher && row.teacher !== "TBD") ? row.teacher : (courseInfo?.teacher || "TBD");
          const finalUserId = courseInfo?.user_id ? String(courseInfo.user_id) : null;

          await ClassTimetable.create({
            program_id: String(programId),
            semester_id: String(semesterId),
            batch_year: String(batchYear),
            day: row.day,
            slot: row.slot,
            course: row.course,
            teacher: finalTeacherName,
            room: row.room,
            user_id: finalUserId
          });
        }

        res.json(generated);
      } catch (err) {
        console.error("JSON Parse Error:", err, "Original Output:", scriptOutput);
        if (!res.headersSent) res.status(500).json({ message: "Invalid output from AI script" });
      }
    });

  } catch (err) {
    console.error(err);
    if (!res.headersSent) res.status(500).json({ message: "Server error during generation" });
  }
};

/* =========================================
   TEACHER TIMETABLE
========================================= */

exports.getTeacherTimetable = async(req,res)=>{
  try{
    const teacherId = req.params.teacherId;
    const data = await ClassTimetable.find({
      user_id:teacherId
    }).sort({day:1,slot:1});
    res.json(data);
  }catch(err){
    res.status(500).json({ message:"Error fetching teacher timetable" });
  }
};

/* =========================================
   STUDENT TIMETABLE
========================================= */

exports.getStudentTimetable = async(req,res)=>{
  try{
    const {programId,semesterId} = req.params;
    const data = await ClassTimetable.find({
      program_id:programId,
      semester_id:semesterId
    }).sort({day:1,slot:1});
    res.json(data);
  }catch(err){
    res.status(500).json({ message:"Error fetching student timetable" });
  }
};

/* =========================================
   EXAM TIMETABLE
========================================= */

exports.generateExamTimetable = async (req, res) => {
  try {
    const { deptId, startDate, endDate, batchYear } = req.body;
    const DeptModel = require("../models/Department");
    const department = await DeptModel.findById(deptId);
    
    if (!department) return res.status(400).json({ message: "Department not found" });

    const filteredCourses = await Course.find({ department: department.dept_name }).populate('semester_id');
    if (filteredCourses.length === 0) return res.status(400).json({ message: "No courses found" });

    const rooms = await Room.find({});

    const pythonInput = {
      courses: filteredCourses.map(c => ({
        id: c._id.toString(),
        name: c.course_name,
        semester_id: c.semester_id?._id.toString(),
        semester_num: c.semester_id?.semester_number
      })),
      rooms: rooms.map(r => ({
        id: r._id.toString(),
        name: r.room_name
      })),
      start_date: startDate,
      end_date: endDate
    };

    const scriptPath = path.join(__dirname, "../ai/generate_exam_timetable.py");
    const pyProcess = spawn("python", [scriptPath]);
    pyProcess.stdin.write(JSON.stringify(pythonInput));
    pyProcess.stdin.end();

    let scriptOutput = "";
    pyProcess.stdout.on("data", (data) => { scriptOutput += data.toString(); });

    pyProcess.on("close", async (code) => {
      if (code !== 0) return res.status(500).json({ message: "AI Script error" });
      try {
        const result = JSON.parse(scriptOutput);
        await ExamTimetable.deleteMany({ department_id: deptId, batch_year: batchYear });
        const docs = result.map(item => ({
          department_id: deptId,
          date: new Date(item.date),
          slot: item.slot,
          course_id: item.course_id,
          semester_id: item.semester_id,
          room_id: item.room_id,
          batch_year: batchYear
        }));
        await ExamTimetable.insertMany(docs);
        res.json({ message: "Success", count: docs.length });
      } catch (e) {
        res.status(500).json({ message: "Failed to parse AI output" });
      }
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.getExamTimetable = async (req, res) => {
  try {
    const { deptId } = req.params;
    const data = await ExamTimetable.find({ department_id: deptId })
      .populate("course_id", "course_name")
      .populate("semester_id", "semester_number")
      .populate("room_id", "room_name")
      .sort({ date: 1, slot: 1 });
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: "Error fetching exams" });
  }
};