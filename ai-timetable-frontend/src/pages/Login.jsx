import { useState } from "react";
import logo from "../assets/university-logo.png";

export default function Login({ setUser }) {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {

    if (!email.trim() || !password.trim()) {
      alert("Email and password are required");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      alert("Please enter a valid email address");
      return;
    }

    try {

      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (res.ok) {

        localStorage.setItem("token", data.token);

        const userData = {
          _id: data.user._id,
          name: data.user.name,
          email: data.user.email,
          role: data.user.role,
          department: data.user.department,
          dept_id: data.user.dept_id,
          program_id: data.user.program_id,
          semester_id: data.user.semester_id
        };

        localStorage.setItem("user", JSON.stringify(userData));

        setUser(userData);

      } else {

        alert(data.message);

      }

    } catch (err) {

      console.error(err);
      alert("Login error");

    }

  };

  return (

    <div className="login-page">

      <div className="login-box">

        <img src={logo} className="login-logo" alt="logo" />

        <h1>AI Timetable Generator</h1>

        <p className="login-subtitle">
          Smart Academic Scheduling System
        </p>

        <input
          type="email"
          placeholder="Enter Email"
          autoComplete="off"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Enter Password"
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button onClick={handleLogin}>
          Login
        </button>

      </div>

    </div>

  );

}