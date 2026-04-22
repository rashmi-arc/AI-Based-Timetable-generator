const express = require("express");
const router = express.Router();

const {
  addConstraintMaster,
  getConstraintMasters
} = require("../controllers/constraintMasterController");

router.post("/add", addConstraintMaster);
router.get("/", getConstraintMasters);

module.exports = router;