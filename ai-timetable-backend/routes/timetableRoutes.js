const express = require("express");
const router = express.Router();

const controller = require("../controllers/timetableController");

router.post("/generate", controller.generateTimetable);
router.get("/teacher/:teacherId", controller.getTeacherTimetable);
router.get("/student/:programId/:semesterId", controller.getStudentTimetable);

/* EXAM TIMETABLE */
router.post("/exam/generate", controller.generateExamTimetable);
router.get("/exam/:deptId", controller.getExamTimetable);

module.exports = router;