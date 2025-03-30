import React, { useState, useEffect } from 'react';

const Monday = () => {
  const [rooms, setRooms] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [hasSaved, setHasSaved] = useState(false); // สถานะเพื่อเช็คว่าได้บันทึกข้อมูลแล้วหรือยัง

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
  }, []); // เรียกใช้เพียงครั้งเดียวเมื่อ component โหลด

  useEffect(() => {
    // คำนวณราคาห้องที่มีสถานะ "nonavailable"
    const total = rooms
      .filter(room => room.status === "nonavailable")
      .reduce((sum, room) => sum + room.price, 0);

    setTotalPrice(total);

    // ตรวจสอบว่า totalPrice มีค่ามากกว่า 0 และยังไม่บันทึกข้อมูล
    if (total > 0 && !hasSaved) {
      // ส่งข้อมูลไปบันทึกที่ server
      const saveTotalPrice = async () => {
        try {
          const token = localStorage.getItem("token");
          const res = await fetch("http://localhost:5001/api/money", {
            method: "POST", // ใช้ POST ในการบันทึกข้อมูลใหม่
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ price: total }), // ส่ง total price
          });

          if (!res.ok) {
            throw new Error('Failed to save total price');
          }

          const data = await res.json();
          console.log("Total price saved successfully:", data);
          setHasSaved(true); // ตั้งค่าให้บันทึกแล้ว
        } catch (err) {
          console.error("Error saving total price:", err);
        }
      };

      saveTotalPrice(); // บันทึกข้อมูลเมื่อผลรวมราคาเปลี่ยน
    }
  }, [rooms, hasSaved]); // จะคำนวณใหม่แต่จะบันทึกครั้งเดียวถ้าสถานะ `hasSaved` เป็น `false`

  return (
    <div>
      <div style={{ textAlign: "center", fontWeight: "bold", marginTop: "20px" }}>
        <p>{totalPrice}</p>
      </div>
    </div>
  );
};

export default Monday;
