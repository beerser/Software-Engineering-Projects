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

  const navigateToPage = (path) => {
    navigate(path);
    closeModal();
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
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                      backgroundColor: "rgba(0,0,0,0.4)",
                      backdropFilter: "blur(4px)",
                    }}
                  >
                    <div
                      className="modal-content-on-navbar-page"
                      style={{
                        backgroundColor: "white",
                        margin: "0",
                        padding: "24px",
                        borderRadius: "16px",
                        boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
                        position: "absolute",
                        top: "80px",
                        right: "20px",
                        width: "320px",
                        border: "1px solid #eaeaea",
                        animation: "fadeIn 0.3s ease-in-out",
                      }}
                    >
                      <div className="flex justify-between items-center mb-4">
                        <h3
                          style={{
                            fontSize: "20px",
                            fontWeight: "600",
                            color: "#333",
                            margin: "0",
                          }}
                        >
                          My Account
                        </h3>
                        <span
                          className="close"
                          onClick={closeModal}
                          style={{
                            color: "#666",
                            fontSize: "24px",
                            fontWeight: "bold",
                            cursor: "pointer",
                            transition: "color 0.2s",
                            width: "30px",
                            height: "30px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            borderRadius: "50%",
                            backgroundColor: "#f5f5f5",
                          }}
                          onMouseOver={(e) =>
                            (e.target.style.backgroundColor = "#eaeaea")
                          }
                          onMouseOut={(e) =>
                            (e.target.style.backgroundColor = "#f5f5f5")
                          }
                        >
                          &times;
                        </span>
                      </div>

                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          marginBottom: "16px",
                          padding: "12px",
                          backgroundColor: "#f8f9fa",
                          borderRadius: "12px",
                        }}
                      >
                        <div
                          style={{
                            width: "48px",
                            height: "48px",
                            borderRadius: "50%",
                            backgroundColor: "#4f46e5",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "white",
                            fontWeight: "bold",
                            fontSize: "18px",
                            marginRight: "12px",
                          }}
                        >
                          {user.firstname
                            ? user.firstname.charAt(0).toUpperCase()
                            : "U"}
                        </div>
                        <div>
                          <div
                            style={{
                              fontWeight: "600",
                              fontSize: "16px",
                              color: "#333",
                            }}
                          >
                            {user.firstname} {user.lastname || ""}
                          </div>
                          <div style={{ fontSize: "14px", color: "#666" }}>
                            {user.email || "User"}
                          </div>
                        </div>
                      </div>

                      <div
                        style={{
                          borderTop: "1px solid #eaeaea",
                          borderBottom: "1px solid #eaeaea",
                          padding: "16px 0",
                          marginBottom: "16px",
                        }}
                      >
                        <div className="user-details">
                          <div
                            onClick={() => {
                              navigate("/information/allroomreservations");
                              closeModal();
                            }}
                            style={{
                              display: "block",
                              padding: "12px",
                              margin: "8px 0",
                              borderRadius: "8px",
                              color: "#333",
                              textDecoration: "none",
                              fontWeight: "500",
                              transition: "background-color 0.2s",
                              backgroundColor: "#f8f9fa",
                              cursor: "pointer",
                            }}
                            onMouseOver={(e) =>
                              (e.target.style.backgroundColor = "#eaeaea")
                            }
                            onMouseOut={(e) =>
                              (e.target.style.backgroundColor = "#f8f9fa")
                            }
                          >
                            🏨 All room reservations
                          </div>
                          <div
                            onClick={() => {
                              navigate("/information/personalinformations");
                              closeModal();
                            }}
                            style={{
                              display: "block",
                              padding: "12px",
                              margin: "8px 0",
                              borderRadius: "8px",
                              color: "#333",
                              textDecoration: "none",
                              fontWeight: "500",
                              transition: "background-color 0.2s",
                              backgroundColor: "#f8f9fa",
                              cursor: "pointer",
                            }}
                            onMouseOver={(e) =>
                              (e.target.style.backgroundColor = "#eaeaea")
                            }
                            onMouseOut={(e) =>
                              (e.target.style.backgroundColor = "#f8f9fa")
                            }
                          >
                            👤 Personal information
                          </div>
                          <div
                            onClick={() => {
                              navigate("/information/notification");
                              closeModal();
                            }}
                            style={{
                              display: "block",
                              padding: "12px",
                              margin: "8px 0",
                              borderRadius: "8px",
                              color: "#333",
                              textDecoration: "none",
                              fontWeight: "500",
                              transition: "background-color 0.2s",
                              backgroundColor: "#f8f9fa",
                              cursor: "pointer",
                            }}
                            onMouseOver={(e) =>
                              (e.target.style.backgroundColor = "#eaeaea")
                            }
                            onMouseOut={(e) =>
                              (e.target.style.backgroundColor = "#f8f9fa")
                            }
                          >
                            🔔 Notifications
                          </div>
                        </div>
                      </div>

                      <button
                        
                        onClick={handleLogout}
                        style={{
                          width: "100%",
                          padding: "12px",
                          backgroundColor: "#f44336",
                          color: "white",
                          border: "none",
                          borderRadius: "8px",
                          fontWeight: "500",
                          marginTop: "10px",
                          cursor: "pointer",
                          transition: "background-color 0.2s",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                        onMouseOver={(e) =>
                          (e.target.style.backgroundColor = "#d32f2f")
                        }
                        onMouseOut={(e) =>
                          (e.target.style.backgroundColor = "#f44336")
                        }
                      >
                        Logout
                        →
                      </button>

                      {user.role === "admin" && (
                        <button
                          style={{
                            width: "100%",
                            padding: "12px",
                            backgroundColor: "#4f46e5",
                            color: "white",
                            border: "none",
                            borderRadius: "8px",
                            fontWeight: "500",
                            cursor: "pointer",
                            marginTop: "12px",
                            transition: "background-color 0.2s",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                          onClick={() => navigateToPage("/admin")}
                          onMouseOver={(e) =>
                            (e.target.style.backgroundColor = "#4338ca")
                          }
                          onMouseOut={(e) =>
                            (e.target.style.backgroundColor = "#4f46e5")
                          }
                        >
                          Admin Dashboard
                        </button>
                      )}
                    </div>
                  </div>
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
