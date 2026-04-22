const mongoose = require("mongoose");

const examTimetableSchema = new mongoose.Schema({
  department_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Department",
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  slot: {
    type: String,
    enum: ["Morning", "Afternoon"],
    required: true
  },
  course_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true
  },
  semester_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Semester",
    required: true
  },
  room_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Room",
    required: true
  },
  batch_year: {
    type: String,
    required: true
  },
  created_at: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("ExamTimetable", examTimetableSchema);
