import { useEffect, useState } from "react";
import axios from "axios";

export default function TeacherDashboard() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [timetable, setTimetable] = useState([]);
  const [examTimetable, setExamTimetable] = useState([]);
  const [view, setView] = useState("class"); // "class" or "exam"
  const [loading, setLoading] = useState(false);
  const [semesters, setSemesters] = useState([]);
  const [selectedSem, setSelectedSem] = useState("all");

  useEffect(() => {
    if (view === "class") {
        loadTimetable();
    } else {
        loadSemesters();
        loadExamTimetable();
    }
  }, [view]);

  const loadTimetable = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`http://localhost:5000/api/class-timetable/teacher/${user._id}`);
      setTimetable(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadSemesters = async () => {
     try {
       const res = await axios.get("http://localhost:5000/api/semesters/all");
       setSemesters(res.data);
     } catch (err) {
       console.error(err);
     }
  };

  const loadExamTimetable = async () => {
    if (!user.dept_id) return;
    try {
      setLoading(true);
      const res = await axios.get(`http://localhost:5000/api/class-timetable/exam/${user.dept_id}`);
      setExamTimetable(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const slots = ["period1", "period2", "period3", "period4", "period5", "period6"];
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

  // Group exam timetable by date (same as HOD view)
  const groupedExams = {};
  const filteredExams = selectedSem === "all" 
    ? examTimetable 
    : examTimetable.filter(item => String(item.semester_id?._id || item.semester_id) === selectedSem);

  filteredExams.forEach(item => {
    const d = new Date(item.date);
    const key = d.toISOString().split('T')[0];
    if (!groupedExams[key]) {
      groupedExams[key] = { Morning: [], Afternoon: [], rawDate: d };
    }
    if (item.slot === "Morning") groupedExams[key].Morning.push(item);
    else groupedExams[key].Afternoon.push(item);
  });

  const sortedKeys = Object.keys(groupedExams).sort();

  const formatDate = (date) => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  return (
    <div className="content-wrapper">
       <div className="tab-container">
        <button 
          className={`tab-btn ${view === 'class' ? 'active' : ''}`} 
          onClick={() => setView("class")}
        >
          My Timetable
        </button>
        <button 
          className={`tab-btn ${view === 'exam' ? 'active' : ''}`} 
          onClick={() => setView("exam")}
        >
          Dept Exam Timetable
        </button>
      </div>

      {view === "class" ? (
        <div className="table-card">
          <h2 className="page-title">Teacher Timetable</h2>
          <p className="page-desc">Your weekly teaching schedule</p>

          <table className="table">
            <thead>
              <tr>
                <th>Day</th>
                {slots.map(slot => (
                  <th key={slot}>{slot.toUpperCase()}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {days.map(day => (
                <tr key={day}>
                  <td className="day-cell">{day}</td>
                  {slots.map(slot => {
                    if (slot === "period4") return <td key={slot}><div className="lunch-cell">🍱 LUNCH BREAK</div></td>;
                    const cell = timetable.find(t => t.day === day && t.slot === slot);
                    if (!cell) return <td key={slot}><div className="empty-slot">—</div></td>;
                    return (
                      <td key={slot}>
                        <div className="tt-course">{cell.course}</div>
                        <div className="tt-room">🏫 {cell.room}</div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="table-card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
            <div>
              <h2 className="page-title">Dept Exam Timetable</h2>
              <p className="page-desc">Full department exam schedule filtered by semester</p>
            </div>
            <div className="form-group" style={{ marginBottom: 0, minWidth: "200px" }}>
              <select value={selectedSem} onChange={(e) => setSelectedSem(e.target.value)}>
                <option value="all">All Semesters</option>
                {semesters.map(sem => (
                  <option key={sem._id} value={sem._id}>Semester {sem.semester_number}</option>
                ))}
              </select>
            </div>
          </div>

          <table className="table">
            <thead>
              <tr style={{ backgroundColor: "#1e40af", color: "white" }}>
                <th style={{ padding: "15px" }}>Date</th>
                <th>Morning (9:00 AM - 12:00 PM)</th>
                <th>Afternoon (02:00 PM - 05:00 PM)</th>
              </tr>
            </thead>
            <tbody>
              {sortedKeys.length > 0 ? sortedKeys.map(key => {
                const dayData = groupedExams[key];
                const dateLabel = formatDate(dayData.rawDate);
                return (
                  <tr key={key}>
                    <td style={{ fontWeight: "600", color: "#64748b" }}>📅 {dateLabel}</td>
                    <td>
                      {dayData.Morning.length > 0 ? dayData.Morning.map((m, i) => (
                        <div key={i} className="tt-box" style={{ padding: "8px", backgroundColor: "#eff6ff", borderRadius: "6px", border: "1px solid #bfdbfe", marginBottom: "5px" }}>
                          <div style={{ color: "#1e40af", fontWeight: "700", fontSize: "13px" }}>📘 {m.course_id?.course_name}</div>
                          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", color: "#64748b", marginTop: "4px" }}>
                            <span>Sem {m.semester_id?.semester_number}</span>
                            <span>🏫 {m.room_id?.room_name}</span>
                          </div>
                        </div>
                      )) : <span style={{ color: "#cbd5e1" }}>—</span>}
                    </td>
                    <td>
                      {dayData.Afternoon.length > 0 ? dayData.Afternoon.map((a, i) => (
                        <div key={i} className="tt-box" style={{ padding: "8px", backgroundColor: "#eff6ff", borderRadius: "6px", border: "1px solid #bfdbfe", marginBottom: "5px" }}>
                          <div style={{ color: "#1e40af", fontWeight: "700", fontSize: "13px" }}>📘 {a.course_id?.course_name}</div>
                          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", color: "#64748b", marginTop: "4px" }}>
                            <span>Sem {a.semester_id?.semester_number}</span>
                            <span>🏫 {a.room_id?.room_name}</span>
                          </div>
                        </div>
                      )) : <span style={{ color: "#cbd5e1" }}>—</span>}
                    </td>
                  </tr>
                );
              }) : (
                <tr>
                  <td colSpan="3" style={{ textAlign: "center", padding: "30px", color: "#94a3b8" }}>
                    No exam schedules found for this department.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}