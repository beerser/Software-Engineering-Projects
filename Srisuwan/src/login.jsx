import React, { useState } from "react";
import "./login.css";
import google from "./assets/google.svg";
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      alert(`Signed in as: ${email}`);
      setLoading(false);
    }, 1500);
    navigate("/",);
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
            <img
              src={google}
              alt="Google"
            />
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
