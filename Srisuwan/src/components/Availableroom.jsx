import React, { useEffect, useState } from "react";
import "../css/Available.css";

const Availableroom = () => {
  const [rooms, setRooms] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({});
  const [isNewRoom, setIsNewRoom] = useState(false);

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
    setForm(room); // ตั้งค่าฟอร์มเป็นข้อมูลของห้องที่เลือก
    setIsNewRoom(false);
    setShowModal(true);
  };

  // การเพิ่มห้องใหม่
  const handleAddNew = () => {
    setForm({
      room_number: "",
      price: 0,
      status: "available",
      description: "",
      servicefee: 50,
    });
    setIsNewRoom(true);
    setShowModal(true);
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
      if (isNewRoom) {
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

      setShowModal(false); // ปิด modal หลังการบันทึก
    } catch (err) {
      console.error("Error saving room:", err);
      alert("Save error occurred");
    }
  };

  // Modal component
  const RoomModal = () => {
    if (!showModal) return null;

    return (
      <div className="modal-overlay" style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000
      }}>
        <div className="modal-content" style={{
          backgroundColor: "white",
          padding: "20px",
          borderRadius: "10px",
          width: "90%",
          maxWidth: "500px",
          maxHeight: "80vh",
          overflow: "auto"
        }}>
          <h3>{isNewRoom ? "Add New Room" : "Edit Room"}</h3>

          <div style={{ marginBottom: "15px" }}>
            <label style={{ display: "block", marginBottom: "5px" }}>Room Number:</label>
            <input
              name="room_number"
              value={form.room_number || ""}
              onChange={handleChange}
              style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ddd" }}
            />
          </div>

          <div style={{ marginBottom: "15px" }}>
            <label style={{ display: "block", marginBottom: "5px" }}>Price:</label>
            <input
              name="price"
              type="number"
              value={form.price || 0}
              onChange={handleChange}
              style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ddd" }}
            />
          </div>

          <div style={{ marginBottom: "15px" }}>
            <label style={{ display: "block", marginBottom: "5px" }}>Status:</label>
            <div className="main-avaliable-on-avaliable-page">
              <input
                className="input-layout-on-avaliable-page"
                type="radio"
                id="modal-available"
                name="modal-status"
                checked={form.status === "available"}
                onChange={() => handleStatusChange("available")}
              />
              <label 
                htmlFor="modal-available" style={{ marginLeft: "5px" }}
                className="text-status-layout-on-avaliable-page"
                >
                  Available
              </label>
            </div>
            <div className="main-avaliable-on-not-avaliable-page">
              <input
                className="input-layout-on-avaliable-page"
                type="radio"
                id="modal-nonavailable"
                name="modal-status"
                checked={form.status === "nonavailable"}
                onChange={() => handleStatusChange("nonavailable")}
              />
              <label 
                className="text-status-layout-on-avaliable-page"
                htmlFor="modal-nonavailable" style={{ marginLeft: "5px" }}
                >
                  Not available
              </label>
            </div>
          </div>

          <div style={{ marginBottom: "15px" }}>
            <label style={{ display: "block", marginBottom: "5px" }}>Description:</label>
            <input
              name="description"
              value={form.description || ""}
              onChange={handleChange}
              style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ddd" }}
            />
          </div>

          <div style={{ marginBottom: "15px" }}>
            <label style={{ display: "block", marginBottom: "5px" }}>Service Fee:</label>
            <input
              name="servicefee"
              type="number"
              value={form.servicefee || 50}
              onChange={handleChange}
              style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ddd" }}
            />
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "20px" }}>
            <button
              onClick={() => setShowModal(false)}
              style={{
                padding: "8px 15px",
                borderRadius: "4px",
                border: "1px solid #ddd",
                backgroundColor: "#f5f5f5",
                color: "red",
              }}
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="savebt"
              style={{
                padding: "8px 15px",
                borderRadius: "4px",
                border: "none",
                backgroundColor: "#2CDB5D",
                color: "white"
              }}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
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
            onClick={() => handleEdit(room)}
            style={{
              backgroundColor: room.status === "nonavailable" ? "#BCBCBC" : "#2CDB5D",
              color: "#fff",
              padding: "20px",
              borderRadius: "10px",
              textAlign: "center",
              fontWeight: "bold",
              cursor: "pointer",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              minHeight: "100px"
            }}
          >
            <div style={{ fontSize: "1.2rem" }}>{room.room_number}</div>
            <p style={{ fontSize: "0.85rem", fontWeight: "normal", margin: "10px 0 0" }}>
              {room.status === "nonavailable"
                ? "(There are customers)"
                : "(Available)"}
            </p>
            <div style={{ fontSize: "0.9rem", marginTop: "5px" }}>
              ฿{room.price}

            </div>
          </div>
        ))}

        <div
          onClick={handleAddNew}
          style={{
            border: "1px dashed #ccc",
            padding: "20px",
            borderRadius: "10px",
            textAlign: "center",
            color: "#666",
            cursor: "pointer",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            minHeight: "100px"
          }}
        >
          <div style={{ fontSize: "24px", marginBottom: "5px" }}>+</div>
          <div>New room</div>
        </div>
      </div>

      <RoomModal />
    </>
  );
};

export default Availableroom;