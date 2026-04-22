import { useEffect, useState } from "react";
import axios from "axios";

function ViewTimetable(){

const [programs,setPrograms] = useState([]);
const [semesters,setSemesters] = useState([]);
const [timetable,setTimetable] = useState([]);

const [programId,setProgramId] = useState("");
const [semesterId,setSemesterId] = useState("");

const [loading,setLoading] = useState(false);


/* LOAD DATA */

useEffect(()=>{

loadPrograms();
loadSemesters();

},[]);


/* LOAD PROGRAMS */

const loadPrograms = async()=>{

try{

const res = await axios.get("http://localhost:5000/api/programs");

setPrograms(res.data);

}catch(err){

console.error(err);

}

};


/* LOAD SEMESTERS */

const loadSemesters = async()=>{

try{

const res = await axios.get("http://localhost:5000/api/semesters/all");

setSemesters(res.data);

}catch(err){

console.error(err);

}

};


/* LOAD TIMETABLE */

const loadTimetable = async()=>{

if(!programId || !semesterId){

alert("Please select program and semester");
return;

}

try{

setLoading(true);

const res = await axios.get(
`http://localhost:5000/api/class-timetable/student/${programId}/${semesterId}`
);

setTimetable(res.data);

}catch(err){

console.error(err);

alert("Failed to load timetable");

}

finally{

setLoading(false);

}

};


/* TABLE STRUCTURE */

const slots = ["period1","period2","period3","Lunch Break","period5","period6"];

const days = ["Monday","Tuesday","Wednesday","Thursday","Friday"];


/* UI */

return(

<div className="content-wrapper">

<div className="form-card">

<h2 className="page-title">View Class Timetable</h2>

<div className="form-grid">

<div className="form-group">

<label>Program</label>

<select
value={programId}
onChange={(e)=>setProgramId(e.target.value)}
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
value={semesterId}
onChange={(e)=>setSemesterId(e.target.value)}
>

<option value="">Select Semester</option>

{semesters.map(s=>(
<option key={s._id} value={s._id}>
Semester {s.semester_number}
</option>
))}

</select>

</div>


<div className="form-actions">

<button
className="primary-btn"
onClick={loadTimetable}
disabled={loading}
>

{loading ? "Loading..." : "View Timetable"}

</button>

</div>

</div>

</div>


{timetable.length>0 &&(

<div className="table-card">

<table className="table">

<thead>

<tr>

<th>Day</th>

{slots.map(slot=>(
<th key={slot}>{slot.toUpperCase()}</th>
))}

</tr>

</thead>

<tbody>

{days.map(day=>(

<tr key={day}>

<td>{day}</td>

{slots.map(slot=>{

if(slot==="period4"){
return <td key={slot}>Lunch</td>;
}

const cell = timetable.find(t=>t.day===day && t.slot===slot);

if(!cell){
return <td key={slot}>-</td>;
}

return(

<td key={slot}>
<b>{cell.course}</b>
<br/>
{cell.teacher}
<br/>
{cell.room}
</td>

);

})}

</tr>

))}

</tbody>

</table>

</div>

)}

</div>

);

}

export default ViewTimetable;