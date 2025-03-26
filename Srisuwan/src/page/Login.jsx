import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import google from "../assets/google.svg";
import "../css/Login.css";
import { Link } from "react-router-dom";
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    // ใส่การตรวจสอบเบื้องต้นที่นี่ เช่น ตรวจสอบอีเมลและรหัสผ่าน
    if (email === "admin@example.com" && password === "admin123") {
      // ตัวอย่างเมื่อเข้าใช้งานเป็น Admin
      navigate("/admin");
    } else if (email === "user@example.com" && password === "user123") {
      // ตัวอย่างเมื่อเข้าใช้งานเป็น User
      navigate("/");
    } else {
      alert("Invalid email or password!");
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
