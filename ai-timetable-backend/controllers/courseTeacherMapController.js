const CourseTeacherMap = require("../models/CourseTeacherMap");

/* ADD MAPPING */
exports.addMapping = async (req,res)=>{

try{

const { course_id,user_id,batch_year } = req.body;

if(!course_id || !user_id || !batch_year){
return res.status(400).json({message:"All fields required"});
}

/* prevent duplicate mapping */
const existing = await CourseTeacherMap.findOne({
course_id,
batch_year
});

if(existing){
return res.status(400).json({
message:"Course already mapped for this batch"
});
}

const mapping = new CourseTeacherMap({
course_id,
user_id,
batch_year
});

await mapping.save();

res.json({message:"Mapping saved"});

}catch(err){

console.error(err);

res.status(500).json({message:"Server error"});

}

};


/* GET MAPPINGS */
exports.getMappings = async (req,res)=>{

try{

const data = await CourseTeacherMap.find()
.populate("course_id")
.populate("user_id","name");

res.json(data);

}catch(err){

console.error(err);

res.status(500).json({message:"Server error"});

}

};


/* DELETE MAPPING */
exports.deleteMapping = async (req,res)=>{

try{

await CourseTeacherMap.findByIdAndDelete(req.params.id);

res.json({message:"Mapping deleted"});

}catch(err){

console.error(err);

res.status(500).json({message:"Server error"});

}

};