import React from 'react';
import "../css/Neary.css";
import TU from "../assets/TU.jpg";
import RU from "../assets/RU.jpg";
import BU from "../assets/BU.jpg";

const Neary = () => {
  const institutions = [
    { name: 'Thammasat University', image: TU },
    { name: 'Rangsit University', image: RU },
    { name: 'Bangkok University', image: BU }
  ];

  return (
    <div className="nearby-institutions-container">
     
      <div className="main-image">
        <img src={TU} alt="Thammasat University" />
      </div>

    
      <div className="right-container">
        <div className="institutions-title">
          <h2>Which educational institutions are nearby?</h2>
        </div>
        <div className="thumbnail-grid">
          {institutions.map((institution, index) => (
            <div key={index} className="thumbnail-card">
              <img src={institution.image} alt={institution.name} />
              <div className="institution-name">{institution.name.split(' ')[0]}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Neary;
