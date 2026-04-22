const ConstraintMaster = require("../models/ConstraintMaster");

// ✅ ADD
exports.addConstraintMaster = async (req, res) => {
  try {
    const data = new ConstraintMaster(req.body);
    await data.save();
    res.json({ message: "Constraint master added" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error adding constraint master" });
  }
};

// ✅ GET
exports.getConstraintMasters = async (req, res) => {
  try {
    const data = await ConstraintMaster.find();
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching constraint masters" });
  }
};