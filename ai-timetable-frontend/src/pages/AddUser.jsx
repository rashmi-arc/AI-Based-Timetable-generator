import { useEffect, useState } from "react";

function AddUser(){

const [form,setForm] = useState({
name:"",
email:"",
password:"",
role:"TEACHER",
dept_id:"",
program_id:"",
semester_id:""
});

const [departments,setDepartments] = useState([]);
const [programs,setPrograms] = useState([]);
const [programMaps,setProgramMaps] = useState([]);
const [filteredPrograms,setFilteredPrograms] = useState([]);
const [semesters,setSemesters] = useState([]);
const [users,setUsers] = useState([]);


/* LOAD DATA */

useEffect(()=>{

loadDepartments();
loadPrograms();
loadProgramMaps();
loadSemesters();
loadUsers();

},[]);


/* LOAD DEPARTMENTS */

const loadDepartments = async()=>{

const res = await fetch("http://localhost:5000/api/departments");
const data = await res.json();

setDepartments(data);

};


/* LOAD PROGRAMS */

const loadPrograms = async()=>{

const res = await fetch("http://localhost:5000/api/programs");
const data = await res.json();

setPrograms(data);

};


/* LOAD PROGRAM-DEPARTMENT MAP */

const loadProgramMaps = async()=>{

const res = await fetch("http://localhost:5000/api/pdm");
const data = await res.json();

setProgramMaps(data);

};


/* LOAD SEMESTERS */

const loadSemesters = async()=>{

const res = await fetch("http://localhost:5000/api/semesters/all");
const data = await res.json();

setSemesters(data);

};


/* LOAD USERS */

const loadUsers = async()=>{

const token = localStorage.getItem("token");

const res = await fetch("http://localhost:5000/api/users",{
headers:{
Authorization:`Bearer ${token}`
}
});

const data = await res.json();

if(Array.isArray(data)){
setUsers(data);
}else{
setUsers([]);
}

};


/* HANDLE INPUT */

const handleChange = (e)=>{

const {name,value} = e.target;

setForm(prev=>({
...prev,
[name]:value
}));


/* FILTER PROGRAMS WHEN DEPARTMENT CHANGES */

if(name==="dept_id"){

const mappedPrograms = programMaps
.filter(m => String(m.dept_id._id) === value)
.map(m => String(m.program_id._id));

const filtered = programs.filter(p =>
mappedPrograms.includes(String(p._id))
);

setFilteredPrograms(filtered);

}

};


/* SAVE USER */

const saveUser = async()=>{

if(!form.name || !form.email || !form.password){
alert("Please fill all fields");
return;
}

if(form.role==="STUDENT" && (!form.program_id || !form.semester_id)){
alert("Please select program and semester");
return;
}

const token = localStorage.getItem("token");

const res = await fetch("http://localhost:5000/api/users/add",{

method:"POST",

headers:{
"Content-Type":"application/json",
Authorization:`Bearer ${token}`
},

body:JSON.stringify(form)

});

const data = await res.json();

if(res.ok){

alert("User added successfully");

setForm({
name:"",
email:"",
password:"",
role:"TEACHER",
dept_id:"",
program_id:"",
semester_id:""
});

setFilteredPrograms([]);

loadUsers();

}else{

alert(data.message);

}

};


/* DELETE USER */

const deleteUser = async(id)=>{

const token = localStorage.getItem("token");

await fetch(`http://localhost:5000/api/users/${id}`,{
method:"DELETE",
headers:{
Authorization:`Bearer ${token}`
}
});

loadUsers();

};


/* UI */

return(

<div className="content-wrapper">

<h2 className="page-title">User Management</h2>
<p className="page-desc">Create and manage system users</p>


<div className="form-card">

<div className="form-grid">

{/* NAME */}

<div className="form-group">
<label>Name</label>
<input
name="name"
value={form.name}
onChange={handleChange}
/>
</div>


{/* EMAIL */}

<div className="form-group">
<label>Email</label>
<input
name="email"
value={form.email}
onChange={handleChange}
/>
</div>


{/* PASSWORD */}

<div className="form-group">
<label>Password</label>
<input
type="password"
name="password"
value={form.password}
onChange={handleChange}
/>
</div>


{/* ROLE */}

<div className="form-group">

<label>Role</label>

<select
name="role"
value={form.role}
onChange={handleChange}
>

<option value="TEACHER">Teacher</option>
<option value="HOD">HOD</option>
<option value="STUDENT">Student</option>

</select>

</div>


{/* DEPARTMENT */}

<div className="form-group">

<label>Department</label>

<select
name="dept_id"
value={form.dept_id}
onChange={handleChange}
>

<option value="">Select Department</option>

{departments.map(d=>(
<option key={d._id} value={d._id}>
{d.dept_name}
</option>
))}

</select>

</div>


{/* STUDENT FIELDS */}

{form.role==="STUDENT" &&(

<>

<div className="form-group">

<label>Program</label>

<select
name="program_id"
value={form.program_id}
onChange={handleChange}
>

<option value="">Select Program</option>

{filteredPrograms.map(p=>(
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

</>

)}


<div className="form-actions">

<button
className="primary-btn"
onClick={saveUser}
>
Add User
</button>

</div>

</div>

</div>


<div className="table-card">

<h3 className="table-title">Existing Users</h3>

<table className="table">

<thead>

<tr>
<th>#</th>
<th>Name</th>
<th>Email</th>
<th>Role</th>
<th>Department</th>
<th>Action</th>
</tr>

</thead>

<tbody>

{users.map((u,i)=>(
<tr key={u._id}>

<td>{i+1}</td>
<td>{u.name}</td>
<td>{u.email}</td>
<td>{u.role}</td>
<td>{u.dept_id?.dept_name || "-"}</td>

<td>
<button onClick={()=>deleteUser(u._id)}>
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

export default AddUser;