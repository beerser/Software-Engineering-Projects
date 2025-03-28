import React from "react";
import "../css/Cardtext.css";

const Cardtext = () => {
  return (
    <div className="card-container">
      <div className="card">
        <h3 className="card__title">Convenient transportation</h3>
        <p className="card__content">
          Conveniently accessible by songthaews and buses
        </p>
      </div>
      <div className="card">
        <h3 className="card__title">Close to the university</h3>
        <p className="card__content">
          Such as TU, BU, and RSU
        </p>
      </div>
      <div className="card">
        <h3 className="card__title">Near shopping malls</h3>
        <p className="card__content">
          Such as Future park Rangsit
        </p>
      </div>
      <div className="card">
        <h3 className="card__title">There are many restaurants</h3>
        <p className="card__content">
        Such as Tee Noi, 
          Shabu BBQ, Amazon, and more
        </p>
      </div>
    </div>
  );
};

export default Cardtext;
