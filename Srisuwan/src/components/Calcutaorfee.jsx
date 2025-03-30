import React, { useState, useEffect } from "react";
import "../css/Calcuraorfee.css";

const RoomFeeCalculator = () => {
  const [roomNumber, setRoomNumber] = useState("");
  const [date, setDate] = useState("");
  const [roomCharge, setRoomCharge] = useState("");
  const [finalWater, setFinalWater] = useState("");
  const [initialWater, setInitialWater] = useState("");
  const [finalElectricity, setFinalElectricity] = useState("");
  const [initialElectricity, setInitialElectricity] = useState("");
  const [serviceFee, setServiceFee] = useState("");
  const [rooms, setRooms] = useState([]);

  
  const waterFee =
    finalWater && initialWater
      ? Math.abs(Number(finalWater) - Number(initialWater)) * 20
      : 0;

  
  const electricityFee =
    finalElectricity && initialElectricity
      ? Math.abs(Number(finalElectricity) - Number(initialElectricity)) * 7
      : 0;

 
  const total =
    Number(roomCharge || 0) +
    waterFee +
    electricityFee +
    Number(serviceFee || 0);

  
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:5001/api/rooms", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        setRooms(data);
      } catch (err) {
        console.error("Error fetching rooms", err);
      }
    };

    fetchRooms();
  }, []);

  return (
    <div>
      <h2 className="k">Room Fee Calculator</h2>

      
      <div className="Roomtext">
        <label>Room number</label>
        <select
          value={roomNumber}
          onChange={(e) => {
            const selectedRoom = rooms.find(
              (room) => room.room_number === e.target.value
            );
            setRoomNumber(e.target.value);
            if (selectedRoom) {
              setRoomCharge(selectedRoom.price);
              setServiceFee(selectedRoom.servicefee || 0);
            } else {
              setRoomCharge("");
              setServiceFee("");
            }
          }}
        >
          <option value="">-- Select a room --</option>
          {rooms.map((room) => (
            <option key={room._id} value={room.room_number}>
              {room.room_number}
            </option>
          ))}
        </select>
      </div>

      {/* วันที่ */}
      <div>
        <label>Date</label>
        <input
          type="month"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </div>

      {/* ค่าเช่าห้อง */}
      <div className="Roomtext">
        <label>Room charge</label>
        <input type="number" value={roomCharge} readOnly />
      </div>

      {/* ค่าน้ำ */}
      <div className="water">
        <label>Water fee</label>
        <div>
          <input
            type="number"
            value={initialWater}
            onChange={(e) => setInitialWater(e.target.value)}
            placeholder="Initial"
          />
          <input
            type="number"
            value={finalWater}
            onChange={(e) => setFinalWater(e.target.value)}
            placeholder="Final"
          />
          <input type="number" value={waterFee} readOnly />
        </div>
      </div>

      
      <div className="water">
        <label>Electricity fee</label>
        <div className="grid grid-cols-3 gap-2">
          <input
            type="number"
            value={initialElectricity}
            onChange={(e) => setInitialElectricity(e.target.value)}
            placeholder="Initial"
          />
          <input
            type="number"
            value={finalElectricity}
            onChange={(e) => setFinalElectricity(e.target.value)}
            placeholder="Final"
          />
          <input type="number" value={electricityFee} readOnly />
        </div>
      </div>

     
      <div className="Roomtext">
        <label>Service fee</label>
        <input type="number" value={serviceFee} readOnly />
      </div>

   
      <div className="Roomtext">
        <label>Total</label>
        <input type="number" value={total} readOnly />
      </div>

      <button>Confirm</button>
    </div>
  );
};

export default RoomFeeCalculator;
