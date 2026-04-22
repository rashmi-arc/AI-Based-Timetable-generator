const mongoose = require("mongoose");

const pdmSchema = new mongoose.Schema({
  program_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Program",
    required: true
  },
  dept_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Department",
    required: true
  }
});

module.exports = mongoose.model("PDM", pdmSchema);
