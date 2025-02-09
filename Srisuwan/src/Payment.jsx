import React, { useState } from 'react';

const Payment = ({ amount, onGenerateQr }) => {
  const [qrSrc, setQrSrc] = useState("");

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

  return (
    <div className="payment-container">
      <div className="payment-header">
        <h2>Payment Page</h2>
        <p>Amount to pay: {amount}</p>
      </div>

      <div className="payment-details">
        <input
          type="text"
          id="amount"
          placeholder="Enter amount"
          value={amount}
          onChange={(e) => onGenerateQr(e.target.value)}
        />
        <button onClick={genQr}>Generate QR</button>
      </div>

      {qrSrc && (
        <div className="qr-code-container">
          <img
            src={qrSrc}
            alt="QR Code"
            style={{ width: "150px", objectFit: "contain" }}
          />
        </div>
      )}
    </div>
  );
};

export default Payment;
