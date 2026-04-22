const mongoose = require("mongoose");
const Semester = require("../models/Semester");

// ADD SEMESTER
exports.addSemester = async (req, res) => {
  try {
    const { program, semester_number, start_date } = req.body;

    console.log("BODY:", req.body);

    if (!program || !semester_number || !start_date) {
      return res.status(400).json({
        message: "All fields are required"
      });
    }

    if (!mongoose.Types.ObjectId.isValid(program)) {
      return res.status(400).json({
        message: "Invalid program id"
      });
    }

    const semNumber = Number(semester_number);

    const exists = await Semester.findOne({
      program,
      semester_number: semNumber
    });

    if (exists) {
      return res.status(400).json({
        message: "Semester already exists"
      });
    }

    const semester = new Semester({
      program,
      semester_number: semNumber,
      start_date: new Date(start_date)
    });

    await semester.save();

    res.json({ message: "Semester added successfully" });

  } catch (err) {
    console.error("ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};

// GET ALL
exports.getAllSemesters = async (req, res) => {
  try {
    const data = await Semester.find()
      .populate("program")
      .sort({ semester_number: 1 });

    res.json(data);
  } catch (err) {
    res.status(500).json({ message: "Error fetching" });
  }
};