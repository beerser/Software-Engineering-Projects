import React, { useState } from "react";
import roomImg from "../assets/logo-srisuwan-apartment-black.png";


const Navbar = ({ setdata }) => {
    const [show, setShow] = useState(false);


    return (
        <>
            <nav className="navbar bg-body-tertiary">
                <div className="container-fluid">
                    <a className="navbar-brand" href="#">
                       <h4 style={{ fontFamily:"Segoe UI",marginLeft:"10px"}}>SRISUWAN APARTMENT</h4>
                    </a>
                    <a className="linkk" style={{ color: "black",fontFamily:"Segoe UI", textDecoration: "none", fontWeight: "350" ,fontSize:"20px",height: "40px",marginRight:"10px"}}>
                        <h7 >Login</h7>
                    </a>
                </div>
            </nav>
        </>
    );
};

export default Navbar;
