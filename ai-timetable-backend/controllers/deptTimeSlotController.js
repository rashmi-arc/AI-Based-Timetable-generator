const DeptTimeSlot = require("../models/DeptTimeSlot");

exports.addSlot = async (req, res) => {
  try {
    const { dept_id, slot_label, start_time, end_time } = req.body;

    if (!dept_id || !slot_label || !start_time || !end_time) {
      return res.status(400).json({ message: "All fields required" });
    }

    const slot = await DeptTimeSlot.create({
      dept_id,
      slot_label,
      start_time,
      end_time
    });

    res.json({ message: "Slot added successfully", slot });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getSlots = async (req, res) => {
  try {
    const slots = await DeptTimeSlot.find()
      .populate("dept_id", "dept_name")
      .sort({ start_time: 1 });

    res.json(slots);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
