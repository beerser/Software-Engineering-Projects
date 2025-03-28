import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import google from "../assets/google.svg";
import "../css/Login.css";
import { Link } from "react-router-dom";
import axios from 'axios'; // ติดตั้ง axios เพื่อทำ HTTP requests
import { useAuth } from '../components/AuthContext'; // ใช้ AuthContext เพื่อเข้าถึงฟังก์ชัน login

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(""); // เพื่อแสดง error ถ้ามี
  const navigate = useNavigate();
  const { login } = useAuth(); // ดึงฟังก์ชัน login จาก AuthContext

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(""); // ล้าง error เมื่อมีการส่งคำขอใหม่

    try {
      // ส่งคำขอล็อกอินไปยัง API ของเรา
      const response = await axios.post("http://localhost:5001/api/login", { email, password });
      
      // เก็บ JWT token และ role ใน localStorage
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("role", response.data.role);
      localStorage.setItem("firstname", response.data.firstname);
      localStorage.setItem("lastname", response.data.lastname);
      localStorage.setItem("phoneNumber", response.data.phoneNumber);
      console.log("First Name:", response.data.firstname);
      console.log("Last Name:", response.data.lastname);
      console.log("phoneNumber:", response.data.phoneNumber);
      // เก็บข้อมูลผู้ใช้ใน AuthContext
      const userData = { 
        email, 
        role: response.data.role, 
        firstname: response.data.firstname,  // ต้องแน่ใจว่า API ส่งข้อมูลนี้มา
        lastname: response.data.lastname,    // ต้องแน่ใจว่า API ส่งข้อมูลนี้มา
        phoneNumber: response.data.phoneNumber
      };
      
      console.log("User Data:", userData);  

      login(userData); // ส่งข้อมูลผู้ใช้ไปที่ AuthContext

      // ตรวจสอบ role และไปที่หน้า admin หรือ home
      if (response.data.role === "admin") {
        navigate("/admin"); // ไปที่หน้า Admin Dashboard
      } else {
        navigate("/"); // ไปที่หน้า Home
      }

    } catch (err) {
      // ถ้าเกิด error จาก API จะโชว์ข้อความ
      setError("Invalid email or password!");
    }

    setLoading(false);
  };

  return (
    <div className="login-container">
      <section className="welcome-section">
        <h2>Welcome</h2>
        <h3>SRISUWAN Apartment Account</h3>
        <p>Sign in or create a new account.</p>
      </section>

      <section className="form-section">
        <h3>Sign in</h3>
        <h6>Sign in or create a new account</h6>
        <form onSubmit={handleSubmit}>
          {error && <p style={{ color: "red" }}>{error}</p>} {/* แสดง error ถ้ามี */}

          <div className="form-group">
            <input
              type="email"
              placeholder="E-mail"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <input
              type="password"
              placeholder="Password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="options">
            <label>
              <input type="checkbox" /> Remember me
            </label>
            <a href="#!">Forgot password?</a>
          </div>

          <button type="submit" className="btn-signin" disabled={loading}>
            {loading ? "Signing in..." : "Sign in"}
          </button>

          <div className="divider">
            <hr />
          </div>

          <button className="btn-google">
            <img src={google} alt="Google" />
            Continue with Google
          </button>

          <p className="signup-link">
            Don’t have an account? <Link to="/register">Sign Up</Link>
          </p>
        </form>
      </section>
    </div>
  );
};

export default Login;
