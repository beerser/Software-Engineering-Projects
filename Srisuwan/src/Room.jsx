import React, { useState } from "react";
import "./Room.css";
import bedlogo from "./assets/bed.svg";
import fanlogo from "./assets/fan.svg";
import bathroomlogo from "./assets/bathroom.svg";

const Room = ({ item, onBackClick }) => {
  const [isBooked, setIsBooked] = useState(false); 

  const handleBookRoom = () => {
    setIsBooked(true); 
  };

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

  if (isBooked) {
    return (
      <div className="payment-container">
        <div className="header">
          <button onClick={onBackClick} className="back-button">
            Back
          </button>
        </div>

        <div className="details-container">
          <h2>Payment Page</h2>
          <p> {item.roomNumber}</p>
          <p>Total: {item.price}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="room-container">
      <div className="header">
        <button onClick={onBackClick} className="back-button">
          Back
        </button>
      </div>

      <div className="details-container">
        <div className="image-container">
          <img
            src={item.imageUrl}
            alt={`Room ${item.roomNumber}`}
            className="room-image"
          />
          <div className="thumbnail-container">
            {[1, 2, 3, 4, 5].map((index) => (
              <img
                key={index}
                src={item.imageUrl}
                alt={`Thumbnail ${index}`}
                className="thumbnail-image"
              />
            ))}
          </div>
        </div>

        <div className="room-details">
          <h2>{`${item.roomNumber}`}</h2>
          <p>{`${item.price}`}</p>
          <hr />
          <div className="icon-container">
            <div className="icon-item">
              <img src={bedlogo} alt="Furniture" />
              <p>Furniture - Wardrobe, Bed</p>
            </div>
            <div className="icon-item">
              <img src={fanlogo} alt="Fan" />
              <p>Fan</p>
            </div>
            <div className="icon-item">
              <img src={bathroomlogo} alt="Bathroom" />
              <p>Bathroom</p>
            </div>
          </div>
        </div>
      </div>

      <button className="confirm-button" onClick={handleBookRoom}>
        Book a room
      </button>
    </div>
  );
};

export default Room;
