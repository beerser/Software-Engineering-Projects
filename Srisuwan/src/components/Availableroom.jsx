import React, { useEffect, useState } from "react";


const Availableroom = () => {
  const [rooms, setRooms] = useState([]);

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
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))", gap: "1rem", padding: "2rem" }}>
      {rooms.map((room, index) => (
        <div
          key={index}
          style={{
            backgroundColor: room.status === "nonavailable" ? "#BCBCBC" : "#2CDB5D",
            color: room.status === "nonavailable" ? "#fff" : "#fff",
            padding: "20px",
            borderRadius: "10px",
            textAlign: "center",
            fontWeight: "bold",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          }}
        >
          Room {room.room_number}
          <p style={{ fontSize: "0.85rem", fontWeight: "normal" }}>
            {room.status === "nonavailable" ? "(There are customers)" : "(Available)"}
          </p>
        </div>
      ))}

      
      <div
        style={{
          border: "1px dashed #ccc",
          padding: "20px",
          borderRadius: "10px",
          textAlign: "center",
          color: "#666",
          cursor: "pointer",
        }}
      >
        + New room
      </div>
    </div>
  );
};

export default Availableroom;
