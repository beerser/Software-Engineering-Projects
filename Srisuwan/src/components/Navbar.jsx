import React from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext"; 
import "../css/Navbar.css"; // Import CSS

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

    const handleEditRoom = () => {
        navigate("/editroom");
    };

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
                                
                                {user.role === "admin" && (
                                    <button className="btn-edit" onClick={handleEditRoom}>
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