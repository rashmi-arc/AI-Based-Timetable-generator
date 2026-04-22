const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.login = async (req, res) => {

  try {

    const { email, password } = req.body;

    /* VALIDATION */

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required"
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return res.status(400).json({
        message: "Invalid email format"
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters"
      });
    }

    /* CHECK EMAIL */

    const user = await User.findOne({ email })
      .populate("dept_id", "dept_name");

    if (!user) {
      return res.status(400).json({
        message: "Email is wrong"
      });
    }

    /* CHECK PASSWORD */

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Your password is wrong"
      });
    }

    /* CREATE TOKEN */

    const token = jwt.sign(
      { id: user._id, role: user.role },
      "secretkey",
      { expiresIn: "1d" }
    );

    /* RESPONSE */

    res.json({

      token,

      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.dept_id?.dept_name,
        dept_id: user.dept_id?._id || user.dept_id,
        program_id: user.program_id,
        semester_id: user.semester_id
      }

    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      message: "Server error"
    });

  }

};