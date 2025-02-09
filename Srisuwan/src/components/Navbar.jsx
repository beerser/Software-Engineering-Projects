import React, { useState } from "react";
import roomImg from "../assets/logo-srisuwan-apartment-black.png";


const Navbar = ({ setdata }) => {
    const [show, setShow] = useState(false);


    return (
        <>
            <nav className="navbar bg-body-tertiary">
                <div className="container-fluid">
                    <a className="navbar-brand" href="#">
                        <img src={roomImg} alt="Logo" style={{ height: "40px" }} /> SRISUWAN APARTMENT
                    </a>
                    <a className="linkk" style={{ color: "black", textDecoration: "none", fontWeight: "300" ,fontSize:"20px",height: "40px"}}>
                        <h7>Login</h7>
                    </a>
                </div>
            </nav>
        </>
    );
};

export default Navbar;
