import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./login.css";
import google from "./assets/google.svg";
import { supabase } from "../../Back-end/supabaseClient";
import { useAuth } from "./components/AuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setUser } = useAuth(); 

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const { data: userData, error } = await supabase
        .from("users")
        .select("role")
        .eq("email", email)
        .eq("password", password)
        .maybeSingle(); 

      if (error || !userData) {
        alert("Invalid email or password!");
      } else {
        console.log("User Role:", userData.role);
        setUser({ email, role: userData.role });
        localStorage.setItem("user", JSON.stringify({ email, role: userData.role }));
        console.log("Stored User:", JSON.parse(localStorage.getItem("user")));
        if (userData.role === "admin") {
          navigate("/editroom");
        } else {
          navigate("/");
        }
      }
    } catch (err) {
      console.error("Login error:", err);
      alert("Something went wrong!");
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
              type=""
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
            Don’t have an account? <a href="#!">Sign Up</a>
          </p>
        </form>
      </section>
    </div>
  );
};

export default Login;
