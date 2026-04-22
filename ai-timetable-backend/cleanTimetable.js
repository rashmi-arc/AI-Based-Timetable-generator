const mongoose = require("mongoose");
const ClassTimetable = require("./models/ClassTimetable");
require("dotenv").config();

async function clean() {
  await mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/ai_timetable");
  await ClassTimetable.deleteMany({});
  console.log("ClassTimetable cleared.");
  process.exit(0);
}
clean();
