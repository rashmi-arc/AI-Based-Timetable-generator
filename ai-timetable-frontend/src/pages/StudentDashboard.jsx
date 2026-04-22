import { useEffect, useState } from "react";
import axios from "axios";

export default function StudentDashboard() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [timetable, setTimetable] = useState([]);
  const [examTimetable, setExamTimetable] = useState([]);
  const [view, setView] = useState("class"); // "class" or "exam"
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (view === "class") {
        loadTimetable();
    } else {
        loadExamTimetable();
    }
  }, [view]);

  const loadTimetable = async () => {
    if (!user.program_id || !user.semester_id) return;
    try {
      setLoading(true);
      const res = await axios.get(
        `http://localhost:5000/api/class-timetable/student/${user.program_id}/${user.semester_id}`
      );
      setTimetable(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadExamTimetable = async () => {
    if (!user.dept_id) return;
    try {
      setLoading(true);
      const res = await axios.get(`http://localhost:5000/api/class-timetable/exam/${user.dept_id}`);
      // Filter only for student's semester
      const myExams = res.data.filter(ex => String(ex.semester_id?._id) === String(user.semester_id));
      setExamTimetable(myExams);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!user.program_id || !user.semester_id || !user.dept_id) {
    return (
      <div className="content-wrapper">
        <div className="form-card">
          <h2 className="page-title">Action Required</h2>
          <p style={{ color: "red", fontWeight: "bold", marginBottom: "15px" }}>
             Your session is missing required details. Please RESTART YOUR BACKEND SERVER, then LOG OUT and LOG IN again to refresh your account data.
          </p>
          <div style={{ fontSize: "12px", background: "#f8fafc", padding: "10px", borderRadius: "6px" }}>
             <strong>Debug Info:</strong><br/>
             Program ID: {user.program_id ? "✅ Set" : "❌ Missing"}<br/>
             Semester ID: {user.semester_id ? "✅ Set" : "❌ Missing"}<br/>
             Dept ID: {user.dept_id ? "✅ Set" : "❌ Missing"}
          </div>
        </div>
      </div>
    );
  }

  const slots = ["period1", "period2", "period3", "period4", "period5", "period6"];
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

  return (
    <div className="content-wrapper">
      <div className="tab-container">
        <button 
          className={`tab-btn ${view === 'class' ? 'active' : ''}`} 
          onClick={() => setView("class")}
        >
          Class Timetable
        </button>
        <button 
          className={`tab-btn ${view === 'exam' ? 'active' : ''}`} 
          onClick={() => setView("exam")}
        >
          Exam Timetable
        </button>
      </div>

      {view === "class" ? (
        <div className="table-card">
          <h2 className="page-title">Class Timetable</h2>
          <p className="page-desc">Weekly schedule for your program</p>

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
                        <div className="tt-teacher">👨‍🏫 {cell.teacher}</div>
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
        <div className="table-card" style={{ background: "transparent", boxShadow: "none", padding: "0" }}>
          <div style={{ background: "white", padding: "20px", borderRadius: "12px", marginBottom: "20px", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }}>
            <h2 className="page-title">Exam Timetable</h2>
            <p className="page-desc">Schedule for your semester exams</p>
          </div>
          
          {loading ? (
            <div className="loading-spinner">Loading exam schedule...</div>
          ) : (
            <div className="exam-grid-container">
              {Object.keys(examTimetable.reduce((acc, ex) => {
                const d = new Date(ex.date).toLocaleDateString('en-GB').replace(/\//g, '-');
                if(!acc[d]) acc[d] = [];
                acc[d].push(ex);
                return acc;
              }, {})).length > 0 ? (
                Object.entries(examTimetable.reduce((acc, ex) => {
                  const d = new Date(ex.date).toLocaleDateString('en-GB').replace(/\//g, '-');
                  if(!acc[d]) acc[d] = [];
                  acc[d].push(ex);
                  return acc;
                }, {})).sort((a,b) => new Date(a[1][0].date) - new Date(b[1][0].date)).map(([date, exams]) => (
                  <div key={date} className="exam-date-group">
                    <div className="exam-date-header">
                      <span className="calendar-icon">📅</span> {date}
                    </div>
                    <div className="exam-cards-grid">
                      {exams.sort((a,b) => a.slot === 'Morning' ? -1 : 1).map((m, idx) => (
                        <div key={idx} className={`exam-card ${m.slot.toLowerCase()}`}>
                          <div className="exam-card-slot">
                            <span className={`slot-badge ${m.slot.toLowerCase()}`}>{m.slot.toUpperCase()}</span>
                          </div>
                          <div className="exam-card-content">
                            <div className="exam-course-title">📘 {m.course_id?.course_name}</div>
                            <div className="exam-details-row">
                              <span className="exam-room-tag">🏫 {m.room_id?.room_name}</span>
                              <span className="exam-sem-tag">Sem {m.semester_id?.semester_number}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                <div className="empty-state-card">
                   <div style={{ fontSize: "40px", marginBottom: "15px" }}>📁</div>
                   <h3>No Exams Scheduled</h3>
                   <p>You don't have any exams scheduled for this semester yet.</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}