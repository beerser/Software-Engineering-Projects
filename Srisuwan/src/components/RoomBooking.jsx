import React, { useState } from 'react';
import Payment from './Payment';

const RoomBooking = () => {
  const [amount, setAmount] = useState('');
  const [isBooked, setIsBooked] = useState(false);

  const handleBookRoom = () => {
    setIsBooked(true);
  };

  const handleGenerateQr = (amount) => {
    setAmount(amount);
  };

  if (isBooked) {
    return <Payment amount={amount} onGenerateQr={handleGenerateQr} />;
  }

  return (
    <div>
      <h2>Book Room</h2>
      <button onClick={handleBookRoom}>Book a Room</button>
    </div>
  );
};

export default RoomBooking;
