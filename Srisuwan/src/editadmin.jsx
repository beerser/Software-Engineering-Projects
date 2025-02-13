import React from "react";
import PropTypes from "prop-types"; // Import PropTypes
import "./editadmin.css";

const Dashboard = ({ obj }) => { // Receive obj via props
  const handleManageBooking = () => {
    // Handle manage booking functionality
    console.log("Managing booking...");
  };

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
          <a href="/login" className="logout">Logout</a>
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
            <button className="manage-booking" onClick={handleManageBooking}>+ Manage booking</button>
          </div>
          <div className="available-room-card">
            <h3>Available rooms</h3>
            <div className="room-list">
              {obj.map((room) => (
                <div key={room.id} className="room-item"> {/* Use room.id as key */}
                  <h4>{room.title}</h4>
                  <p>{room.content}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

Dashboard.propTypes = {
  obj: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired, // Ensure id exists for each room
      title: PropTypes.string.isRequired,
      content: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default Dashboard;
