const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema(
  {
    room_name: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    capacity: {
      type: Number,
      required: true
    },
    category: {
      type: String,
      required: true
    },
    block: {
      type: String,
      required: true
    },
    description: {
      type: String
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Room", roomSchema);
