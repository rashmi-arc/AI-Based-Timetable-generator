const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({

course_code:{
type:String,
required:true
},

course_name:{
type:String,
required:true
},

program_id:{
type:mongoose.Schema.Types.ObjectId,
ref:"Program",
required:true
},

semester_id:{
type:mongoose.Schema.Types.ObjectId,
ref:"Semester",
required:true
},

hours_per_week:{
type:Number,
required:true
},

course_type:{
type:String,
enum:["THEORY","LAB"],
required:true
},

department:{
type:String,
required:true
},

created_at:{
type:Date,
default:Date.now
}

});

module.exports = mongoose.model("Course",courseSchema);