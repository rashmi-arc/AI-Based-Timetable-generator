const Department = require("../models/Department");

exports.addDepartment = async (req, res) => {
  try {
    let { dept_name } = req.body;

    // clean input
    dept_name = dept_name.trim();

    // case-insensitive duplicate check
    const existingDept = await Department.findOne({
      dept_name: { $regex: `^${dept_name}$`, $options: "i" }
    });

    if (existingDept) {
      return res.status(400).json({
        message: "Department already exists"
      });
    }

    const dept = new Department({ dept_name });
    await dept.save();

    res.status(201).json({
      message: "Department added successfully"
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getDepartments = async (req, res) => {
  const data = await Department.find().sort({ created_at: -1 });
  res.json(data);
};
