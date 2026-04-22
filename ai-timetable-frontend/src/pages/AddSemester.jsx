import { useEffect, useState } from "react";
import axios from "axios";

export default function Semesters() {
  const [programs, setPrograms] = useState([]);
  const [semesters, setSemesters] = useState([]);

  const [form, setForm] = useState({
    program: "",
    semester_number: "",
    start_date: ""
  });

  useEffect(() => {
    loadPrograms();
    loadSemesters();
  }, []);

  const loadPrograms = async () => {
    const res = await axios.get("http://localhost:5000/api/programs");
    setPrograms(res.data || []);
  };

  const loadSemesters = async () => {
    const res = await axios.get("http://localhost:5000/api/semesters/all");
    setSemesters(res.data || []);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm({
      ...form,
      [name]:
        name === "semester_number"
          ? Number(value)
          : value
    });
  };

  const saveSemester = async () => {
    if (!form.program || !form.semester_number || !form.start_date) {
      alert("Fill all fields");
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:5000/api/semesters/add",
        {
          program: form.program,
          semester_number: Number(form.semester_number),
          start_date: form.start_date
        }
      );

      alert(res.data.message);

      setForm({
        program: "",
        semester_number: "",
        start_date: ""
      });

      loadSemesters();

    } catch (err) {
      console.log(err.response?.data);
      alert(err.response?.data?.message);
    }
  };

  return (
    <>
      <h2 className="page-title">Semester Management</h2>

      <div className="form-card">
        <div className="form-grid">

          <div className="form-group">
            <label>Program</label>
            <select
              name="program"
              value={form.program}
              onChange={handleChange}
            >
              <option value="">Select Program</option>

              {programs.map((p) => (
                <option key={p._id} value={p._id}>
                  {p.program_name || p.name}
                </option>
              ))}

            </select>
          </div>

          <div className="form-group">
            <label>Semester</label>
            <select
              name="semester_number"
              value={form.semester_number}
              onChange={handleChange}
            >
              <option value="">Select</option>
              {[1,2,3,4,5,6,7,8].map(n => (
                <option key={n} value={n}>
                  Semester {n}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Date</label>
            <input
              type="date"
              name="start_date"
              value={form.start_date}
              onChange={handleChange}
            />
          </div>

          <div className="form-actions">
            <button onClick={saveSemester} className="primary-btn">
              Save Semester
            </button>
          </div>

        </div>
      </div>

      <div className="table-card">
        <table className="table">
          <thead>
            <tr>
              <th>#</th>
              <th>Program</th>
              <th>Semester</th>
              <th>Date</th>
            </tr>
          </thead>

          <tbody>
            {semesters.map((s, i) => (
              <tr key={s._id}>
                <td>{i + 1}</td>
                <td>{s.program?.program_name || "-"}</td>
                <td>{s.semester_number}</td>
                <td>{new Date(s.start_date).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>

        </table>
      </div>
    </>
  );
}