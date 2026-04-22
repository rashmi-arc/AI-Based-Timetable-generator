const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// middlewares
app.use(cors());
app.use(express.json());

// routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/users", require("./routes/userRoutes"));

app.use("/api/departments", require("./routes/departmentRoutes"));
app.use("/api/programs", require("./routes/programRoutes"));
app.use("/api/semesters", require("./routes/semesterRoutes"));
app.use("/api/pdm", require("./routes/pdmRoutes"));

app.use("/api/courses", require("./routes/courseRoutes"));
app.use("/api/course-teacher-map", require("./routes/courseTeacherMapRoutes"));

app.use("/api/rooms", require("./routes/roomRoutes"));
app.use("/api/dept-slots", require("./routes/deptTimeSlotRoutes"));

app.use("/api/constraint-master", require("./routes/constraintMasterRoutes"));
app.use("/api/constraints", require("./routes/constraintRoutes"));

app.use("/api/class-timetable", require("./routes/timetableRoutes"));

// MongoDB connection
mongoose
.connect("mongodb://localhost:27017/ai_timetable")
.then(()=>console.log("MongoDB Connected"))
.catch(err=>console.log(err));

// test route
app.get("/",(req,res)=>{
res.send("AI Timetable Backend Running");
});

const port = process.env.PORT || 5000;

app.listen(port,()=>{
console.log("Server running on port " + port);
});