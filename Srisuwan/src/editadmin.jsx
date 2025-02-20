import React, { useState } from "react";
import PropTypes from "prop-types";
import "./editadmin.css";

const Dashboard = ({ obj }) => {
  const [activePage, setActivePage] = useState("dashboard");

  const handleManageBooking = () => {
    console.log("Managing booking...");
  };

  const renderContent = () => {
    switch (activePage) {
      case "dashboard":
        return <h2>Dashboard Overview</h2>;
      case "availableRoom":
        return (
          <div className="available-room-card">
            <h3>Available rooms</h3>
            <div className="room-list">
              {obj.map((room) => (
                <div key={room.id} className="room-item">
                  <h4>{room.title}</h4>
                  <p>{room.content}</p>
                </div>
              ))}
            </div>
          </div>
        );
      case "managePayment":
        return <h2>Manage Payment</h2>;
      case "manageBooking":
        return (
          <div className="booking-card">
            <h3>Booking</h3>
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Lastname</th>
                  <th>Date</th>
                  <th>Phone number</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Teerapat</td>
                  <td>Kotanart</td>
                  <td className="highlight">Thu 13 Feb</td>
                  <td>095-xxx-xxxx</td>
                </tr>
              </tbody>
            </table>
            <button className="manage-booking" onClick={handleManageBooking}>
              + Manage booking
            </button>
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
  obj: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      title: PropTypes.string.isRequired,
      content: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default Dashboard;
