const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Department = require("./models/Department");
const Program = require("./models/Program");
const Semester = require("./models/Semester");
const Course = require("./models/Course");
const Room = require("./models/Room");
const DeptTimeSlot = require("./models/DeptTimeSlot");
const CourseTeacherMap = require("./models/CourseTeacherMap");
const PDM = require("./models/PDM");
const ConstraintMaster = require("./models/ConstraintMaster");
const Constraint = require("./models/Constraint");
const User = require("./models/User");
const ClassTimetable = require("./models/ClassTimetable");
const ExamTimetable = require("./models/ExamTimetable");
require("dotenv").config();

async function seedData() {
  try {
    await mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/ai_timetable");
    console.log("Connected to MongoDB");

    // Clear existing data (all)
    await Promise.all([
      Department.deleteMany({}),
      Program.deleteMany({}),
      Semester.deleteMany({}),
      Course.deleteMany({}),
      Room.deleteMany({}),
      DeptTimeSlot.deleteMany({}),
      CourseTeacherMap.deleteMany({}),
      PDM.deleteMany({}),
      ConstraintMaster.deleteMany({}),
      Constraint.deleteMany({}),
      ClassTimetable.deleteMany({}),
      ExamTimetable.deleteMany({}),
      User.deleteMany({ role: { $ne: "ADMIN" } })
    ]);
    console.log("Cleared existing data (except ADMIN)");

    // 1. Create Department
    const dept = await new Department({ dept_name: "Computer Science" }).save();

    // 2. Create Program
    const program = await new Program({
      program_name: "BCA",
      start_year: 2024,
      intake: 60,
      total_semesters: 6,
      dept_id: dept._id
    }).save();

    // 3. Create PDM
    await new PDM({ program_id: program._id, dept_id: dept._id }).save();

    // 4. Create Semesters
    const sem1 = await new Semester({ program: program._id, semester_number: 1, start_date: new Date() }).save();
    const sem3 = await new Semester({ program: program._id, semester_number: 3, start_date: new Date() }).save();
    const sem5 = await new Semester({ program: program._id, semester_number: 5, start_date: new Date() }).save();

    // 5. Create Users
    const hashedPassword = await bcrypt.hash("password123", 10);
    
    await new User({ name: "Dr. Smith", email: "hod@gmail.com", password: hashedPassword, role: "HOD", dept_id: dept._id }).save();
    const t1 = await new User({ name: "Prof. Alan", email: "alan@gmail.com", password: hashedPassword, role: "TEACHER", dept_id: dept._id }).save();
    const t2 = await new User({ name: "Prof. Grace", email: "grace@gmail.com", password: hashedPassword, role: "TEACHER", dept_id: dept._id }).save();
    const t3 = await new User({ name: "Prof. Alice", email: "alice@gmail.com", password: hashedPassword, role: "TEACHER", dept_id: dept._id }).save();

    // Create Students
    await new User({ name: "John Doe (Sem 1)", email: "student1@gmail.com", password: hashedPassword, role: "STUDENT", dept_id: dept._id, program_id: program._id, semester_id: sem1._id }).save();
    await new User({ name: "Jane Smith (Sem 3)", email: "student3@gmail.com", password: hashedPassword, role: "STUDENT", dept_id: dept._id, program_id: program._id, semester_id: sem3._id }).save();
    await new User({ name: "Bob Wilson (Sem 5)", email: "student5@gmail.com", password: hashedPassword, role: "STUDENT", dept_id: dept._id, program_id: program._id, semester_id: sem5._id }).save();
    await new User({ name: "John Doe", email: "student@gmail.com", password: hashedPassword, role: "STUDENT", dept_id: dept._id, program_id: program._id, semester_id: sem1._id }).save();

    // 6. Create Courses (Full set for testing)
    const courseData = [
      // Semester 1
      { code: "BCA101", name: "C Programming", sem: sem1._id, type: "THEORY", teacher: t1._id },
      { code: "BCA102", name: "Mathematics", sem: sem1._id, type: "THEORY", teacher: t2._id },
      { code: "BCA103", name: "Digital Logic", sem: sem1._id, type: "THEORY", teacher: t3._id },
      // Semester 3
      { code: "BCA301", name: "Java Programming", sem: sem3._id, type: "THEORY", teacher: t2._id },
      { code: "BCA302", name: "Operating Systems", sem: sem3._id, type: "THEORY", teacher: t1._id },
      { code: "BCA303", name: "Data Structures", sem: sem3._id, type: "THEORY", teacher: t3._id },
      // Semester 5
      { code: "BCA501", name: "Software Engineering", sem: sem5._id, type: "THEORY", teacher: t3._id },
      { code: "BCA502", name: "Computer Networks", sem: sem5._id, type: "THEORY", teacher: t2._id },
      { code: "BCA503", name: "Information Security", sem: sem5._id, type: "THEORY", teacher: t1._id },
    ];

    const courses = {}; 
    for (const c of courseData) {
      const course = await new Course({
        course_code: c.code,
        course_name: c.name,
        program_id: program._id,
        semester_id: c.sem,
        hours_per_week: 4,
        course_type: c.type,
        department: dept.dept_name
      }).save();
      courses[c.code] = course;

      await new CourseTeacherMap({
        course_id: course._id,
        user_id: c.teacher,
        batch_year: "2024"
      }).save();
    }

    // 7. Create Rooms
    const r1 = await new Room({ room_name: "CR-101", capacity: 60, category: "Classroom", block: "A-Block" }).save();
    const r2 = await new Room({ room_name: "CR-102", capacity: 60, category: "Classroom", block: "A-Block" }).save();

    // 8. Create Time Slots
    const slotLabels = ["period1", "period2", "period3", "period4", "period5", "period6"];
    for (let i=0; i<slotLabels.length; i++) {
        await new DeptTimeSlot({ dept_id: dept._id, slot_label: slotLabels[i], start_time: `${9+i}:00`, end_time: `${10+i}:00` }).save();
    }

    // 9. SAMPLE CLASS TIMETABLE (Ensuring all have valid teachers from users list)
    const sampleClasses = [
        { sem: sem1._id, day: "Monday", slot: "period1", course: "C Programming", teacher: "Prof. Alan", user_id: t1._id, room: "CR-101" },
        { sem: sem1._id, day: "Monday", slot: "period2", course: "Mathematics", teacher: "Prof. Grace", user_id: t2._id, room: "CR-101" },
        { sem: sem3._id, day: "Monday", slot: "period2", course: "Java Programming", teacher: "Prof. Grace", user_id: t2._id, room: "CR-102" },
        { sem: sem3._id, day: "Monday", slot: "period1", course: "Operating Systems", teacher: "Prof. Alan", user_id: t1._id, room: "CR-102" },
        { sem: sem5._id, day: "Monday", slot: "period3", course: "Software Engineering", teacher: "Prof. Alice", user_id: t3._id, room: "CR-101" }
    ];

    for (const s of sampleClasses) {
        await new ClassTimetable({
            program_id: String(program._id),
            semester_id: String(s.sem),
            day: s.day,
            slot: s.slot,
            course: s.course,
            teacher: s.teacher,
            room: s.room,
            user_id: String(s.user_id),
            batch_year: "2024"
        }).save();
    }

    // 10. SAMPLE EXAM TIMETABLE
    await new ExamTimetable({
      department_id: dept._id,
      date: new Date("2026-04-01"),
      slot: "Morning",
      course_id: courses["BCA101"]._id,
      semester_id: sem1._id,
      room_id: r1._id,
      batch_year: "2024"
    }).save();

    await new ExamTimetable({
      department_id: dept._id,
      date: new Date("2026-04-01"),
      slot: "Afternoon",
      course_id: courses["BCA301"]._id,
      semester_id: sem3._id,
      room_id: r2._id,
      batch_year: "2024"
    }).save();

    console.log("Comprehensive seeding with valid teacher data completed!");
    process.exit(0);
  } catch (err) {
    console.error("Seeding error:", err);
    process.exit(1);
  }
}

seedData();
