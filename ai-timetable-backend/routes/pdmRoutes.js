const express = require("express");
const router = express.Router();
const controller = require("../controllers/pdmController");

router.post("/add", controller.add);
router.get("/", controller.getAll);

module.exports = router;
