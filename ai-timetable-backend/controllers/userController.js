const User = require("../models/User");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");

/* ============================= */
/* ADD USER */
/* ============================= */

exports.addUser = async (req,res)=>{

try{

const { name,email,password,role,dept_id,program_id,semester_id } = req.body;

if(!name || !email || !password || !role){
return res.status(400).json({
message:"All fields required"
});
}

const existing = await User.findOne({email});

if(existing){
return res.status(400).json({
message:"Email already exists"
});
}

const hashedPassword = await bcrypt.hash(password,10);

const user = new User({

name,
email,
password:hashedPassword,
role,

dept_id:dept_id || null,

program_id: role === "STUDENT" ? program_id : null,

semester_id: role === "STUDENT" ? semester_id : null

});

await user.save();

res.json({
message:"User created successfully"
});

}catch(err){

console.error(err);

res.status(500).json({
message:"Server error"
});

}

};


/* ============================= */
/* GET USERS */
/* ============================= */

exports.getUsers = async (req,res)=>{

try{

const users = await User.find()
.populate("dept_id","dept_name")
.populate("program_id","program_name")
.populate("semester_id","semester_number")
.select("-password");

res.json(users);

}catch(err){

console.error(err);

res.status(500).json({
message:"Server error"
});

}

};


/* ============================= */
/* DELETE USER */
/* ============================= */

exports.deleteUser = async (req,res)=>{

try{

const { id } = req.params;

if(!mongoose.Types.ObjectId.isValid(id)){
return res.status(400).json({
message:"Invalid user id"
});
}

await User.findByIdAndDelete(id);

res.json({
message:"User deleted"
});

}catch(err){

console.error(err);

res.status(500).json({
message:"Server error"
});

}

};


/* ============================= */
/* GET TEACHERS BY DEPARTMENT */
/* ============================= */

exports.getTeachersByDept = async (req,res)=>{

try{

const { deptId } = req.params;

if(!mongoose.Types.ObjectId.isValid(deptId)){
return res.status(400).json({
message:"Invalid department id"
});
}

const teachers = await User.find({
role:"TEACHER",
dept_id:deptId
})
.select("_id name email");

res.json(teachers || []);

}catch(err){

console.error(err);

res.status(500).json({
message:"Server error"
});

}

};