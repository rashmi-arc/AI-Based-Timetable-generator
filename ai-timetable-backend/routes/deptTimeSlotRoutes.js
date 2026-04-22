const express = require("express");
const router = express.Router();
const deptTimeSlotController = require("../controllers/deptTimeSlotController");

// ✅ PASS FUNCTIONS, NOT OBJECTS
router.post("/add", deptTimeSlotController.addSlot);
router.get("/", deptTimeSlotController.getSlots);

module.exports = router;
