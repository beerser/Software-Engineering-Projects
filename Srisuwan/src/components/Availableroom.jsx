import React, { useEffect, useState } from "react";
import "../css/Available.css";
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
    console.log(`Field changed: ${name} = ${value}`);
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // การจัดการเปลี่ยนค่า status ด้วย radio button
  const handleStatusChange = (status) => {
    console.log(`Status changed to: ${status}`);
    setForm((prev) => ({ ...prev, status }));
  };

  // การบันทึกข้อมูลห้อง
  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");
      console.log("Saving form data:", form); // Debug
      
      // แยกการจัดการระหว่างการเพิ่มห้องใหม่กับการอัปเดตห้องที่มีอยู่
      if (editingRoom === "new") {
        // POST request สำหรับห้องใหม่
        const res = await fetch("http://localhost:5001/api/admin/rooms", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(form),
        });
        
        if (!res.ok) {
          const text = await res.text();
          console.error("Error response:", text);
          alert(`Create failed: ${res.status} ${text}`);
          return;
        }
        
        const result = await res.json();
        console.log("Response from server:", result);
        
        // เพิ่มห้องใหม่เข้าไปในรายการ
        const newRoom = result.data || form;
        setRooms((prev) => [...prev, newRoom]);
      } else {
        // PUT request สำหรับการอัปเดตห้องที่มีอยู่
        const res = await fetch("http://localhost:5001/api/admin/rooms", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify([form]),
        });
        
        if (!res.ok) {
          const text = await res.text();
          console.error("Error response:", text);
          alert(`Update failed: ${res.status} ${text}`);
          return;
        }
        
        const result = await res.json();
        console.log("Response from server:", result);
        
        // อัปเดตห้องในรายการ
        const updatedRoom = result.data?.[0] || form;
        setRooms((prev) =>
          prev.map((r) => (r._id === updatedRoom._id ? updatedRoom : r))
        );
      }
      
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
                value={form.room_number || ""}
                onChange={handleChange}
                style={{ width: "100%", marginBottom: "5px" }}
              />
              <input
                name="price"
                type="number"
                value={form.price || 0}
                onChange={handleChange}
                style={{ width: "100%", marginBottom: "5px" }}
              />
              
              {/* แทนที่ select ด้วย radio button */}
              <div style={{ marginBottom: "10px", textAlign: "left" }}>
                <div>
                  <input
                    type="radio"
                    id={`available-${room._id}`}
                    name={`status-${room._id}`}
                    checked={form.status === "available"}
                    onChange={() => handleStatusChange("available")}
                  />
                  <label htmlFor={`available-${room._id}`} style={{ marginLeft: "5px", color: "white" }}>
                    Available
                  </label>
                </div>
                <div>
                  <input
                    type="radio"
                    id={`nonavailable-${room._id}`}
                    name={`status-${room._id}`}
                    checked={form.status === "nonavailable"}
                    onChange={() => handleStatusChange("nonavailable")}
                  />
                  <label htmlFor={`nonavailable-${room._id}`} style={{ marginLeft: "5px", color: "white" }}>
                    Not available
                  </label>
                </div>
              </div>
              
              <button onClick={handleSave} className="savebt">
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
            value={form.room_number || ""}
            onChange={handleChange}
            style={{ marginRight: "10px", marginBottom: "10px" }}
          />
          <input
            name="price"
            type="number"
            placeholder="Price"
            value={form.price || 0}
            onChange={handleChange}
            style={{ marginRight: "10px", marginBottom: "10px" }}
          />
          
          {/* แทนที่ select ด้วย radio button */}
          <div style={{ display: "inline-block", marginRight: "20px", marginBottom: "10px" }}>
            <div style={{ fontWeight: "bold", marginBottom: "5px" }}>Status:</div>
            <div>
              <input
                type="radio"
                id="new-available"
                name="new-status"
                checked={form.status === "available"}
                onChange={() => handleStatusChange("available")}
              />
              <label htmlFor="new-available" style={{ marginLeft: "5px" }}>
                Available
              </label>
            </div>
            <div>
              <input
                type="radio"
                id="new-nonavailable"
                name="new-status"
                checked={form.status === "nonavailable"}
                onChange={() => handleStatusChange("nonavailable")}
              />
              <label htmlFor="new-nonavailable" style={{ marginLeft: "5px" }}>
                Not available
              </label>
            </div>
          </div>
          
          <input
            name="description"
            placeholder="Description"
            value={form.description || ""}
            onChange={handleChange}
            style={{ marginRight: "10px", marginBottom: "10px" }}
          />
          <button onClick={handleSave} className="savebt">Save</button>
        </div>
      )}
    </div>
  );
};

export default Availableroom;