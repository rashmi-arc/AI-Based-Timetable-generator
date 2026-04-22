const mongoose = require("mongoose");
const ClassTimetable = require("./models/ClassTimetable");
const User = require("./models/User");
require("dotenv").config();

async function checkStatus() {
  await mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/ai_timetable");
  
  const ctCount = await ClassTimetable.countDocuments();
  console.log("Total ClassTimetable records:", ctCount);

  const student = await User.findOne({ email: "student@gmail.com" });
  console.log("Student User IDs:", {
    program_id: student?.program_id,
    semester_id: student?.semester_id
  });

  if (ctCount > 0) {
    const firstRecord = await ClassTimetable.findOne();
    console.log("Sample Timetable Record IDs:", {
      program_id: firstRecord.program_id,
      semester_id: firstRecord.semester_id
    });
  }

  process.exit(0);
}

checkStatus();
