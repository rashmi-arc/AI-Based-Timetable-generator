const mongoose = require("mongoose");
const ClassTimetable = require("./models/ClassTimetable");
require("dotenv").config();

async function checkData() {
  await mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/ai_timetable");
  const records = await ClassTimetable.find({ day: "Wednesday", slot: "period1" });
  console.log("Wednesday Period 1 Records:", JSON.stringify(records, null, 2));
  process.exit(0);
}

checkData();
