import React, { useEffect, useState, useCallback } from "react";
import "../css/Available.css";


const imageOptions = [
  "https://i.ibb.co/8LqJjJgz/1-rooms-and-suites.jpg",
  "https://i.ibb.co/GQz1CN35/2-rooms-and-suites.webp",
  "https://i.ibb.co/Spt0pkp/Standard1609-2.webp",
  "https://i.ibb.co/8gRSJk25/Superior1609-2.webp",
  "https://i.ibb.co/JFpmdKvx/types-hotel-rooms.jpg"
];



const RoomModal = ({ form, onChange, onStatusChange, onSave, onCancel, onDelete, isNewRoom }) => {
  return (
    <div className="modal-overlay">
      <div className="model-content-on-avaliable-admin-page">
        <h3>{isNewRoom ? "Add New Room" : "Edit Room"}</h3>

        <div className="input-group-on-avaliable-admin-page">
          <label>Room Number:</label>
          <input name="room_number" value={form.room_number} onChange={onChange} />
        </div>

        <div className="input-group-on-avaliable-admin-page">
          <label>Price:</label>
          <input name="price" type="text" inputMode="numeric" value={form.price} onChange={onChange} />
        </div>

        <div className="input-group-on-avaliable-admin-page">
          <label>Status:</label>
          <div className="select-status-display-flex">
            <input 
              className="circle-status-on-avaliable-admin-page"
              type="radio" 
              id="modal-available" 
              name="modal-status" 
              checked={form.status === "available"} 
              onChange={() => onStatusChange("available")} 
            />
            <label htmlFor="modal-available" className="status-text-on-avaliable-admin-page">Available</label>
          </div>
          <div className="select-status-display-flex">
            <input 
              className="circle-status-on-avaliable-admin-page"
              type="radio" 
              id="modal-nonavailable" 
              name="modal-status" 
              checked={form.status === "nonavailable"} 
              onChange={() => onStatusChange("nonavailable")} 
            />
            <label htmlFor="modal-nonavailable" className="status-text-on-avaliable-admin-page">Not available</label>
          </div>
        </div>

        <div className="input-group-on-avaliable-admin-page">
          <label>Description:</label>
          <input name="description" value={form.description} onChange={onChange} />
        </div>

        {/* Section สำหรับเลือก 5 รูป */}
        <div className="input-group-on-avaliable-admin-page">
          <label>Room Images (Select up to 5):</label>
          {[...Array(5)].map((_, index) => (
            <div key={index} className="image-input">
              <select 
                name={`image_urls_${index}`} 
                value={form[`image_urls_${index}`]} 
                onChange={onChange}
              >
                {imageOptions.map((url, imgIndex) => (
                  <option key={imgIndex} value={url}>
                    Image {imgIndex + 1}
                  </option>
                ))}
              </select>
              {form[`image_urls_${index}`] && (
                <img 
                  src={form[`image_urls_${index}`]} 
                  alt={`Preview ${index + 1}`} 
                  className="preview-image" 
                />
              )}
            </div>
          ))}
        </div>

        <div className="input-group-on-avaliable-admin-page">
          <label>Service Fee:</label>
          <input name="servicefee" type="text" inputMode="numeric" value={form.servicefee} onChange={onChange} />
        </div>

        <div className="modal-buttons">
          {/* ปุ่ม Delete ถ้าไม่ใช่ห้องใหม่ */}
          {!isNewRoom && (
            <button 
              onClick={onDelete} 
              style={{ backgroundColor: "#e74c3c", color: "white", padding: "8px 16px", border: "none", borderRadius: "5px", cursor: "pointer" }}
            >
              Delete Room
            </button>
          )}
          <button onClick={onCancel} className="cancel-button">Cancel</button>
          <button onClick={onSave} className="save-button">Save</button>
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

  const fetchRooms = async () => {
    try {
      const res = await fetch("http://localhost:5001/api/rooms");
      const data = await res.json();
      setRooms(data);
    } catch (err) {
      console.error("Error fetching rooms", err);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const handleEdit = (room) => {
    setForm({
      _id: room._id,
      room_number: room.room_number || "",
      price: String(room.price || ""),
      status: room.status || "available",
      description: room.description || "",
      servicefee: String(room.servicefee || ""),
      ...Object.fromEntries((room.image_urls || []).map((url, index) => [`image_urls_${index}`, url]))
    });
    setIsNewRoom(false);
    setShowModal(true);
  };

  const handleAddNew = () => {
    setForm({ room_number: "", price: "", status: "available", description: "", servicefee: "", image_urls_0: "", image_urls_1: "", image_urls_2: "", image_urls_3: "", image_urls_4: "" });
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

  const handleDelete = async () => {
    if (!form._id) return;
    const confirmDelete = window.confirm("Are you sure you want to delete this room?");
    if (!confirmDelete) return;

    try {
      const res = await fetch(`http://localhost:5001/api/admin/rooms/${form._id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setRooms((prev) => prev.filter((r) => r._id !== form._id));
        setShowModal(false);
      } else {
        alert("Failed to delete room.");
      }
    } catch (err) {
      console.error("Error deleting room:", err);
    }
  };

  const handleSave = async () => {
    try {
      if (isNewRoom) {
        const duplicate = rooms.find((r) => r.room_number === form.room_number);
        if (duplicate) {
          alert("Room number already exists. Please use a unique room number.");
          return;
        }
      }

      const image_urls = Array.from({ length: 5 }, (_, i) => form[`image_urls_${i}`]).filter(url => url?.trim() !== "");

      const payload = {
        room_number: form.room_number,
        price: Number(form.price),
        status: form.status,
        description: form.description,
        servicefee: Number(form.servicefee),
        image_urls,
      };

      if (isNewRoom) {
        const res = await fetch("http://localhost:5001/api/admin/rooms", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const result = await res.json();
        const newRoom = result.data || payload;
        setRooms((prev) => [...prev, newRoom]);
      } else {
        const updatedPayload = { ...payload, _id: form._id };
        const res = await fetch("http://localhost:5001/api/admin/rooms", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify([updatedPayload]),
        });
        const result = await res.json();
        const updatedRoom = result.data?.[0] || updatedPayload;
        setRooms((prev) => prev.map((r) => (r._id === updatedRoom._id ? updatedRoom : r)));
      }

      setShowModal(false);
    } catch (err) {
      console.error("Error saving room:", err);
    }
  };

  return (
    <>
      <div className="room-grid">
        {rooms.map((room) => (
          <div key={room._id} onClick={() => handleEdit(room)} className={`room-card ${room.status === "nonavailable" ? "nonavailable" : "available"}`}>
            <div>{room.room_number}</div>
            <p>{room.status === "nonavailable" ? "(There are customers)" : "(Available)"}</p>
            <div>฿{room.price}</div>
          </div>
        ))}

        <div onClick={handleAddNew} className="new-room-on-avaliable-admin-page">
          <div>+</div>
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
          onDelete={handleDelete}
          isNewRoom={isNewRoom}
        />
      )}
    </>
  );
};

export default Availableroom;
