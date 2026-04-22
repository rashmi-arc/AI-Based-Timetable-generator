const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");
require("dotenv").config();

async function seedAdmin() {
  try {
    await mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/ai_timetable");
    console.log("Connected to MongoDB");

    const existingAdmin = await User.findOne({ role: "ADMIN" });
    if (existingAdmin) {
      console.log("Admin user already exists:", existingAdmin.email);
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash("admin123", 10);
    const admin = new User({
      name: "Admin User",
      email: "admin@gmail.com",
      password: hashedPassword,
      role: "ADMIN"
    });

    await admin.save();
    console.log("Default admin user created: admin@gmail.com / admin123");
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

seedAdmin();
