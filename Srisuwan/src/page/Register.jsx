import React, { useState } from "react";
import "../css/Register.css";
import { Link } from "react-router-dom";
import axios from 'axios';  // เพิ่มการ import axios

const Register = () => {
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [role, setRole] = useState("user"); // สำหรับเลือก role
  const [error, setError] = useState("");  // สร้าง state สำหรับเก็บ error

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      // ส่งข้อมูลไปยัง backend API
      const response = await axios.post("http://localhost:5001/api/register", {
        firstname,   // ส่ง firstname
        lastname,    // ส่ง lastname
        email,
        phoneNumber,
        password,
        confirmPassword,
        role,         // ส่ง role
      });

      if (response.status === 200) {
        alert("Registration successful");
        // คุณสามารถ redirect ไปที่หน้า login หรือหน้าอื่นๆ ได้
      }
    } catch (error) {
      setError("Error during registration, please try again.");
    }
  };

  return (
    <div>
      <form className="register-form" onSubmit={handleSubmit}>
        <p className="register-form__title">Sign Up Your Account</p>

        {error && <p style={{ color: "red" }}>{error}</p>}  {/* แสดง error ถ้ามี */}

        <div className="register-form__flex">
          <div>
            <label htmlFor="firstname">Firstname</label>
            <input
              required
              type="text"
              className="register-form__input"
              id="firstname"
              value={firstname}
              onChange={(e) => setFirstname(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="lastname">Lastname</label>
            <input
              required
              type="text"
              className="register-form__input"
              id="lastname"
              value={lastname}
              onChange={(e) => setLastname(e.target.value)}
            />
          </div>
        </div>

        <div>
          <label htmlFor="email">Email</label>
          <input
            required
            type="email"
            className="register-form__input"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="phoneNumber">Phone Number</label>
          <input
            required
            type="tel"
            className="register-form__input"
            id="phoneNumber"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
        </div>

        <div className="pasform">
          <div>
            <label htmlFor="password">Password</label>
            <input
              required
              type="password"
              className="register-form__input"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              required
              type="password"
              className="register-form__input"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
        </div>

        <div className="checkin">
          <input type="checkbox" required />
          <span>
            Accept{" "}
            <span className="bluelike">Terms and Condition</span> and{" "}
            <span className="bluelike">Privacy</span>
          </span>
        </div>

        <button className="register-form__submit" type="submit">
          Sign Up
        </button>

        <p className="register-form__signin">
          Already have an account? <Link to="/login">Sign In</Link>
        </p>
      </form>
    </div>
  );
};

export default Register;