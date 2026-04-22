const mongoose = require("mongoose");

const ProgramSchema = new mongoose.Schema(
  {
    program_name: { type: String, required: true },
    start_year: { type: Number, required: true },
    intake: { type: Number, required: true },
    total_semesters: { type: Number, required: true },
    dept_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
      required: true
    }
  },
  { timestamps: true }
);

// 🔒 Prevent duplicate program + year
ProgramSchema.index(
  { program_name: 1, start_year: 1 },
  { unique: true }
);

module.exports = mongoose.model("Program", ProgramSchema);
