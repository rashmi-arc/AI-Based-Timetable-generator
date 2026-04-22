import {useState} from "react";
import Header from "../components/Header";
import HodSidebar from "../components/HodSidebar";

import AddCourse from "../pages/AddCourse";
import CourseTeacherMapping from "../pages/CourseTeacherMapping";

export default function HodLayout(){

const [page,setPage] = useState("course");

return(

<>

<Header/>

<div className="layout">

<HodSidebar page={page} setPage={setPage}/>

<div className="content">

{page==="course" && <AddCourse/>}
{page==="map" && <CourseTeacherMapping/>}

</div>

</div>

</>

);

}