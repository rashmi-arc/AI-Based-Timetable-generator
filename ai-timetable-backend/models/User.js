const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({

name:{
type:String,
required:true
},

email:{
type:String,
required:true,
unique:true
},

password:{
type:String,
required:true
},

role:{
type:String,
enum:["ADMIN","HOD","TEACHER","STUDENT"],
required:true
},

dept_id:{
type:mongoose.Schema.Types.ObjectId,
ref:"Department",
default:null
},

program_id:{
type:mongoose.Schema.Types.ObjectId,
ref:"Program",
default:null
},

semester_id:{
type:mongoose.Schema.Types.ObjectId,
ref:"Semester",
default:null
},

is_active:{
type:Boolean,
default:true
}

},{timestamps:true});

module.exports = mongoose.model("User",UserSchema);