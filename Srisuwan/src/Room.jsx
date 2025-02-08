import React from "react";
import "./Room.css";
import bedlogo from "./assets/bed.svg";
import fanlogo from "./assets/fan.svg";
import bathroomlogo from "./assets/bathroom.svg";
const Payment = ({ item, onBackClick }) => {
  if (!item) {
    return (
      <div className="error-container">
        <p>No room selected</p>
        <button onClick={onBackClick} className="back-button">
          Return to rooms
        </button>
      </div>
    );
  }

  return (
    <div className="Room-container">
      <div className="header">
        <h2>Room Details</h2>
        <button onClick={onBackClick} className="back-button">
          Back
        </button>
      </div>

      <div className="details-container">
        <img
          src={item.imageUrl}
          alt={item.roomNumber}
          className="room-image"
        />
        <div className="room-details">
          <p>Room: {item.roomNumber}</p>
          <p>Price: {item.price}</p>
          <p>Booking ID: {item.bookingId}</p>
          <p className="date-text">Date: {item.timestamp}</p>
          <hr />
          <p>Details: Ghost,Krasue,It,Krahung,Predt</p>
          <img src={bedlogo} alt="Furniture Logo" /><p></p>
          <img src={fanlogo} alt="Furniture Logo" /><p></p>
          <img src={bathroomlogo} alt="Furniture Logo" /><p></p>


        </div>
      </div>


      <button className="confirm-button">
        Book a room
      </button>
    </div>
  );
};

export default Payment;