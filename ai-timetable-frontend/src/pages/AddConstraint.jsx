import { useEffect, useState } from "react";
import {
  getConstraintMaster,
  saveConstraints,
  getConstraints,
} from "../services/constraintService";
import { getDepartments } from "../services/departmentService";
import { getPrograms } from "../services/programService";

export default function AddConstraint() {

  const [masters,setMasters] = useState([]);
  const [saved,setSaved] = useState([]);
  const [departments,setDepartments] = useState([]);
  const [programs,setPrograms] = useState([]);

  const [dept,setDept] = useState("");
  const [program,setProgram] = useState("");
  const [batchYear,setBatchYear] = useState("");

  const [selected,setSelected] = useState({});

  useEffect(()=>{

    getConstraintMaster().then(r=>setMasters(r.data));
    getConstraints().then(r=>setSaved(r.data));
    getDepartments().then(r=>setDepartments(r.data));
    getPrograms().then(r=>setPrograms(r.data));

  },[]);


  const save = async()=>{

    if(!dept || !program || !batchYear){
      alert("Please select Department, Program & Batch Year");
      return;
    }

    try{

      const promises=[];

      Object.keys(selected).forEach(id=>{

        if(selected[id]){

          const payload={
            dept_id:dept,
            program_id:program,
            batch_year:batchYear,
            constraint_id:id
          };

          promises.push(saveConstraints(payload));

        }

      });

      await Promise.all(promises);

      alert("Constraints saved");

      setSelected({});

      getConstraints().then(r=>setSaved(r.data));

    }catch(err){

      console.error(err);
      alert("Error saving constraints");

    }

  };


  const renderGroup=(title,category)=>(

    <div className="constraint-group">

      <h3 className="constraint-title">{title}</h3>

      {masters
        .filter(m=>m.constraint_category===category)
        .map(m=>(

          <label key={m._id} className="constraint-item">

            <input
              type="checkbox"
              checked={selected[m._id] || false}
              onChange={()=>setSelected({
                ...selected,
                [m._id]:!selected[m._id]
              })}
            />

            {m.constraint_name}

          </label>

        ))}

    </div>

  );


  return(

    <>

      <h2 className="page-title">Assign Constraints</h2>

      <p className="page-desc">
        Define rules for AI timetable generation
      </p>


      <div className="form-card">

        <div className="form-grid">

          <div className="form-group">

            <label>Department</label>

            <select value={dept} onChange={(e)=>setDept(e.target.value)}>

              <option value="">Select Department</option>

              {departments.map(d=>(
                <option key={d._id} value={d._id}>
                  {d.dept_name}
                </option>
              ))}

            </select>

          </div>


          <div className="form-group">

            <label>Program</label>

            <select value={program} onChange={(e)=>setProgram(e.target.value)}>

              <option value="">Select Program</option>

              {programs.map(p=>(
                <option key={p._id} value={p._id}>
                  {p.program_name}
                </option>
              ))}

            </select>

          </div>


          <div className="form-group">

            <label>Batch Year</label>

            <input
              placeholder="e.g. 2024"
              value={batchYear}
              onChange={(e)=>setBatchYear(e.target.value)}
            />

          </div>

        </div>

        <hr className="section-divider"/>

        {renderGroup("Class Timetable Constraints","class")}
        {renderGroup("Exam Timetable Constraints","exam")}

        <button className="primary-btn" onClick={save}>
          Save Constraints
        </button>

      </div>


      <div className="table-card">

        <h3 className="table-title">Assigned Constraints</h3>

        <table className="table">

          <thead>

            <tr>
              <th>#</th>
              <th>Department</th>
              <th>Program</th>
              <th>Constraint</th>
            </tr>

          </thead>

          <tbody>

            {saved.map((c,i)=>(
              <tr key={c._id}>
                <td>{i+1}</td>
                <td>{c.dept_id?.dept_name}</td>
                <td>{c.program_id?.program_name}</td>
                <td>{c.constraint_id?.constraint_name}</td>
              </tr>
            ))}

          </tbody>

        </table>

      </div>

    </>

  );

}