import { useState, useEffect } from "react";
import axios from "axios";

function ViewExamTimetable() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [departments, setDepartments] = useState([]);
  const [deptId, setDeptId] = useState(user?.role === "HOD" ? user.dept_id : "");
  const [timetable, setTimetable] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const [semesters, setSemesters] = useState([]);
  const [selectedSem, setSelectedSem] = useState("all");

  useEffect(() => {
    fetchDepts();
    fetchSemesters();
    if (user?.role === "HOD") {
      fetchTimetableInternal(user.dept_id);
    }
  }, []);

  const fetchDepts = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/departments");
      setDepartments(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchSemesters = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/semesters/all");
      setSemesters(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchTimetableInternal = async (id) => {
    if (!id) return;
    try {
      setLoading(true);
      const res = await axios.get(`http://localhost:5000/api/class-timetable/exam/${id}`);
      setTimetable(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFetch = () => {
    fetchTimetableInternal(deptId);
  };

  // Group timetable by date
  const groupedTimetable = {};
  
  // Filter by semester if not "all"
  const filteredTimetable = selectedSem === "all" 
    ? timetable 
    : timetable.filter(item => String(item.semester_id?._id) === selectedSem);

  filteredTimetable.forEach(item => {
    const d = new Date(item.date);
    const key = d.toISOString().split('T')[0];
    if (!groupedTimetable[key]) {
      groupedTimetable[key] = { Morning: null, Afternoon: null, rawDate: d };
    }
    // Note: If multiple exams exist for the same slot (different semesters), 
    // we need to handle them in the grid.
    if (!groupedTimetable[key][item.slot]) {
        groupedTimetable[key][item.slot] = [item];
    } else {
        groupedTimetable[key][item.slot].push(item);
    }
  });

  const sortedKeys = Object.keys(groupedTimetable).sort();

  const formatDate = (date) => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  return (
    <div className="content-wrapper">
      <div className="form-card">
        <h1 className="page-title">Exam Timetable</h1>
        
        <div className="form-grid">
          <div className="form-group">
            <label>Department</label>
            <select 
              value={deptId} 
              onChange={(e) => setDeptId(e.target.value)}
              disabled={user?.role === "HOD"}
            >
                <option value="">Select Department</option>
                {departments.map((d) => (
                  <option key={d._id} value={d._id}>{d.dept_name}</option>
                ))}
            </select>
          </div>

          <div className="form-group">
            <label>Semester Filter</label>
            <select value={selectedSem} onChange={(e) => setSelectedSem(e.target.value)}>
               <option value="all">All Semesters</option>
               {semesters.map(s => (
                 <option key={s._id} value={s._id}>Semester {s.semester_number}</option>
               ))}
            </select>
          </div>

          <div className="form-actions">
            <button className="primary-btn" onClick={handleFetch} disabled={loading}>
                {loading ? "Loading..." : "View Schedule"}
            </button>
          </div>
        </div>
      </div>

      {sortedKeys.length > 0 && (
        <div className="table-card">
          <table className="table">
            <thead>
              <tr style={{ backgroundColor: "#1e40af", color: "white" }}>
                <th style={{ padding: "15px" }}>Date</th>
                <th>Morning (9:00 AM - 12:00 PM)</th>
                <th>Afternoon (02:00 PM - 05:00 PM)</th>
              </tr>
            </thead>
            <tbody>
              {sortedKeys.map(key => {
                const dayData = groupedTimetable[key];
                const dateLabel = formatDate(dayData.rawDate);
                return (
                  <tr key={key}>
                    <td style={{ fontWeight: "600", color: "#64748b" }}>
                      📅 {dateLabel}
                    </td>
                    <td>
                      {dayData.Morning ? dayData.Morning.map((m, i) => (
                        <div key={i} className="tt-box" style={{ padding: "10px", backgroundColor: "#eff6ff", borderRadius: "8px", border: "1px solid #bfdbfe", marginBottom: "5px" }}>
                          <div style={{ color: "#1e40af", fontWeight: "700", fontSize: "14px" }}>📘 {m.course_id.course_name}</div>
                          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", color: "#64748b", marginTop: "4px" }}>
                            <span>Sem {m.semester_id.semester_number}</span>
                            <span>🏫 {m.room_id.room_name}</span>
                          </div>
                        </div>
                      )) : <span style={{ color: "#cbd5e1" }}>—</span>}
                    </td>
                    <td>
                      {dayData.Afternoon ? dayData.Afternoon.map((a, i) => (
                        <div key={i} className="tt-box" style={{ padding: "10px", backgroundColor: "#eff6ff", borderRadius: "8px", border: "1px solid #bfdbfe", marginBottom: "5px" }}>
                          <div style={{ color: "#1e40af", fontWeight: "700", fontSize: "14px" }}>📘 {a.course_id.course_name}</div>
                          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", color: "#64748b", marginTop: "4px" }}>
                            <span>Sem {a.semester_id.semester_number}</span>
                            <span>🏫 {a.room_id.room_name}</span>
                          </div>
                        </div>
                      )) : <span style={{ color: "#cbd5e1" }}>—</span>}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default ViewExamTimetable;
