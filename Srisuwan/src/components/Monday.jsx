import React, { useState, useEffect } from 'react';

const Monday = () => {
  const [rooms, setRooms] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:5001/api/rooms", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setRooms(data);
      } catch (err) {
        console.error("Error fetching rooms", err);
      }
    };

    fetchRooms();
  }, []);

  useEffect(() => {
    // คำนวณราคาห้องที่มีสถานะ "nonavailable"
    const total = rooms
      .filter(room => room.status === "nonavailable") // เลือกเฉพาะห้องที่ "nonavailable"
      .reduce((sum, room) => sum + room.price, 0); // บวก `price` ของห้องที่เลือก

    setTotalPrice(total); // บันทึกผลรวมราคาที่คำนวณได้
  }, [rooms]); // คำนวณใหม่ทุกครั้งที่ `rooms` เปลี่ยนแปลง

  return (
    <div>
      <div style={{ textAlign: "center", fontWeight: "bold", marginTop: "20px" }}>
        <p>{totalPrice}</p>
      </div>
    </div>
  );
};

export default Monday;
