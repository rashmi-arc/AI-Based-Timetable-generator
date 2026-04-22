import logo from "../assets/university-logo.png";

export default function Header(){

const user = JSON.parse(localStorage.getItem("user"));
const cleanName = user?.name ? user.name.split("(")[0].trim() : "User";

const logout = ()=>{

/* CLEAR LOGIN DATA */
localStorage.clear();

/* PREVENT BACK NAVIGATION CACHE */
window.history.replaceState(null, "", "/");

/* REDIRECT TO LOGIN PAGE */
window.location.href="/";

};

let welcomeText = "";

/* ROLE BASED HEADER TEXT */

if(user?.role === "ADMIN"){
welcomeText = "Welcome System Administrator";
}
else if(user?.role === "HOD"){
welcomeText = `Welcome ${user?.department} Department HOD`;
}
else{
welcomeText = "Welcome User";
}

return(

<div className="header">

<div className="header-left">

<img src={logo} className="header-logo" alt="logo"/>

<div className="header-title">

<div className="header-main">
AI Timetable Generator
</div>

<div className="header-sub">
{welcomeText}
</div>

</div>

</div>

<div className="header-right">

<div className="user-info">
  <span className="user-name">{cleanName}</span>
  <span className="user-role">{user?.role}</span>
</div>

<button className="logout-btn" onClick={logout}>
Logout
</button>

</div>

</div>

);

}