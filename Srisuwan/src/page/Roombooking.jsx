import React, { useState } from "react";
import Footer from "../components/footer";
import "../css/Roombooking.css";
import Edit from "../assets/edit.svg";
import { useAuth } from "../components/AuthContext";

const Roombooking = () => {
  const { user } = useAuth();
  const [activePage, setActivePage] = useState("allroomreservations");

  const renderContent = () => {
    switch (activePage) {
      case "allroomreservations":
        return (
          <section className="room-reservations">
            <p>All room reservations</p>
          </section>
        );
      case "personalinformations":
        if (user) {
          return (
            <section className="personal-info">
              <div className="info-item-users">
                <div className="user-info">
                  <p className="userr">Username</p>
                  <p>
                    {user.firstname} {user.lastname}
                  </p>
                </div>
                <button className="edit-btn">Edit</button>
              </div>
              <div className="info-item-user">
                <p>Email</p>
                <p>{user.email}</p>
              </div>
              <div className="info-item-user">
                <p>Phone number</p>
                <p>{user.phoneNumber}</p>
              </div>
            </section>
          );
        } else {
          return <p>Loading...</p>;
        }
      default:
        return <p>Select a page from the menu.</p>;
    }
  };

  return (
    <>
      <div className="container">
        <aside className="sidebar">
          <ul>
            <li
              onClick={() => setActivePage("allroomreservations")}
              className="sidebar-item"
            >
              All Room Reservations
            </li>
            <li
              onClick={() => setActivePage("personalinformations")}
              className="sidebar-item"
            >
              Personal Information
            </li>
          </ul>
        </aside>

        <main className="main-content">{renderContent()}</main>
      </div>

      <Footer />
    </>
  );
};

export default Roombooking;
