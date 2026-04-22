import {
  FaBuilding,
  FaBook,
  FaLink,
  FaCalendarAlt,
  FaDoorOpen,
  FaClock,
  FaSlidersH,
  FaTable,
  FaUserPlus,
  FaFileAlt
} from "react-icons/fa";

export default function AdminSidebar({ page, setPage }) {

  const menuItems = [
    { key: "dept", label: "Departments", icon: <FaBuilding /> },
    { key: "program", label: "Programs", icon: <FaBook /> },
    { key: "pdm", label: "Program ↔ Department", icon: <FaLink /> },
    { key: "semester", label: "Semesters", icon: <FaCalendarAlt /> },
    { key: "room", label: "Rooms", icon: <FaDoorOpen /> },
    { key: "slot", label: "Dept Time Slots", icon: <FaClock /> },
    { key: "constraint", label: "Constraints", icon: <FaSlidersH /> },
    { key: "timetable", label: "Generate Timetable", icon: <FaTable /> },
    { key: "view_timetable", label: "View Timetables", icon: <FaTable /> },
    { key: "exam_gen", label: "Generate Exam TT", icon: <FaFileAlt /> },
    { key: "exam_view", label: "View Exam TT", icon: <FaFileAlt /> },
    { key: "user", label: "Add User", icon: <FaUserPlus /> }
  ];

  return (
    <div className="sidebar">

      <div className="sidebar-header">
        ADMIN PANEL
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