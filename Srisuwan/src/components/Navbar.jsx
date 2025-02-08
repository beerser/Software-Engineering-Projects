import React, { useState } from "react";
import roomImg from "../assets/logo-srisuwan-apartment-black.png"; 


const Navbar = ({ setdata }) => {
    const [show, setShow] = useState(false);
    const [n, setN] = useState([
        { name: "Ai", detail: "ASUS" },
        { name: "Au", detail: "BKO" },
    ]);

    const handleClick = () => {
        setN([...n, { name: "New Name", detail: "New Detail" }]); 
        setShow(true);
        if (show) {
            alert("28259");
        }
    };

    return (
        <>
            <nav className="navbar bg-body-tertiary">
                <div className="container-fluid">
                    <a className="navbar-brand" href="#">
                        <img src={roomImg} alt="Logo" style={{ height: "40px" }} /> SRISUWAN APARTMENT
                    </a>
                </div>
            </nav>
        </>
    );
};

export default Navbar;
