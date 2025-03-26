import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { useAuth } from "../components/AuthContext";
import { saveAs } from "file-saver";
import RoomChart from "../components/RoomChart";
import RoomCalendar from "../components/RoomCalendar";
import Papa from "papaparse";
import { supabase } from "../../../Back-end/supabaseClient";
import "../css/Admin.css";
import CalculatorFee from "../components/Calcutaorfee";
import Edit from "../assets/edit.svg";

const Dashboard = ({ setRooms }) => {
  const [localRooms, setLocalRooms] = useState([]);
  const [pendingChanges, setPendingChanges] = useState([]);
  const [activePage, setActivePage] = useState("dashboard");
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const fetchRooms = async () => {
      const { data, error } = await supabase.from("rooms").select("*");
      if (error) {
        console.error("Error fetching rooms:", error);
      } else {
        setLocalRooms(data);
        setPendingChanges(data);
        setRooms(data);
      }
    };
    fetchRooms();
  }, [setRooms]);

  const handleConfirm = async () => {
    for (const room of pendingChanges) {
      if (room.id) {
        await supabase.from("rooms").update(room).eq("id", room.id);
      } else {
        await supabase.from("rooms").insert([room]);
      }
    }
    alert("ข้อมูลถูกบันทึกลง Supabase แล้ว!");
    setLocalRooms([...pendingChanges]);
  };

  const exportCSV = () => {
    const csv = Papa.unparse(pendingChanges);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "rooms.csv");
  };

  const addRoom = () => {
    const newId = pendingChanges.length
      ? Math.max(...pendingChanges.map((room) => room.id || 0)) + 1
      : 1;
    const newRoom = {
      id: newId,
      room_number: `Room ${newId}`,
      price: 3000,
      status: "available",
      description: "New Room",
      image_url: "https://via.placeholder.com/150",
    };

    setPendingChanges([...pendingChanges, newRoom]);
  };

  const updateRoom = (id, field, value) => {
    setPendingChanges(
      pendingChanges.map((room) =>
        room.id === id ? { ...room, [field]: value } : room
      )
    );
  };

  const deleteRoom = (id) => {
    setPendingChanges(pendingChanges.filter((room) => room.id !== id));
  };

  const renderContent = () => {
    switch (activePage) {
      case "dashboard":
        return (
          <div>
            <h2>Dashboard Overview</h2>

            {/* การ์ดแสดงข้อมูลสำคัญ */}
            <div className="dashboard-summary">
              <div className="card">
                <h4>
                  <strong>Income</strong>
                </h4>
                <p>2000 Bath</p>
              </div>
              <div className="card">
                <h4>
                  <strong>Current tenants</strong>
                </h4>
                <p>
                  {
                    pendingChanges.filter((room) => room.status === "booked")
                      .length
                  }{" "}
                  Rooms
                </p>
              </div>
              <div className="card">
                <h4>
                  <strong>Remaining number of rooms</strong>
                </h4>
                <p>
                  {
                    pendingChanges.filter((room) => room.status === "available")
                      .length
                  }{" "}
                  Rooms
                </p>
              </div>
            </div>

            {/* ปุ่มเพิ่มห้อง */}
            <button
              onClick={addRoom}
              className="btn btn-success"
              style={{ margin: "10px" }}
            >
              Add Room
            </button>

            {/* ส่วนของ Room Chart และ Room Calendar */}
            <div className="room-chart-calendar-container">
              <div className="room-chart">
                <RoomChart rooms={pendingChanges} />
              </div>
              <div className="room-calendar">
                <RoomCalendar rooms={pendingChanges} />
              </div>
            </div>
          </div>
        );

      case "availableRoom":
        return (
          <div>
            <h2 className="texter">Manage room</h2>
            <button
              onClick={addRoom}
              className="btn btn-success"
              style={{ margin: "10px" }}
            >
              Add Room
            </button>
            <div className="available-room-card">
              <div className="room-list">
                {pendingChanges.map((room) => (
                  <div key={room.id} className="room-item">
                    <input
                      type="text"
                      value={room.room_number}
                      onChange={(e) =>
                        updateRoom(room.id, "room_number", e.target.value)
                      }
                      className="form-control"
                    />
                    <img
                      src={room.image_url}
                      alt={room.room_number}
                      style={{
                        width: "100%",
                        height: "150px",
                        objectFit: "cover",
                      }}
                    />
                    <input
                      type="text"
                      value={room.description}
                      onChange={(e) =>
                        updateRoom(room.id, "description", e.target.value)
                      }
                      className="form-control"
                    />
                    <button
                      onClick={() => deleteRoom(room.id)}
                      className="btn btn-danger"
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            </div>
            <button
              onClick={handleConfirm}
              className="btn btn-primary"
              style={{ marginTop: "10px" }}
            >
              Confirm
            </button>
          </div>
        );
      case "managePayment":
        return (
          <div className="payment-card">
            <h2>Manage payment</h2>
            <button onClick={exportCSV} className="btn btn-secondary">
              Export CSV
            </button>
            <CalculatorFee></CalculatorFee>
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
        <ul>
          <li
            onClick={() => setActivePage("dashboard")}
            style={{ cursor: "pointer" }}
          >
            <img
              src={Edit}
              alt="Edit Icon"
              style={{ width: "20px", marginRight: "10px" }}
            />
            Dashboard
          </li>
          <li
            onClick={() => setActivePage("availableRoom")}
            style={{ cursor: "pointer" }}
          >
            <img
              src={Edit}
              alt="Edit Icon"
              style={{ width: "20px", marginRight: "10px" }}
            />
            Available Room
          </li>
          <li
            onClick={() => setActivePage("managePayment")}
            style={{ cursor: "pointer" }}
          >
            <img
              src={Edit}
              alt="Edit Icon"
              style={{ width: "20px", marginRight: "10px" }}
            />
            Manage Payment
          </li>
          <li
            onClick={() => setActivePage("manageBooking")}
            style={{ cursor: "pointer" }}
          >
            <img
              src={Edit}
              alt="Edit Icon"
              style={{ width: "20px", marginRight: "10px" }}
            />
            Manage Booking
          </li>
        </ul>
      </aside>
      <main className="main-content">
        <header className="top-bar">
          <a href="/login" className="logout">
            Logout
          </a>
        </header>
        <section className="content">{renderContent()}</section>
      </main>
    </div>
  );
};

Dashboard.propTypes = {
  setRooms: PropTypes.func.isRequired,
};

export default Dashboard;
