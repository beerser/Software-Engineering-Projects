import React, { useState } from "react";

const Navbar = ({ setdata }) => {
    const [show, setshow] = useState(false);
    const [n, setN] = useState([
        {name:"Ai",detail:"ASUS"},
        {name:"Au",detail:"BKO"},
    ]);
 
 
 
 
    const handdleClick = () => {
    setN(n + 1);
    setshow(true)
    if(show){
        alert("28259")
    }
  };

  return (
    <div>
      {n ? <>True</> : <>False</>}
      Navbar
    <ul className="title-text">
    {n.map((item,index)=><li key={index}>{item.name}:{item.detail}</li>)}

    </ul>


      <button
        onClick={() => {
          handdleClick();
        }}
      >
        Click
      </button>
    </div>
  );
};

export default Navbar;
