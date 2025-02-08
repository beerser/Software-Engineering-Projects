import React from 'react'
import bannerImg from "../assets/bannerbg.jpg"; 
const Bannerbg = () => {
  return (
    <div style={{ position: "relative", display: "inline-block" }}>
    <img 
      src={bannerImg}  
      className="img-fluid" 
      alt="..." 
      style={{ width: "100%", borderRadius: "10px" }} 
    />
    <div 
      style={{ 
        position: "absolute", 
        bottom: "10px", 
        left: "10px",  
        color: "white", 
        textAlign: "left",
        padding: "10px 20px", 
        borderRadius: "10px",
      }}
    >
      <h2 style={{ margin: "5px 0", fontSize: "35px" }}>Affordable Dormitory</h2>
      <h4 style={{ margin: "5px 0", fontSize: "25px" }}>only here</h4>
    </div>
  </div>
  
  
  )
}

export default Bannerbg
