import React, { useState, useEffect } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext"; 
import roomImg from "../assets/logo-srisuwan-apartment-black.png";

const Navbar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, setUser } = useAuth(); 

   
    const isLoginPage = location.pathname === "/login";
    const isAdminPage = location.pathname === "/editroom";

   
    const handleLogout = () => {
        setUser(null);  
        localStorage.removeItem("user");  
        navigate("/login"); 
    };

    return (
        <>
            {!isLoginPage && !isAdminPage && (
                <nav className="navbar bg-body-tertiary">
                    <div className="container-fluid">
                        <a className="navbar-brand" href="/">
                            <h4 style={{ fontFamily: "Segoe UI", marginLeft: "10px" }}>
                                SRISUWAN APARTMENT
                            </h4>
                        </a>

                        {!user ? (
                           
                            <Link
                                to="/login"
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    color: "black",
                                    fontFamily: "Segoe UI",
                                    textDecoration: "none",
                                    fontWeight: "350",
                                    fontSize: "20px",
                                    height: "40px",
                                    marginRight: "10px",
                                }}
                            >
                                <h6>Sign in</h6>
                            </Link>
                        ) : (
                           
                            <div style={{ display: "flex", alignItems: "center" }}>
                                <span style={{ marginRight: "10px", fontSize: "18px" }}>
                                    Hello, {user.email}
                                </span>
                                <button
                                    onClick={handleLogout}
                                    style={{
                                        backgroundColor: "#f8f9fa",
                                        border: "1px solid #ccc",
                                        padding: "5px 10px",
                                        cursor: "pointer",
                                        fontSize: "16px",
                                    }}
                                >
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
