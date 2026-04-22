const mongoose = require("mongoose");

const courseTeacherMapSchema = new mongoose.Schema({

course_id:{
type:mongoose.Schema.Types.ObjectId,
ref:"Course",
required:true
},

user_id:{
type:mongoose.Schema.Types.ObjectId,
ref:"User",
required:true
},

batch_year:{
type:String,
required:true
},

created_at:{
type:Date,
default:Date.now
}

});

module.exports = mongoose.model(
"CourseTeacherMap",
courseTeacherMapSchema
);