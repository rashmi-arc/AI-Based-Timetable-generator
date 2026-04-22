const mongoose = require("mongoose");

const departmentSchema = new mongoose.Schema({
  dept_name: {
    type: String,
    required: true,
    trim: true
  },
  created_at: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Department", departmentSchema);
