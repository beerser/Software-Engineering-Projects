import React from 'react';
import { useNavigate } from 'react-router-dom';
import "../css/Cards.css";
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
    <div className="scroll-container">
      {obj.map((item, index) => (
        <div key={index} className="card">
          <img 
            src={item.image_url} 
            className="card-img-top"
            alt={item.room_number} 
          />
          <div className="card-body">
            <h5 className="card-title">{item.room_number}</h5>  
            <p className="card-text">{item.price} Bath</p>  
            <button
              className="btn btn-primary"
              onClick={() => handleRentClick(item)}
            >
              เช่า
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Cards;