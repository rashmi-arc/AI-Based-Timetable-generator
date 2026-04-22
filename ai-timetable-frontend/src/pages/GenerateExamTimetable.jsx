import { useState, useEffect } from "react";
import axios from "axios";

function GenerateExamTimetable() {
  const [departments, setDepartments] = useState([]);
  const [deptId, setDeptId] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [batchYear, setBatchYear] = useState("2024");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchDepts = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/departments");
        setDepartments(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchDepts();
  }, []);

  const handleGenerate = async () => {
    if (!deptId || !startDate || !endDate || !batchYear) {
      alert("Please fill all fields");
      return;
    }

    try {
      setLoading(true);
      setMessage("Processing AI Schedule... (Skipping Sundays)");
      const res = await axios.post("http://localhost:5000/api/class-timetable/exam/generate", {
        deptId,
        startDate,
        endDate,
        batchYear
      });
      setMessage(res.data.message);
      alert(res.data.message);
    } catch (err) {
      console.error(err);
      setMessage("Failed to generate exam timetable");
      alert(err.response?.data?.message || "Generation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="content-wrapper">
      <div className="form-card">
        <h2 className="page-title">Generate Exam Timetable</h2>
        <p className="page-desc">Select criteria to automatically generate a conflict-free exam schedule</p>

        <div className="form-grid">
          <div className="form-group">
            <label>Department</label>
            <select value={deptId} onChange={(e) => setDeptId(e.target.value)}>
              <option value="">Select Department</option>
              {departments.map((d) => (
                <option key={d._id} value={d._id}>{d.dept_name}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Batch Year</label>
            <input type="text" value={batchYear} onChange={(e) => setBatchYear(e.target.value)} />
          </div>

          <div className="form-group">
            <label>Start Date</label>
            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
          </div>

          <div className="form-group">
            <label>End Date</label>
            <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
          </div>

          <div className="form-actions">
            <button className="primary-btn" onClick={handleGenerate} disabled={loading}>
              {loading ? "Generating..." : "Generate Exam Timetable"}
            </button>
          </div>
        </div>

        {message && <div style={{ marginTop: "20px", color: "#1e40af", fontWeight: "600" }}>{message}</div>}
      </div>
    </div>
  );
}

export default GenerateExamTimetable;
