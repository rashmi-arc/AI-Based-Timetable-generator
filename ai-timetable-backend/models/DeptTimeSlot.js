const mongoose = require("mongoose");

const deptTimeSlotSchema = new mongoose.Schema(
  {
    dept_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
      required: true
    },
    slot_label: {
      type: String,
      required: true
    },
    start_time: {
      type: String,
      required: true
    },
    end_time: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("DeptTimeSlot", deptTimeSlotSchema);
