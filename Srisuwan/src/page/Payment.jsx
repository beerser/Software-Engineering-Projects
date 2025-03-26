import React from 'react';
import "../css/Payment.css";
import { useLocation, useNavigate } from 'react-router-dom';
import QR from '../components/QR';

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
          <button onClick={() => navigate("/room")} className="back-button">
            Back
          </button>
        </div>
        <h4>Payment</h4>


        <div className="detailss-container">
          <h6>Address</h6>
          <div>
            <p className='add'>7 Klong luang Soi, Phaholyothin Road, Knlog 1, Knlong Luang, Pathum Thani</p>
          </div>
        </div>

        <div className="detailss-containerrr">
          <div className='text-container' >
            <img src={item.imageUrl} alt="" className='image-container' />
            <div className='text-container'>
              <p className='name_room'>{item.roomNumber}</p>
              <p className='price'>{item.price}</p>
            </div>
          </div>
        </div>

        <div className="detailss-containerr">
          <div className='text-container' >
            <p className='priceC '>{item.price}</p>
          </div>
        </div>

        <div className="details-container">
        <QR item={item} />
        </div>

      </div>
    </div>
    
  );
};

export default Payment;
