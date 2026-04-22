const express = require("express");
const router = express.Router();
const {
  addDepartment,
  getDepartments,
} = require("../controllers/departmentController");

router.post("/add", addDepartment);
router.get("/", getDepartments);

module.exports = router;
