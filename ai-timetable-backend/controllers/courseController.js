const Course = require("../models/Course");

/* ADD COURSE */
const addCourse = async (req,res)=>{

try{

const {
course_code,
course_name,
program_id,
semester_id,
hours_per_week,
course_type,
department
} = req.body;

if(
!course_code ||
!course_name ||
!program_id ||
!semester_id ||
!hours_per_week ||
!course_type ||
!department
){
return res.status(400).json({
message:"All fields required"
});
}

/* prevent duplicate */
const exists = await Course.findOne({
course_code,
program_id,
semester_id,
department
});

if(exists){
return res.status(400).json({
message:"Course already exists"
});
}

const course = new Course({
course_code,
course_name,
program_id,
semester_id,
hours_per_week:Number(hours_per_week),
course_type,
department
});

await course.save();

res.json({
message:"Course saved successfully"
});

}catch(err){

console.error(err);

res.status(500).json({
message:"Server error"
});

}

};


/* GET COURSES */
const getCourses = async (req,res)=>{

try{

const courses = await Course.find()
.populate("program_id","program_name")
.populate("semester_id","semester_number");

res.json(courses);

}catch(err){

res.status(500).json({
message:err.message
});

}

};

module.exports = {
addCourse,
getCourses
};