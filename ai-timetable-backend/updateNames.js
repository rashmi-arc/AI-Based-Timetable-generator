const mongoose = require("mongoose");
const User = require("./models/User");
require("dotenv").config();

async function update() {
  await mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/ai_timetable");
  
  await User.updateOne({ email: "student@gmail.com" }, { name: "John Doe" });
  await User.updateOne({ email: "hod@gmail.com" }, { name: "Dr. Smith" });
  
  console.log("Names updated in database.");
  process.exit(0);
}
update();
