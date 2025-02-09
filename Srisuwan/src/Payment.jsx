import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const Payment = () => {
  const { state } = useLocation();  
  const navigate = useNavigate();
  
  const item = state?.item;  

  if (!item) {
    return (
      <div className="error-container">
        <p>No room details available</p>
        <button onClick={() => navigate("/")} className="back-button">
          Go to Rooms
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="payment-container">
        <div className="header">
          <button onClick={() => navigate("/")} className="back-button">
            Back
          </button>
        </div>

        <div className="details-container">
          <h2>Payment Methods</h2>
          <p>Room Number: {item.roomNumber}</p>
          <p>Total: {item.price}</p>
        </div>
      </div>
    </div>
  );
};

export default Payment;
