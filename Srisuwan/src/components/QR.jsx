import React, { useState } from 'react';
import axios from 'axios';
import "./QR.css";

const QR = ({ item }) => {
  const [qrCodeUrl, setQrCodeUrl] = useState('');

  const genQR = async () => {
   
    const amount = parseFloat(item.price); 

    if (isNaN(amount) || amount <= 0) {
      alert('Invalid amount'); 
      return;
    }

    try {

      const response = await axios.post('http://localhost:3000/generateQR', {
        amount: amount,
      });

      if (response.data.RespCode === 200) {
        setQrCodeUrl(response.data.Result); 
      } else {
        console.error('QR Generation Error:', response.data.RespMessage);
      }
    } catch (err) {
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
                <a className="nav-link active" style={{ color: "black" }} aria-current="page">Cash</a>
              </li>
              <li className="nav-item2">
                <a className="nav-link">Change</a>
              </li>
            </ul>
          </div>
        </div>
        <hr />
        <div className='lo'>
       
          <input type='text' id="amount" value={item.price} disabled />
        </div>
        <hr />
        <div className="terms-container">
          <p className='term'>
            Residents must complete the necessary procedures at the registered address 2-3 days before the due date.
            If the deadline is exceeded, the reservation will be canceled, and it will be in accordance with the
            <span className='Bu'>terms of service,</span>
            <span className='Bu'>terms</span> of use, and  <span className='Bu'> privacy policy</span>
          </p>
          <button className='confirm-buttonn' onClick={genQR}>Confirm</button>
        </div>
      </div>


      {qrCodeUrl && <img src={qrCodeUrl} id="imgqr" style={{ width: "500px", objectFit: "contain" }} alt="QR Code" />}
    </div>
  );
};

export default QR;
