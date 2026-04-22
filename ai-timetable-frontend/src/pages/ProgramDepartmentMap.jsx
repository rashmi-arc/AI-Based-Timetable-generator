import { useEffect, useState } from "react";
import { getPrograms } from "../services/programService";
import { getDepartments } from "../services/departmentService";
import { addPDM, getPDMs } from "../services/pdmService";

export default function ProgramDepartmentMap() {
  const [programs, setPrograms] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [mappings, setMappings] = useState([]);

  const [form, setForm] = useState({
    program_id: "",
    dept_id: ""
  });

  // LOAD DATA
  useEffect(() => {
    loadAll();
  }, []);

  const loadAll = async () => {
    const p = await getPrograms();
    const d = await getDepartments();
    const m = await getPDMs();

    setPrograms(p.data);
    setDepartments(d.data);
    setMappings(m.data);
  };

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.program_id || !form.dept_id) {
      alert("Select both Program and Department");
      return;
    }

    try {
      await addPDM(form);
      alert("Mapped Successfully");

      setForm({ program_id: "", dept_id: "" });
      loadAll(); // 🔥 refresh table
    } catch (err) {
      alert(err.response?.data?.message || "Error saving mapping");
    }
  };

  return (
    <>
      {/* FORM CARD */}
     
        <h2 className="page-title">Program ↔ Department Mapping</h2>
        <p className="page-desc">Map academic programs to departments</p>
<div className="form-card">
        <form className="form-grid" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Program</label>
            <select
              name="program_id"
              value={form.program_id}
              onChange={handleChange}
            >
              <option value="">Select Program</option>
              {programs.map((p) => (
                <option key={p._id} value={p._id}>
                  {p.program_name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Department</label>
            <select
              name="dept_id"
              value={form.dept_id}
              onChange={handleChange}
            >
              <option value="">Select Department</option>
              {departments.map((d) => (
                <option key={d._id} value={d._id}>
                  {d.dept_name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-actions">
            <button className="primary-btn">Save Mapping</button>
          </div>
        </form>
      </div>

      {/* TABLE CARD */}
      <div className="table-card">
        <h3 className="table-title">Existing Mappings</h3>

        <table className="table">
          <thead>
            <tr>
              <th>#</th>
              <th>Program</th>
              <th>Department</th>
            </tr>
          </thead>
          <tbody>
            {mappings.length === 0 ? (
              <tr>
                <td colSpan="3" style={{ textAlign: "center" }}>
                  No mappings found
                </td>
              </tr>
            ) : (
              mappings.map((m, i) => (
                <tr key={m._id}>
                  <td>{i + 1}</td>
                  <td>{m.program_id?.program_name}</td>
                  <td>{m.dept_id?.dept_name}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
