import React from 'react'
import bannerImg from "../assets/srisuwan-apartment-homepage.png"; 
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
    </div>
  </div>
  
  
  )
}

export default Bannerbg
