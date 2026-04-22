const mongoose = require("mongoose");
const ClassTimetable = require("./models/ClassTimetable");
require("dotenv").config();

async function clearTimetable() {
  try {
    await mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/ai_timetable");
    await ClassTimetable.deleteMany({});
    console.log("Cleared ClassTimetable collection successfully.");
    process.exit(0);
  } catch (err) {
    console.error("Error clearing data:", err);
    process.exit(1);
  }
}

clearTimetable();
