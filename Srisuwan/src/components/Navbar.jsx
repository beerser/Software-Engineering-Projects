import React, { useState } from "react";

const Navbar = ({ setdata }) => {
    const [show, setshow] = useState(false);
    const [n, setN] = useState([
        { name: "Ai", detail: "ASUS" },
        { name: "Au", detail: "BKO" },
    ]);




    const handdleClick = () => {
        setN(n + 1);
        setshow(true)
        if (show) {
            alert("28259")
        }
    };

    return (
        <><nav class="navbar bg-body-tertiary">
            <div class="container-fluid">
                <a class="navbar-brand" href="#">
                    
                    Srisuwan
                </a>
            </div>
        </nav></>
    );
};

export default Navbar;
