import { useEffect, useState } from "react";
import axios from "axios";

export default function CourseTeacherMapping(){

const user = JSON.parse(localStorage.getItem("user"));
const token = localStorage.getItem("token");

const [courses,setCourses] = useState([]);
const [teachers,setTeachers] = useState([]);
const [mappings,setMappings] = useState([]);

const [form,setForm] = useState({
course_id:"",
user_id:"",
batch_year:""
});


useEffect(()=>{
loadData();
},[]);


const loadData = async ()=>{

await fetchCourses();

if(user?.dept_id){
await fetchTeachers(user.dept_id);
}

await fetchMappings();

};


const fetchCourses = async ()=>{

const res = await axios.get("http://localhost:5000/api/courses");

const filtered = res.data.filter(
c => c.department === user.department
);

setCourses(filtered);

};


const fetchTeachers = async (deptId)=>{

const res = await axios.get(
`http://localhost:5000/api/users/teachers/${deptId}`,
{
headers:{
Authorization:`Bearer ${token}`
}
}
);

setTeachers(res.data);

};


const fetchMappings = async ()=>{

const res = await axios.get(
"http://localhost:5000/api/course-teacher-map"
);

setMappings(res.data);

};


const handleChange=(e)=>{
setForm({
...form,
[e.target.name]:e.target.value
});
};


const saveMapping=async()=>{

if(!form.course_id || !form.user_id || !form.batch_year){
alert("Fill all fields");
return;
}

await axios.post(
"http://localhost:5000/api/course-teacher-map/add",
form
);

fetchMappings();

setForm({
course_id:"",
user_id:"",
batch_year:""
});

};


const deleteMapping=async(id)=>{

if(!window.confirm("Delete mapping?")) return;

await axios.delete(
`http://localhost:5000/api/course-teacher-map/${id}`
);

fetchMappings();

};


return(

<div className="content-wrapper">

<h2 className="page-title">
Course ↔ Teacher Mapping
</h2>

<p className="page-desc">
Assign teachers to department courses
</p>


{/* FORM */}
<div className="form-card">

<div className="form-grid">

<div className="form-group">
<label>Course</label>
<select
name="course_id"
value={form.course_id}
onChange={handleChange}
>
<option value="">Select Course</option>

{courses.map(c=>(
<option key={c._id} value={c._id}>
{c.course_code} - {c.course_name}
</option>
))}

</select>
</div>


<div className="form-group">
<label>Teacher</label>
<select
name="user_id"
value={form.user_id}
onChange={handleChange}
>
<option value="">Select Teacher</option>

{teachers.map(t=>(
<option key={t._id} value={t._id}>
{t.name}
</option>
))}

</select>
</div>


<div className="form-group">
<label>Batch Year</label>
<input
name="batch_year"
placeholder="Example: 2024"
value={form.batch_year}
onChange={handleChange}
/>
</div>


<div className="form-actions">
<button
className="primary-btn"
onClick={saveMapping}
>
Save Mapping
</button>
</div>

</div>

</div>


{/* TABLE */}
<div className="table-card">

<h3 className="table-title">
Course Teacher Mappings
</h3>

<table className="table">

<thead>
<tr>
<th>#</th>
<th>Course</th>
<th>Teacher</th>
<th>Batch</th>
<th>Action</th>
</tr>
</thead>

<tbody>

{mappings.map((m,i)=>(
<tr key={m._id}>

<td>{i+1}</td>

<td>{m.course_id?.course_code}</td>

<td>{m.user_id?.name}</td>

<td>{m.batch_year}</td>

<td>
<button
className="logout-btn"
onClick={()=>deleteMapping(m._id)}
>
Delete
</button>
</td>

</tr>
))}

</tbody>

</table>

</div>

</div>

);

}