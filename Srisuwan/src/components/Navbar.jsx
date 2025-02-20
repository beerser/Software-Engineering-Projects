import React, { useState } from "react";
import { useLocation, Link } from "react-router-dom";
import roomImg from "../assets/logo-srisuwan-apartment-black.png";

const Navbar = () => {
    const location = useLocation();

    // เช็คว่าอยู่หน้า login หรือ editroom หรือไม่
    const isLoginPage = location.pathname === "/login";
    const isAdminPage = location.pathname === "/editroom";

    return (
        <>
         
            {!isLoginPage && !isAdminPage && (
                <nav className="navbar bg-body-tertiary">
                    <div className="container-fluid">
                        <a className="navbar-brand" href="#">
                            <h4 style={{ fontFamily: "Segoe UI", marginLeft: "10px" }}>
                                SRISUWAN APARTMENT
                            </h4>
                        </a>

                       
                        {!isLoginPage && (
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
                        )}
                    </div>
                </nav>
            )}
        </>
    );
};

export default Navbar;
