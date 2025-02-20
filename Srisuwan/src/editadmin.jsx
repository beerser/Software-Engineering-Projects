import React, { useState } from "react";
import PropTypes from "prop-types";
import "./editadmin.css";

const Dashboard = ({ rooms, setRooms }) => {
  const [localRooms, setLocalRooms] = useState([...rooms]);
  const [activePage, setActivePage] = useState("dashboard");

  const handleConfirm = () => {
    setRooms(localRooms); // ส่งข้อมูลกลับไปยัง App.js
    alert("Data confirmed and updated!");
  };

  const addRoom = () => {
    const newId = localRooms.reduce((maxId, room) => Math.max(maxId, room.id), 0) + 1;
    const newRoom = {
      id: newId,
      title: `Room ${newId}`,
      url: "https://via.placeholder.com/150",
      content: "New Room"
    };
    setLocalRooms([...localRooms, newRoom]);
    console.log("Added Room: ", newRoom);
  };

  const updateRoom = (id, newTitle, newUrl, newContent) => {
    const updatedRooms = localRooms.map((room) =>
      room.id === id ? { ...room, title: newTitle, url: newUrl, content: newContent } : room
    );
    setLocalRooms(updatedRooms);
  };

  const deleteRoom = (id) => {
    const updatedRooms = localRooms.filter((room) => room.id !== id);
    setLocalRooms(updatedRooms);
  };

  const renderContent = () => {
    switch (activePage) {
      case "dashboard":
        return <h2>Dashboard Overview</h2>;
      case "availableRoom":
        return (
          <div>
            <h2 className="texter">Manage room</h2>
            <button onClick={addRoom} className="btn btn-success" style={{ margin: "10px" }}>Add Room</button>
            <div className="available-room-card">
              <div className="room-list">
                {localRooms.map((room) => (
                  <div key={room.id} className="room-item">
                    <img src={room.url} alt={room.title} style={{ width: "100%", height: "150px", objectFit: "cover" }} />
                    <input
                      type="text"
                      value={room.title}
                      onChange={(e) =>
                        updateRoom(room.id, e.target.value, room.url, room.content)
                      }
                      className="form-control"
                    />
                    <input
                      type="text"
                      value={room.url}
                      onChange={(e) =>
                        updateRoom(room.id, room.title, e.target.value, room.content)
                      }
                      className="form-control"
                    />
                    <input
                      type="text"
                      value={room.content}
                      onChange={(e) =>
                        updateRoom(room.id, room.title, room.url, e.target.value)
                      }
                      className="form-control"
                    />
                    <button onClick={() => deleteRoom(room.id)} className="btn btn-danger">
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            </div>
            <button onClick={handleConfirm} className="btn btn-primary" style={{ marginTop: "10px" }}>
              Confirm
            </button>
          </div>
        );
      case "managePayment":
        return (
          <div className="payment-card">
            <h2>Manage payment</h2>
          </div>
        );
      case "manageBooking":
        return (
          <div>
            <h3 className="texter">Manage Booking</h3>
          </div>
        );
      default:
        return <h2>Dashboard Overview</h2>;
    }
  };

  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <h2>SRISUWAN</h2>
        <ul>
          <li onClick={() => setActivePage("dashboard")} style={{ cursor: "pointer" }}>Dashboard</li>
          <li onClick={() => setActivePage("availableRoom")} style={{ cursor: "pointer" }}>Available Room</li>
          <li onClick={() => setActivePage("managePayment")} style={{ cursor: "pointer" }}>Manage payment</li>
          <li onClick={() => setActivePage("manageBooking")} style={{ cursor: "pointer" }}>Manage booking</li>
        </ul>
      </aside>
      <main className="main-content">
        <header className="top-bar">
          <a href="/login" className="logout">Logout</a>
        </header>
        <section className="content">
          {renderContent()}
        </section>
      </main>
    </div>
  );
};

Dashboard.propTypes = {
  rooms: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      title: PropTypes.string.isRequired,
      content: PropTypes.string.isRequired,
    })
  ).isRequired,
  setRooms: PropTypes.func.isRequired
};

export default Dashboard;
