import React, { useEffect, useState, useCallback } from "react";
import "../css/Available.css";

const RoomModal = ({ form, onChange, onStatusChange, onSave, onCancel, isNewRoom }) => {
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
          <label>Room Number:</label>
          <input
            name="room_number"
            value={form.room_number}
            onChange={onChange}
            style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ddd" }}
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label>Price:</label>
          <input
            name="price"
            type="text"
            inputMode="numeric"
            value={form.price}
            onChange={onChange}
            style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ddd" }}
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label>Status:</label>
          <div>
            <input
              type="radio"
              id="modal-available"
              name="modal-status"
              checked={form.status === "available"}
              onChange={() => onStatusChange("available")}
            />
            <label htmlFor="modal-available">Available</label>
          </div>
          <div>
            <input
              type="radio"
              id="modal-nonavailable"
              name="modal-status"
              checked={form.status === "nonavailable"}
              onChange={() => onStatusChange("nonavailable")}
            />
            <label htmlFor="modal-nonavailable">Not available</label>
          </div>
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label>Description:</label>
          <input
            name="description"
            value={form.description}
            onChange={onChange}
            style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ddd" }}
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label>Service Fee:</label>
          <input
            name="servicefee"
            type="text"
            inputMode="numeric"
            value={form.servicefee}
            onChange={onChange}
            style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ddd" }}
          />
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "20px" }}>
          <button onClick={onCancel} style={{ padding: "8px 15px", borderRadius: "4px", border: "1px solid #ddd", backgroundColor: "#f5f5f5", color: "red" }}>Cancel</button>
          <button onClick={onSave} className="savebt" style={{ padding: "8px 15px", borderRadius: "4px", border: "none", backgroundColor: "#2CDB5D", color: "white" }}>Save</button>
        </div>
      </div>
    </div>
  );
};

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

  const handleEdit = (room) => {
    setForm({
      _id: room._id,
      room_number: room.room_number || "",
      price: String(room.price || ""),
      status: room.status || "available",
      description: room.description || "",
      servicefee: String(room.servicefee || "")
    });
    setIsNewRoom(false);
    setShowModal(true);
  };

  const handleAddNew = () => {
    setForm({
      room_number: "",
      price: "",
      status: "available",
      description: "",
      servicefee: ""
    });
    setIsNewRoom(true);
    setShowModal(true);
  };

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleStatusChange = useCallback((status) => {
    setForm((prev) => ({ ...prev, status }));
  }, []);

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");

      const payload = {
        ...form,
        price: Number(form.price),
        servicefee: Number(form.servicefee),
      };

      if (isNewRoom) {
        const res = await fetch("http://localhost:5001/api/admin/rooms", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });

        if (!res.ok) {
          const text = await res.text();
          alert(`Create failed: ${res.status} ${text}`);
          return;
        }

        const result = await res.json();
        const newRoom = result.data || payload;
        setRooms((prev) => [...prev, newRoom]);
      } else {
        const res = await fetch("http://localhost:5001/api/admin/rooms", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify([payload]),
        });

        if (!res.ok) {
          const text = await res.text();
          alert(`Update failed: ${res.status} ${text}`);
          return;
        }

        const result = await res.json();
        const updatedRoom = result.data?.[0] || payload;
        setRooms((prev) =>
          prev.map((r) => (r._id === updatedRoom._id ? updatedRoom : r))
        );
      }

      setShowModal(false);
    } catch (err) {
      console.error("Error saving room:", err);
      alert("Save error occurred");
    }
  };

  return (
    <>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: "1rem", padding: "2rem" }}>
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
              {room.status === "nonavailable" ? "(There are customers)" : "(Available)"}
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

      {showModal && (
        <RoomModal
          form={form}
          onChange={handleChange}
          onStatusChange={handleStatusChange}
          onSave={handleSave}
          onCancel={() => setShowModal(false)}
          isNewRoom={isNewRoom}
        />
      )}
    </>
  );
};

export default Availableroom;
