import React from 'react';
import "../css/Cardsexample.css";
import dressingTable from "../assets/dressing-and-table.png";
import srisuwanTextBorder from "../assets/bathroom-and-fan.png";

const Cardsexample = () => {
  return (
    <div className="cardx-container"> 
      <div className="cardx">
        <div className="img">
          <img src={dressingTable} alt="Dressing and Table" />
        </div>
        <div className="text">
          <p className="h3">Includes a dressing table and bed</p>
          <p className="p">The room will have a dressing table and bed provided for the tenants to use</p>
        </div>
      </div>

      <div className="cardx">
        <div className="img">
          <img src={srisuwanTextBorder} alt="Srisuwan Text Border" />
        </div>
        <div className="text">
          <p className="h3">There is a bathroom and a fan in the room</p>
          <p className="p">The room has an ensuite bathroom and a fan, so you won’t have to fight over them.</p>
        </div>
      </div>
    </div>
  );
};

export default Cardsexample;