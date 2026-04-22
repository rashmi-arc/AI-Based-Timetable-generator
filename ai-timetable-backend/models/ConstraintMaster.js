const mongoose = require("mongoose");

const constraintMasterSchema = new mongoose.Schema(
  {
    constraint_name: {
      type: String,
      required: true
    },
    constraint_category: {
      type: String,
      enum: ["class", "exam", "invigilator"],
      required: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("ConstraintMaster", constraintMasterSchema);