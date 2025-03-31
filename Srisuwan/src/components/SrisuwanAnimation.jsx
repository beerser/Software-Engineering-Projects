import React, { useState, useEffect } from "react";
import "../css/SrisuwanAnimation.css"; 

const SrisuwanAnimation = ({ onAnimationComplete }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onAnimationComplete();
    }, 6000);

    return () => clearTimeout(timer);
  }, [onAnimationComplete]);

  return (
    <div className="srisuwan-animation">
      <div className="srisuwan-content">
        <div className="srisuwan-logo">
          <div className="letter-animation">S</div>
          <div className="letter-animation">r</div>
          <div className="letter-animation">i</div>
          <div className="letter-animation">s</div>
          <div className="letter-animation">u</div>
          <div className="letter-animation">w</div>
          <div className="letter-animation">a</div>
          <div className="letter-animation">n</div>
        </div>
        <div className="tagline">Thank you for choosing us. We are here to fully support and assist you.</div>
        
        
        <div className="walking-container">
          <div className="walking-person">
            <div className="person-head"></div>
            <div className="person-body"></div>
            <div className="person-leg left"></div>
            <div className="person-leg right"></div>
            <div className="person-arm left"></div>
            <div className="person-arm right"></div>
          </div>
          <div className="walking-path"></div>
        </div>
      </div>
    </div>
  );
};

export default SrisuwanAnimation;