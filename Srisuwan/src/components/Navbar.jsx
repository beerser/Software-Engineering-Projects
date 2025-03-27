import React, { useState } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext"; // ใช้ AuthContext เพื่อดึงข้อมูลผู้ใช้
import Profile from "./Profile"; // Import the Profile component
import "../css/Navbar.css"; // Import CSS

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth(); // ดึงข้อมูลผู้ใช้จาก AuthContext

  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const isLoginPage = location.pathname === "/login";
  const isRegisterPage = location.pathname === "/register";  // เพิ่มเงื่อนไขตรวจสอบหน้า register
  const isAdminPage = location.pathname === "/admin";

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const toggleProfile = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  if (isRegisterPage) {
    return null;  
  }

  return (
    <>
      {!isLoginPage && !isAdminPage && (
        <nav className="navbar">
          <div className="navbar-container">
            <a className="navbar-brand" href="/">
              <h4>SRISUWAN APARTMENT</h4>
            </a>

            {!user ? (
              <Link to="/login" className="signin-link">
                <h6>Sign in</h6>
              </Link>
            ) : (
              <div className="user-info">
                <span className="user-greeting">Hello, {user.email}</span>
                
                {/* Profile button */}
                <button className="btn-profile" onClick={toggleProfile}>
                  Profile
                </button>

                {/* Show profile component when toggled */}
                {isProfileOpen && <Profile />}

                {user.role === "admin" && (
                  <button className="btn-edit" onClick={() => navigate("/admin")}>
                    Edit Room
                  </button>
                )}

                <button className="btn-signout" onClick={handleLogout}>
                  Sign out
                </button>
              </div>
            )}
          </div>
        </nav>
      )}
    </>
  );
};

export default Navbar;
