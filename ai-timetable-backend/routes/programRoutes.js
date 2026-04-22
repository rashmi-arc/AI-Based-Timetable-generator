const express = require("express");
const router = express.Router();
const programController = require("../controllers/programController");

// ✅ PASS FUNCTIONS ONLY
router.get("/", programController.getPrograms);
router.post("/add", programController.addProgram);

module.exports = router;
