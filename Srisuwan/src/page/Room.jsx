import React, { useState } from "react";

import bedlogo from "../assets/bed.svg";
import fanlogo from "../assets/fan.svg";
import bathroomlogo from "../assets/bathroom.svg";
import { useNavigate, useLocation } from "react-router-dom";

const Room = () => {
  const [isBooked, setIsBooked] = useState(false);
  const navigate = useNavigate();
  const location = useLocation(); 

  const { item } = location.state || {}; 

  const handleBookRoom = () => {
    setIsBooked(true);
    navigate("/payment", { state: { item } });
  };

  if (!item) {
    return (
      <div className="error-container">
        <p>No room selected</p>
        <button onClick={() => navigate("/")} className="back-button">
          Return to rooms
        </button>
      </div>
    );
  }



  return (
    <div className="room-container">
      <div className="header">
        <button onClick={() => navigate("/")} className="back-button">
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
          <h2>{item.roomNumber}</h2>
          <p>{item.price}</p>
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
