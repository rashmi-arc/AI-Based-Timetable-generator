const express = require("express");
const router = express.Router();

const {
  addSemester,
  getAllSemesters
} = require("../controllers/semesterController");

// ✅ ADD
router.post("/add", addSemester);

// ✅ GET ALL
router.get("/all", getAllSemesters);

module.exports = router;