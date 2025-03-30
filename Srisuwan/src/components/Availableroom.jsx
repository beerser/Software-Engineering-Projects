import React, { useEffect, useState } from "react";

const Availableroom = () => {
  const [rooms, setRooms] = useState([]);
  const [editingRoom, setEditingRoom] = useState(null);
  const [form, setForm] = useState({});

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

  // การแก้ไขข้อมูลห้อง
  const handleEdit = (room) => {
    setEditingRoom(room._id); // เซ็ตห้องที่กำลังแก้ไข
    setForm(room); // ตั้งค่าฟอร์มเป็นข้อมูลของห้องที่เลือก
  };

  // การเปลี่ยนแปลงข้อมูลในฟอร์ม
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // การบันทึกข้อมูลห้อง
  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");
      console.log("Sending:", form); // ดูข้อมูลที่จะส่ง
  
      const res = await fetch("http://localhost:5001/api/admin/rooms", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify([form]),
      });
  
      // เช็กสถานะของ response ก่อน parse JSON
      if (!res.ok) {
        const text = await res.text();  // แปลงเป็นข้อความหาก response ไม่ใช่ JSON
        console.error("❌ Error response:", text); // log แสดง error ที่ได้รับ
        alert(`Save failed: ${res.status} ${text}`);
        return;
      }
  
      const result = await res.json();
      console.log("Response:", result);
  
      // ถ้า OK แล้ว อัปเดต
      const updatedRoom = result.data?.[0] || form;
      setRooms((prev) =>
        prev.map((r) => (r._id === updatedRoom._id ? updatedRoom : r))
      );
      setEditingRoom(null); // ปิดการแก้ไข
    } catch (err) {
      console.error("Error saving room:", err);
      alert("Save error occurred");
    }
  };
  

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
        gap: "1rem",
        padding: "2rem",
      }}
    >
      {rooms.map((room) => (
        <div
          key={room._id}
          onClick={() => handleEdit(room)} // คลิกที่ห้องเพื่อแก้ไข
          style={{
            backgroundColor: room.status === "nonavailable" ? "#BCBCBC" : "#2CDB5D",
            color: "#fff",
            padding: "20px",
            borderRadius: "10px",
            textAlign: "center",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          {editingRoom === room._id ? (
            <>
              <input
                name="room_number"
                value={form.room_number}
                onChange={handleChange}
                style={{ width: "100%", marginBottom: "5px" }}
              />
              <input
                name="price"
                type="number"
                value={form.price}
                onChange={handleChange}
                style={{ width: "100%", marginBottom: "5px" }}
              />
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                style={{ width: "100%", marginBottom: "5px" }}
              >
                <option value="available">Available</option>
                <option value="nonavailable">Not available</option>
              </select>
              <button onClick={handleSave} style={{ width: "100%" }}>
                Save
              </button>
            </>
          ) : (
            <>
              {room.room_number}
              <p style={{ fontSize: "0.85rem", fontWeight: "normal" }}>
                {room.status === "nonavailable"
                  ? "(There are customers)"
                  : "(Available)"}
              </p>
            </>
          )}
        </div>
      ))}

      <div
        onClick={() => {
          setEditingRoom("new");
          setForm({
            room_number: "",
            price: 0,
            status: "available",
            description: "",
            servicefee: 50,
          });
        }}
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

      {editingRoom === "new" && (
        <div style={{ gridColumn: "1 / -1", backgroundColor: "#f9f9f9", padding: "1rem" }}>
          <h3>Add New Room</h3>
          <input
            name="room_number"
            placeholder="Room No."
            value={form.room_number}
            onChange={handleChange}
          />
          <input
            name="price"
            type="number"
            placeholder="Price"
            value={form.price}
            onChange={handleChange}
          />
          <select name="status" value={form.status} onChange={handleChange}>
            <option value="available">Available</option>
            <option value="nonavailable">Not available</option>
          </select>
          <input
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={handleChange}
          />
          <button onClick={handleSave}>Save</button>
        </div>
      )}
    </div>
  );
};

export default Availableroom;
