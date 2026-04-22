import { useState, useEffect } from "react";
import axios from "axios";

export default function AddCourse(){

const user = JSON.parse(localStorage.getItem("user"));

const [courses,setCourses] = useState([]);
const [programs,setPrograms] = useState([]);
const [semesters,setSemesters] = useState([]);

const [form,setForm] = useState({
course_code:"",
course_name:"",
program_id:"",
semester_id:"",
hours_per_week:"",
course_type:""
});

useEffect(()=>{
fetchCourses();
fetchPrograms();
fetchSemesters();
},[]);


/* GET COURSES */
const fetchCourses = async ()=>{

try{

const res = await axios.get("http://localhost:5000/api/courses");

const filtered = res.data.filter(
c => c.department === user?.department
);

setCourses(filtered);

}catch(err){
console.error(err);
}

};


/* GET PROGRAMS */
const fetchPrograms = async ()=>{

try{

const res = await axios.get("http://localhost:5000/api/programs");

setPrograms(res.data);

}catch(err){
console.error(err);
}

};


/* GET SEMESTERS */
const fetchSemesters = async ()=>{

try{

const res = await axios.get("http://localhost:5000/api/semesters/all");

setSemesters(res.data);

}catch(err){
console.error(err);
}

};


/* INPUT CHANGE */
const handleChange = (e)=>{
setForm({
...form,
[e.target.name]:e.target.value
});
};


/* SAVE COURSE */
const saveCourse = async ()=>{

try{

if(
!form.course_code ||
!form.course_name ||
!form.program_id ||
!form.semester_id ||
!form.hours_per_week ||
!form.course_type
){
alert("Please fill all fields");
return;
}

await axios.post(
"http://localhost:5000/api/courses",
{
course_code:form.course_code,
course_name:form.course_name,
program_id:form.program_id,
semester_id:form.semester_id,
hours_per_week:Number(form.hours_per_week),
course_type:form.course_type,
department:user?.department
}
);

alert("Course saved successfully");

fetchCourses();

setForm({
course_code:"",
course_name:"",
program_id:"",
semester_id:"",
hours_per_week:"",
course_type:""
});

}catch(err){
console.error(err);
alert("Error saving course");
}

};


return(

<div className="content-wrapper">

<h2 className="page-title">Course Management</h2>

<div className="form-card">

<div className="form-grid">

<div className="form-group">
<label>Course Code</label>
<input
name="course_code"
placeholder="Course Code"
value={form.course_code}
onChange={handleChange}
/>
</div>

<div className="form-group">
<label>Course Name</label>
<input
name="course_name"
placeholder="Course Name"
value={form.course_name}
onChange={handleChange}
/>
</div>

<div className="form-group">
<label>Program</label>
<select
name="program_id"
value={form.program_id}
onChange={handleChange}
>
<option value="">Select Program</option>

{programs.map(p=>(
<option key={p._id} value={p._id}>
{p.program_name}
</option>
))}

</select>
</div>

<div className="form-group">
<label>Semester</label>
<select
name="semester_id"
value={form.semester_id}
onChange={handleChange}
>
<option value="">Select Semester</option>

{semesters.map(s=>(
<option key={s._id} value={s._id}>
Semester {s.semester_number}
</option>
))}

</select>
</div>

<div className="form-group">
<label>Hours / Week</label>
<input
type="number"
name="hours_per_week"
placeholder="Hours per week"
value={form.hours_per_week}
onChange={handleChange}
/>
</div>

<div className="form-group">
<label>Course Type</label>
<select
name="course_type"
value={form.course_type}
onChange={handleChange}
>
<option value="">Select Type</option>
<option value="THEORY">THEORY</option>
<option value="LAB">LAB</option>
</select>
</div>

<div className="form-actions">
<button
className="primary-btn"
onClick={saveCourse}
>
Save Course
</button>
</div>

</div>

</div>


<div className="table-card">

<h3 className="table-title">Courses</h3>

<table className="table">

<thead>
<tr>
<th>#</th>
<th>Code</th>
<th>Name</th>
<th>Program</th>
<th>Semester</th>
<th>Hours</th>
<th>Type</th>
</tr>
</thead>

<tbody>

{courses.length === 0 ? (

<tr>
<td colSpan="7">No courses found</td>
</tr>

):(courses.map((c,i)=>(

<tr key={c._id}>
<td>{i+1}</td>
<td>{c.course_code}</td>
<td>{c.course_name}</td>
<td>{c.program_id?.program_name}</td>
<td>{c.semester_id?.semester_number}</td>
<td>{c.hours_per_week}</td>
<td>{c.course_type}</td>
</tr>

)))}

</tbody>

</table>

</div>

</div>

);

}