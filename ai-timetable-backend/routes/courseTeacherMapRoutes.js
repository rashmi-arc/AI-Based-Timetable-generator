const express = require("express");
const router = express.Router();

const {
addMapping,
getMappings,
deleteMapping
} = require("../controllers/courseTeacherMapController");

router.post("/add",addMapping);
router.get("/",getMappings);
router.delete("/:id",deleteMapping);

module.exports = router;