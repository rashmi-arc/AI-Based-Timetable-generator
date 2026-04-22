const mongoose = require("mongoose");

const semesterSchema = new mongoose.Schema(
  {
    program: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Program",
      required: true
    },
    semester_number: {
      type: Number,
      required: true
    },
    start_date: {
      type: Date,
      required: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Semester", semesterSchema);
