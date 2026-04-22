import { useState } from "react";

import Header from "./components/Header";
import AdminSidebar from "./components/AdminSidebar";
import HodSidebar from "./components/HodSidebar";
import Footer from "./components/Footer";

import Login from "./pages/Login";
import AddUser from "./pages/AddUser";
import AddDepartment from "./pages/AddDepartment";
import AddCourse from "./pages/AddCourse";
import CourseTeacherMap from "./pages/CourseTeacherMap";
import AddProgram from "./pages/AddProgram";
import ProgramDepartmentMap from "./pages/ProgramDepartmentMap";
import AddSemester from "./pages/AddSemester";
import AddRoom from "./pages/AddRoom";
import AddDeptTimeSlot from "./pages/AddDeptTimeSlot";
import AddConstraint from "./pages/AddConstraint";
import ClassTimetable from "./pages/ClassTimetable";
import ViewTimetable from "./pages/ViewTimetable";
import GenerateExamTimetable from "./pages/GenerateExamTimetable";
import ViewExamTimetable from "./pages/ViewExamTimetable";

import TeacherDashboard from "./pages/TeacherDashboard";
import StudentDashboard from "./pages/StudentDashboard";


/* GET USER FROM LOCAL STORAGE */

function getUserFromStorage() {

  try {

    const token = localStorage.getItem("token");
    const rawUser = localStorage.getItem("user");

    if (!token || !rawUser || rawUser === "undefined" || rawUser === "null") {

      localStorage.clear();
      return null;

    }

    return JSON.parse(rawUser);

  } catch {

    localStorage.clear();
    return null;

  }

}


function App() {

  const [user, setUser] = useState(getUserFromStorage());

  const [page, setPage] = useState(
    user?.role === "ADMIN"
      ? "dept"
      : user?.role === "HOD"
      ? "course"
      : "dashboard"
  );

  /* LOGIN PAGE IF USER NOT LOGGED IN */

  if (!user) {
    return <Login setUser={setUser} />;
  }

  return (
    <>
      <Header setUser={setUser} />

      <div className="layout">

        {user.role === "ADMIN" && (
          <AdminSidebar page={page} setPage={setPage} />
        )}

        {user.role === "HOD" && (
          <HodSidebar page={page} setPage={setPage} />
        )}

        <div className="content">
          <div className="content-wrapper">

            {/* ADMIN */}

            {user.role === "ADMIN" && page === "dept" && <AddDepartment />}
            {user.role === "ADMIN" && page === "program" && <AddProgram />}
            {user.role === "ADMIN" && page === "pdm" && <ProgramDepartmentMap />}
            {user.role === "ADMIN" && page === "semester" && <AddSemester />}
            {user.role === "ADMIN" && page === "room" && <AddRoom />}
            {user.role === "ADMIN" && page === "slot" && <AddDeptTimeSlot />}
            {user.role === "ADMIN" && page === "constraint" && <AddConstraint />}
            {user.role === "ADMIN" && page === "timetable" && <ClassTimetable />}
            {user.role === "ADMIN" && page === "exam_gen" && <GenerateExamTimetable />}
            {user.role === "ADMIN" && page === "user" && <AddUser />}

            {(user.role === "ADMIN" || user.role === "HOD") && page === "view_timetable" && (
              <ViewTimetable />
            )}

            {(user.role === "ADMIN" || user.role === "HOD") && page === "exam_view" && (
              <ViewExamTimetable />
            )}

            {/* HOD */}

            {user.role === "HOD" && page === "course" && <AddCourse />}
            {user.role === "HOD" && page === "map" && <CourseTeacherMap />}

            {/* TEACHER */}

            {user.role === "TEACHER" && <TeacherDashboard />}

            {/* STUDENT */}

            {user.role === "STUDENT" && <StudentDashboard />}

          </div>
        </div>

      </div>

      <Footer />
    </>
  );
}

export default App;