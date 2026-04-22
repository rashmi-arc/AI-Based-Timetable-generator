const mongoose = require("mongoose");

const constraintSchema = new mongoose.Schema(
  {
    dept_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
      required: true
    },

    program_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Program",
      required: true
    },

    batch_year: {
      type: String,
      required: true
    },

    constraint_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ConstraintMaster",
      required: true
    },

    constraint_value: {
      type: String
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Constraint", constraintSchema);