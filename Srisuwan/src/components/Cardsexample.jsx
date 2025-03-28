import React from 'react';
import "../css/Cardsexample.css";

const Cardsexample = () => {
  return (
    <div className="cardx-container"> 
      <div className="cardx">
        <div className="img">
        </div>
        <div className="text">
          <p className="h3">Includes a dressing table and bed</p>
          <p className="p">The room will have a dressing table and bed provided for the tenants to use</p>
        </div>
      </div>

      <div className="cardx">
        <div className="img">
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
