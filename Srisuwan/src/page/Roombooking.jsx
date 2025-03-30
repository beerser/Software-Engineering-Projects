import React, { useState, useEffect } from "react";
import Footer from "../components/footer";
import "../css/Roombooking.css";
import axios from "axios";
import { useAuth } from "../components/AuthContext";

const Roombooking = () => {
  const { user } = useAuth();
  const [reservations, setReservations] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [activePage, setActivePage] = useState("allroomreservations");
  const [userData, setUserData] = useState({
    firstname: user ? user.firstname : "",
    lastname: user ? user.lastname : "",
    email: user ? user.email : "",
    phoneNumber: user ? user.phoneNumber : "",
  });

  const items = document.querySelectorAll(".sidebare-item");

  items.forEach((item) => {
    item.addEventListener("click", () => {
      // เอา active ออกจากทุกอันก่อน
      items.forEach((i) => i.classList.remove("active"));
      // ใส่ active ให้ตัวที่คลิก
      item.classList.add("active");
    });
  });

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const res = await fetch("http://localhost:5001/api/bookings"); // เปลี่ยน URL ที่ดึงข้อมูลการจอง
        const data = await res.json();
        console.log("Reservation Data:", data);

        // กรองข้อมูลที่ payment_status คือ "pending"
        const filteredReservations = data.filter(
          (reservation) =>
            reservation.user_firstname === user?.firstname &&
            reservation.user_lastname === user?.lastname
        );
        setReservations(filteredReservations); // เก็บข้อมูลที่กรองแล้ว
      } catch (error) {
        console.error("Error fetching reservations:", error);
      }
    };

    fetchReservations();
  }, [user]); // แค่โหลดข้อมูลครั้งเดียวเมื่อโหลดหน้า

  useEffect(() => {
    if (user) {
      setUserData({
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        phoneNumber: user.phoneNumber,
      });
    }
  }, [user]);

  const handleEditClick = () => {
    setIsEditing(true);
  };


  const getPaymentStatusColor = (status) => {
    if (status === "pending") {
      return { color: "red" }; 
    } else if (status === "confirmed") {
      return { color: "green" }; 
    } else {
      return { color: "gray" };  
    }
  };
  const handleSave = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      console.log("Token not found!");
      return;
    }

    try {
      const response = await axios.put(
        "http://localhost:5001/api/user/update",
        {
          firstname: userData.firstname,
          lastname: userData.lastname,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("User updated:", response.data);
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const renderContent = () => {
    switch (activePage) {
      case "allroomreservations":
        return (
          <section className="info-item-rooms">
            <p>All Room Reservations</p>
            <div>
              {reservations.length === 0 ? (
                <p>No bookings found.</p>
              ) : (
                reservations.map((reservation) => (
                  <div key={reservation._id} className="info-item-users">
                    <p className="ur">Room Number: {reservation.room_number}</p>
                    <p style={getPaymentStatusColor(reservation.payment_status)}>Payment Status: {reservation.payment_status}</p>
                    <p className="ur">
                      Created At:{" "}
                      {new Date(reservation.created_at).toLocaleDateString()}
                    </p>
                  </div>
                ))
              )}
            </div>
          </section>
        );
      case "personalinformations":
        if (user) {
          return (
            <section className="personal-info">
              <div className="info-item-users">
                <div className="user-info">
                  <p className="userr">Username</p>
                  {isEditing ? (
                    <div className="userrrr">
                      <input
                        type="text"
                        name="firstname"
                        value={userData.firstname || ""}
                        onChange={handleChange}
                        placeholder="First Name"
                      />
                      <input
                        type="text"
                        name="lastname"
                        value={userData.lastname || ""}
                        onChange={handleChange}
                        placeholder="Last Name"
                      />
                    </div>
                  ) : (
                    <p>
                      {userData.firstname} {userData.lastname}
                    </p>
                  )}
                </div>
                <div className="bttcontir">
                  {isEditing ? (
                    <div className="btcontir">
                      <button className="cancel-btn" onClick={handleCancel}>
                        Cancel
                      </button>
                      <button className="confirm-btn" onClick={handleSave}>
                        Confirm
                      </button>
                    </div>
                  ) : (
                    <button className="edit-btn" onClick={handleEditClick}>
                      Edit
                    </button>
                  )}
                </div>
              </div>
              <div className="info-item-user">
                <p className="userrr">Email</p>
                <p className="userrrr">{user.email}</p>
              </div>
              <div className="info-item-user">
                <p className="userrr">Phone number</p>
                <p className="userrrr">{user.phoneNumber}</p>
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
      <div className="containere">
        <aside className="sidebare">
          <ul>
            <li
              onClick={() => setActivePage("allroomreservations")}
              className="sidebare-item"
            >
              All Room Reservations
            </li>
            <li
              onClick={() => setActivePage("personalinformations")}
              className="sidebare-item"
            >
              Personal Information
            </li>
          </ul>
        </aside>

        <main className="main-contente">{renderContent()}</main>
      </div>

      <Footer />
    </>
  );
};

export default Roombooking;
