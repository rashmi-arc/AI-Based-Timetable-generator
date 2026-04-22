const Room = require("../models/Room");

const addRoom = async (req, res) => {
  try {
    const { room_name, capacity, category, block, description } = req.body;

    if (!room_name || !capacity || !category || !block) {
      return res.status(400).json({ message: "All fields required" });
    }

    const exists = await Room.findOne({ room_name });
    if (exists) {
      return res.status(400).json({ message: "Room already exists" });
    }

    const room = new Room({
      room_name,
      capacity,
      category,
      block,
      description
    });

    await room.save();
    res.json({ message: "Room added successfully" });
  } catch (err) {
    console.error("ADD ROOM ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

const getRooms = async (req, res) => {
  try {
    const rooms = await Room.find().sort({ createdAt: -1 });
    res.json(rooms);
  } catch (err) {
    console.error("GET ROOM ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  addRoom,
  getRooms
};
