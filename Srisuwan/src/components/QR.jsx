import React, { useState } from 'react';
import axios from 'axios';
import "./QR.css";

const QR = ({ item }) => {
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [error, setError] = useState('');

  const genQR = async () => {
    const amount = parseFloat(item.price);

    if (isNaN(amount) || amount <= 0) {
      setError('Invalid amount');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/generateQR', {
        amount: amount,
        phone: '096-996-2367'
      });

      if (response.data.RespCode === 200) {
        setQrCodeUrl(response.data.Result);
        setError('');
      } else {
        setError(response.data.RespMessage || 'Failed to generate QR code');
      }
    } catch (err) {
      setError(err.message || 'Failed to generate QR code');
      console.error('Request Error:', err);
    }
  };

  return (
    <div>
      <div className='textx'>
        <div className="payment-header">
          <p className='Herd'>Payment Methods</p>
          <div className='bt'>
            <ul className="nav justify-content-end">
              <li className="nav-item1">
                <a className="nav-link active" style={{ color: "black" }} aria-current="page">Promptpay</a>
              </li>
              <li className="nav-item2">
                <a className="nav-link">Change</a>
              </li>
            </ul>
          </div>
        </div>
        <hr />
        <div className='lo'>
        <div className='seting'>{error && <div className="error-message" style={{ color: 'red', margin: '10px 0' }}>{error}</div>}
        {qrCodeUrl && <img src={qrCodeUrl} id="imgqr"  style={{ width: "150px", height: "150px", objectFit: "contain" }} alt="QR Code" />}
        </div>
        </div>

        <hr />
        <div > 
        <p className='buu'> 
  <span style={{color:"gray"}}>price</span> 
  <span className='pricee'>{item.price}</span> 
</p>

        </div>
        <hr />
        <div className="terms-container">
          <p className='term'>
            Residents must complete the necessary procedures at the registered address 2-3 days before the due date.
            If the deadline is exceeded, the reservation will be canceled, and it will be in accordance with the
            <span className='Bu'>terms of service,</span>
            <span className='Bu'>terms</span> of use, and <span className='Bu'> privacy policy</span>
          </p>
          <button className='confirm-buttonn' onClick={genQR}>Confirm</button>
        </div>
      </div>

     
    </div>
  );
};

export default QR;