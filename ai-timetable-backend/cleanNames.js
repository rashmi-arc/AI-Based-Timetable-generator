const mongoose = require("mongoose");
const User = require("./models/User");
require("dotenv").config();

async function cleanAllNames() {
  await mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/ai_timetable");
  
  const users = await User.find({});
  for (const user of users) {
    if (user.name && user.name.includes("(")) {
      const newName = user.name.split("(")[0].trim();
      console.log(`Updating "${user.name}" to "${newName}"`);
      await User.updateOne({ _id: user._id }, { name: newName });
    }
  }
  
  console.log("All names cleaned in database.");
  process.exit(0);
}
cleanAllNames();
