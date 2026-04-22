const express = require("express");
const router = express.Router();

const controller = require("../controllers/constraintController");

router.post("/add", controller.addConstraints);
router.get("/", controller.getConstraints);

module.exports = router;