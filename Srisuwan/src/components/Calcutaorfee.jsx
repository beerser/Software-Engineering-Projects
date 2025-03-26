import React, { useState } from 'react';
import "../css/Calcuraorfee.css";

const RoomFeeCalculator = () => {
  const [roomNumber, setRoomNumber] = useState('');
  const [date, setDate] = useState('');
  const [roomCharge, setRoomCharge] = useState('');
  const [finalWater, setFinalWater] = useState('');
  const [initialWater, setInitialWater] = useState('');
  const [finalElectricity, setFinalElectricity] = useState('');
  const [initialElectricity, setInitialElectricity] = useState('');
  const [serviceFee, setServiceFee] = useState('');

  const waterFee = finalWater && initialWater ? Number(finalWater) - Number(initialWater) : 0;
  const electricityFee = finalElectricity && initialElectricity ? Number(finalElectricity) - Number(initialElectricity) : 0;
  const total = Number(roomCharge || 0) + waterFee + electricityFee + Number(serviceFee || 0);

  return (
    <div>
      <h2 className="k">Room Fee Calculator</h2>
      <div className='Roomtext'>
        <label>Room number</label>
        <input type="text" value={roomNumber} onChange={(e) => setRoomNumber(e.target.value)} />
      </div>
      <div>
        <label>Date</label>
        <input type="month" value={date} onChange={(e) => setDate(e.target.value)} />
      </div>
      <div className='Roomtext'>
        <label>Room charge</label>
        <input type="number" value={roomCharge} onChange={(e) => setRoomCharge(e.target.value)} />
      </div>
      <div className="water">
        <label>Water fee</label>
        <div>
          <input type="number" value={finalWater} onChange={(e) => setFinalWater(e.target.value)} placeholder="Final" />
          <input type="number" value={initialWater} onChange={(e) => setInitialWater(e.target.value)} placeholder="Initial" />
          <input type="number" value={waterFee} readOnly />
        </div>
      </div>
      <div className="water">
        <label>Electricity fee</label>
        <div className="grid grid-cols-3 gap-2">
          <input type="number" value={finalElectricity} onChange={(e) => setFinalElectricity(e.target.value)} placeholder="Final" />
          <input type="number" value={initialElectricity} onChange={(e) => setInitialElectricity(e.target.value)} placeholder="Initial" />
          <input type="number" value={electricityFee} readOnly />
        </div>
      </div>
      <div className='Roomtext'>
        <label>Service fee</label>
        <input type="number" value={serviceFee} onChange={(e) => setServiceFee(e.target.value)} />
      </div>
      <div className='Roomtext'>
        <label>Total</label>
        <input type="number" value={total} readOnly />
      </div>
      <button>Confirm</button>
    </div>
  );
};

export default RoomFeeCalculator;   