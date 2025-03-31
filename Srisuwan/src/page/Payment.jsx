import React from 'react';
import "../css/Payment.css";
import { useLocation, useNavigate } from 'react-router-dom';
import QR from '../components/QR';
import Footer from '../components/footer';

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
  const handleUploadClick = () => {
    navigate("/upload", { state: { item: item } });
  };

  return (
    <>
      <div>
        <div className="payment-container">
          <div className="header">
            <button onClick={() => navigate("/room")} className="back-button">
              Back
            </button>

          </div>
          <h4>Payment</h4>


          <div className="detail-address-main">
            <h6 className='header-address-text'>Address</h6>
            <div>
              <p className='text-address'>7 Klong luang Soi, Phaholyothin Road, Knlog 1, Knlong Luang, Pathum Thani</p>
            </div>
          </div>

          <div className="detailss-containerrr">
            <div className='text-container' >
              <img src={item.imageUrl} alt="" className='image-container' />
              <div className='text-container'>
                <p className='name_room'>{item.roomNumber}</p>
                <p className='price'>{item.price} Bath</p>
              </div>

            </div>
            <div className='text-ccontainer' >
              <hr />
              <p className='priceCC '>{item.price} Bath</p>
            </div>
          </div>



          <div className="payment-methods-main">
            <QR item={item} />
          </div>

          <div className='uploade-slip-payment-card'>
            <p className='warning-text-uploade'>‼️ Don’t forget to send your payment slip.</p>
            <hr />
            <div className='main-upload-and-warning'>
              <p>If it is verified that the
                <span className='blue-text'> payment slip is not genuine </span>
                or 
                <span className='blue-text'> has been altered</span>
                , we will cancel the check-in immediately</p>
              <button onClick={handleUploadClick} className="upload">Upload payment receipt</button>
            </div>
          </div>

        </div>
      </div>
      <Footer />
    </>

  );
};

export default Payment;
