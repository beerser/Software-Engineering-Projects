import React, { useState } from "react";
import "./Room.css";
import bedlogo from "./assets/bed.svg";
import fanlogo from "./assets/fan.svg";
import bathroomlogo from "./assets/bathroom.svg";

const Room = ({ item, onBackClick }) => {
  const [amount, setAmount] = useState("");
  const [qrSrc, setQrSrc] = useState("");
  const [isBooked, setIsBooked] = useState(false); 

  const genQr = async () => {
    try {
      const response = await fetch("http://localhost:5173/generateQR", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: parseFloat(amount) }),
      });

      const data = await response.json();
      if (data.Result) {
        setQrSrc(data.Result);
      } else {
        console.error("QR Generation Failed", data);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

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
          <h2>Payment Method</h2>
          <p> {item.roomNumber} </p>
          <p>Total: {item.price}</p>
          <div>
            <input
              type="text"
              id="amount"
              placeholder="amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            <button onClick={genQr}>Generate QR</button>
          </div>

          {qrSrc && (
            <img
              src={qrSrc}
              id="imgQR"
              style={{ width: "100px", objectFit: "contain" }}
              alt="QR Code"
            />
          )}
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
