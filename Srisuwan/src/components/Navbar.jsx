import React, { useState } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import "../css/Navbar.css";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const isLoginPage = location.pathname === "/login";
  const isRegisterPage = location.pathname === "/register";
  const isAdminPage = location.pathname === "/admin";

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  if (isRegisterPage) return null; // Early return for the register page

  return (
    <>
      {!isLoginPage && !isAdminPage && (
        <nav className="navbar">
          <div className="navbar-container">
            <a className="navbar-brand" href="/">
              <h4>SRISUWAN</h4>
            </a>

            {!user ? (
              <Link to="/login" className="signin-link">
                <h6>Sign in</h6>
              </Link>
            ) : (
              <div className="user-info">
                <span
                  className="user-greeting"
                  onClick={openModal}
                  style={{
                    cursor: "pointer",
                    textDecoration: "none",
                    fontWeight: "700",
                  }}
                >
                  {user.firstname}
                </span>

                {isModalOpen && (
                  <div
                    id="myModal"
                    className="modal"
                    style={{
                      display: "block",
                      position: "fixed",
                      zIndex: 1000,
                    }}
                  >
                    <div
                      className="modal-content"
                      style={{
                        backgroundColor: "white",
                        margin: "15% auto",
                        padding: "20px",
                        borderRadius: "5px",
                        width: "300px",
                      }}
                    >
                      <span
                        className="close"
                        onClick={closeModal}
                        style={{
                          color: "#aaa",
                          float: "right",
                          fontSize: "28px",
                          fontWeight: "bold",
                          cursor: "pointer",
                        }}
                      >
                        &times;
                      </span>
                      <div>
                        <h3>User Profile</h3>
                        <div className="user-details">
                          <p>Name: {user.firstname} {user.lastname}</p>
                          <p>Email: {user.email}</p>
                        </div>

                        <div className="sm:flex sm:flex-row-reverse flex gap-4">
                          <button className="save-button" type="button">
                            Save changes
                          </button>
                          <button
                            className="cancel-button"
                            type="button"
                            onClick={closeModal}
                          >
                            Cancel
                          </button>
                        </div>

                        <button className="btn-signout" onClick={handleLogout}>
                          Sign out
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {user.role === "admin" && (
                  <button
                    className="btn-edit"
                    onClick={() => navigate("/admin")}
                  >
                    Edit Room
                  </button>
                )}
              </div>
            )}
          </div>
        </nav>
      )}
    </>
  );
};

export default Navbar;
