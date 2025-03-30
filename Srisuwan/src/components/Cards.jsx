import React from 'react';
import { useNavigate } from 'react-router-dom';

const Cards = ({ obj, onPaymentClick }) => {
  const navigate = useNavigate();

  const handleRentClick = (item) => {
    const paymentDetails = {
      roomNumber: item.room_number, 
      price: item.price,
      imageUrl: item.image_url,
      timestamp: new Date().toLocaleString(),
      bookingId: `BK${Math.random().toString(36).substr(2, 9)}`.toUpperCase()
    };

    onPaymentClick(paymentDetails); 
    navigate("/room", { state: { item: paymentDetails } }); 
  };

  return (
    <div
      style={{
        display: "flex",
        gap: "1rem",
        overflowX: "auto", // Allow horizontal scrolling
        scrollSnapType: "x mandatory", // Ensure each card stops at its position
        padding: "1rem",
        scrollbarWidth: "none",
        msOverflowStyle: "none",
        margin: "0 auto", // Center the content
      }}
      className="scroll-container"
    >
      {obj.map((item, index) => {
        return (
          <div
            key={index}
            className="card"
            style={{
              width: "13rem",
              padding: "10px",
              scrollSnapAlign: "start", // Snapping to each card when scrolling
              flex: "0 0 auto",
              borderRadius: "15px",
              margin: "7px",
              boxShadow: "5px 5px 15px rgba(0, 0, 0, 0.1)",
              backgroundColor: "#fff",
              transition: "transform 0.3s ease-in-out", // Add smooth animation for hover
            }}
          >
            <img
              src={item.image_url} 
              className="card-img-top"
              alt={item.room_number} 
              style={{ width: "100%", height: "150px", objectFit: "cover", borderRadius: "10px" }} // Adjust image to fit the card
            />
            <div className="card-body">
              <h5 className="card-title" style={{ fontSize: "1.1rem", fontWeight: "600" }}>{item.room_number}</h5>  
              <p className="card-text" style={{ fontSize: "0.9rem", color: "#555" }}>{item.price} Bath</p>  
              <button
                className="btn btn-primary"
                onClick={() => handleRentClick(item)}
                style={{ width: "100%", padding: "8px", backgroundColor: "#007bff", border: "none", color: "#fff", borderRadius: "5px", cursor: "pointer" }}
              >
                เช่า
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Cards;
