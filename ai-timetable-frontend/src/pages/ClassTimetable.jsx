import { useEffect, useState } from "react";
import axios from "axios";

function ClassTimetable(){

const [programs,setPrograms] = useState([]);
const [semesters,setSemesters] = useState([]);
const [timetable,setTimetable] = useState([]);

const [programId,setProgramId] = useState("");
const [semesterId,setSemesterId] = useState("");
const [batchYear,setBatchYear] = useState("2024");

const [loading,setLoading] = useState(false);

useEffect(()=>{
loadPrograms();
loadSemesters();
},[]);


/* LOAD PROGRAMS */

const loadPrograms = async ()=>{
try{

const res = await axios.get("http://localhost:5000/api/programs");
setPrograms(res.data);

}catch(err){
console.error(err);
}
};


/* LOAD SEMESTERS */

const loadSemesters = async ()=>{
try{

const res = await axios.get("http://localhost:5000/api/semesters/all");
setSemesters(res.data);

}catch(err){
console.error(err);
}
};


/* GENERATE TIMETABLE */

const generateTimetable = async ()=>{

if(!programId || !semesterId || !batchYear){
alert("Please fill all fields");
return;
}

try{

setLoading(true);

const res = await axios.post(
"http://localhost:5000/api/class-timetable/generate",
{
programId,
semesterId,
batchYear
}
);

setTimetable(res.data);

}catch(err){

console.error(err);
alert("Generation failed");

}finally{

setLoading(false);

}

};


/* FIXED SLOT ORDER */

const slots = [
"period1",
"period2",
"period3",
"Lunch Break",
"period5",
"period6"
];


/* DAYS */

const days=[
"Monday",
"Tuesday",
"Wednesday",
"Thursday",
"Friday"
];


return(

<div className="content-wrapper">

{/* FORM */}

<div className="form-card">

<h2 className="page-title">
Generate Class Timetable
</h2>

<div className="form-grid">

{/* PROGRAM */}

<div className="form-group">

<label>Program</label>

<select
value={programId}
onChange={e=>setProgramId(e.target.value)}
>

<option value="">Select Program</option>

{programs.map(p=>(
<option key={p._id} value={p._id}>
{p.program_name}
</option>
))}

</select>

</div>


{/* SEMESTER */}

<div className="form-group">

<label>Semester</label>

<select
value={semesterId}
onChange={e=>setSemesterId(e.target.value)}
>

<option value="">Select Semester</option>

{semesters.map(s=>(
<option key={s._id} value={s._id}>
Semester {s.semester_number}
</option>
))}

</select>

</div>


{/* BATCH */}

<div className="form-group">

<label>Batch Year</label>

<input
value={batchYear}
onChange={e=>setBatchYear(e.target.value)}
placeholder="Example 2024"
/>

</div>


{/* BUTTON */}

<div className="form-actions">

<button
className="primary-btn"
onClick={generateTimetable}
disabled={loading}
>

{loading ? "Generating..." : "Generate Timetable"}

</button>

</div>

</div>

</div>


{/* TIMETABLE TABLE */}

{timetable.length > 0 && (

<div className="table-card">

<h3 className="table-title">
Generated Timetable
</h3>

<table className="table">

<thead>

<tr>

<th>Day</th>

{slots.map(slot=>(
<th key={slot}>
{slot.toUpperCase()}
</th>
))}

</tr>

</thead>


<tbody>

{days.map(day=>(

<tr key={day}>

<td className="day-cell">
{day}
</td>


{slots.map(slot=>{

/* LUNCH BREAK */

if(slot === "period4"){

return(

<td key={slot}>

<div className="lunch-cell">
🍱 LUNCH BREAK
</div>

</td>

);

}


/* FIND CLASS */

const cell = timetable.find(
t => t.day === day && t.slot === slot
);


/* EMPTY SLOT */

if(!cell){

return(

<td key={slot}>

<div className="empty-slot">
—
</div>

</td>

);

}


/* SHOW CLASS */

return(

<td key={slot}>

<div className="tt-course">
{cell.course}
</div>

<div className="tt-teacher">
👨‍🏫 {cell.teacher}
</div>

<div className="tt-room">
🏫 {cell.room}
</div>

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

export default ClassTimetable;