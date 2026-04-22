const PDM = require("../models/PDM");

exports.add = async (req, res) => {
  try {
    const { program_id, dept_id } = req.body;

    // prevent duplicate mapping
    const exists = await PDM.findOne({ program_id, dept_id });
    if (exists) {
      return res.status(400).json({ message: "Mapping already exists" });
    }

    const mapping = new PDM({ program_id, dept_id });
    await mapping.save();

    res.json({ message: "Mapping saved" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    const mappings = await PDM.find()
      .populate("program_id", "program_name")
      .populate("dept_id", "dept_name");

    res.json(mappings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
