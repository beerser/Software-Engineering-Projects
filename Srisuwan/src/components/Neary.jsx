import React, { useState } from 'react';
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

  const [selectedIndex, setSelectedIndex] = useState(0);

  return (
    <div className="nearby-institutions-container">
      {/* รูปหลักที่เปลี่ยนได้ */}
      <div className="main-image">
        <img src={institutions[selectedIndex].image} alt={institutions[selectedIndex].name} />
      </div>

      <div className="right-container">
        <div className="institutions-title">
          <h2>
            Which educational institutions
            <span className="break-line">are nearby?</span>
          </h2>
        </div>

        <div className="thumbnail-indicator" style={{ left: `${selectedIndex * 120}px` }}></div>

        <div className="thumbnail-grid">
          {institutions.map((institution, index) => (
            <div
              key={index}
              className={`thumbnail-card ${selectedIndex === index ? 'active' : ''}`}
              onClick={() => setSelectedIndex(index)}
            >
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
