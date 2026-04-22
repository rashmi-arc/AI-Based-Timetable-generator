const express = require("express");
const router = express.Router();

const {
addUser,
getUsers,
deleteUser,
getTeachersByDept
} = require("../controllers/userController");

const { auth, role } = require("../middleware/authMiddleware");

/* ADMIN ONLY */
router.post("/add", auth, role("ADMIN"), addUser);

router.get("/", auth, role("ADMIN"), getUsers);

router.delete("/:id", auth, role("ADMIN"), deleteUser);

/* HOD / ADMIN */
router.get("/teachers/:deptId", auth, getTeachersByDept);

module.exports = router;