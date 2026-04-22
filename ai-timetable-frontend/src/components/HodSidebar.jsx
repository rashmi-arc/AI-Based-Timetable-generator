import { FaBookOpen, FaChalkboardTeacher, FaCalendarAlt, FaTable } from "react-icons/fa";

export default function HodSidebar({ page, setPage }) {

  const menuItems = [
    { key: "course", label: "Add Course", icon: <FaBookOpen /> },
    { key: "map", label: "Course ↔ Teacher Mapping", icon: <FaChalkboardTeacher /> },
    { key: "view_timetable", label: "View Class Timetable", icon: <FaTable /> },
    { key: "exam_view", label: "View Exam Timetable", icon: <FaCalendarAlt /> }
  ];

  return (
    <div className="sidebar">

      <div className="sidebar-header">
        HOD PANEL
      </div>

      <div className="menu">

        {menuItems.map((item) => (
          <div
            key={item.key}
            className={`menu-item ${page === item.key ? "active" : ""}`}
            onClick={() => setPage(item.key)}
          >

            <span className="menu-icon">{item.icon}</span>
            <span className="menu-text">{item.label}</span>

          </div>
        ))}

      </div>

    </div>
  );
}