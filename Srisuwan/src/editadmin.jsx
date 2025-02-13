import React from "react";
import "./editadmin.css";
const Dashboard = () => {
  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <h2>SRISUWAN</h2>
        <ul>
          <li>Dashboard</li>
          <li>Manage room</li>
          <li>Manage payment</li>
          <li>Manage booking</li>
        </ul>
      </aside>
      <main className="main-content">
        <header className="top-bar">
          <a href="#" className="logout">Logout</a>
        </header>
        <section className="content">
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
            <button className="manage-booking">+ Manage booking</button>
          </div>
          <div className="available-room-card">
            <h3>Available room</h3>
            <p className="room-count">10 room</p>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
