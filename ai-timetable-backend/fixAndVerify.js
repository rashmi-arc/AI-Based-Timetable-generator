const mongoose = require("mongoose");
const ClassTimetable = require("./models/ClassTimetable");
const Program = require("./models/Program");
const Semester = require("./models/Semester");
const axios = require("axios");
require("dotenv").config();

async function fixAndVerify() {
  await mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/ai_timetable");
  
  // 1. Clear ALL timetable data
  await ClassTimetable.deleteMany({});
  console.log("Cleared ClassTimetable collection");

  // 2. Find BCA program and Sem 1
  const program = await Program.findOne({ program_name: "BCA" });
  const semester = await Semester.findOne({ program: program._id, semester_number: 1 });

  if (!program || !semester) {
    console.error("BCA Program or Sem 1 not found!");
    process.exit(1);
  }

  console.log(`Generating timetable for ${program.program_name} Sem ${semester.semester_number}...`);

  // 3. Trigger generation via API (simulating UI click)
  try {
    const res = await axios.post("http://localhost:5000/api/class-timetable/generate", {
      programId: program._id,
      semesterId: semester._id,
      batchYear: "2024"
    });
    console.log("Timetable generated successfully");

    // 4. Verify no conflicts for Wednesday Period 1
    const records = await ClassTimetable.find({ day: "Wednesday", slot: "period1" });
    console.log("Wednesday Period 1 Records:", JSON.stringify(records, null, 2));

    if (records.length > 1) {
      console.error("STILL HAS CONFLICTS!");
    } else {
      console.log("SUCCESS: No conflicts found.");
    }
  } catch (err) {
    console.error("Generation failed:", err.message);
  }

  process.exit(0);
}

fixAndVerify();
