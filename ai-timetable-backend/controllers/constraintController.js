const Constraint = require("../models/Constraint");

// ✅ ADD CONSTRAINT
exports.addConstraints = async (req, res) => {
  try {
    console.log("BODY:", req.body); // 🔥 DEBUG

    const {
      dept_id,
      program_id,
      batch_year,
      constraint_id,
      constraint_value
    } = req.body;

    // ✅ VALIDATION
    if (!dept_id || !program_id || !batch_year || !constraint_id) {
      return res.status(400).json({
        message: "All fields are required"
      });
    }

    const data = new Constraint({
      dept_id,
      program_id,
      batch_year,
      constraint_id,
      constraint_value
    });

    await data.save();

    res.json({ message: "Constraint added successfully" });

  } catch (err) {
    console.error("ERROR:", err);
    res.status(500).json({
      message: err.message
    });
  }
};

// ✅ GET ALL
exports.getConstraints = async (req, res) => {
  try {
    const data = await Constraint.find()
      .populate("dept_id")
      .populate("program_id")
      .populate("constraint_id");

    res.json(data);
  } catch (err) {
    res.status(500).json({ message: "Error fetching" });
  }
};