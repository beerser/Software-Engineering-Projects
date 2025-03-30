import React, { useState, useEffect } from "react";
import Footer from "../components/footer";
import "../css/Roombooking.css";
import axios from "axios";
import { useAuth } from "../components/AuthContext";
import auImage from "../assets/au.jpg";
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
  const [showModal, setShowModal] = useState(false);
  const [nextPaymentDate, setNextPaymentDate] = useState(null); // State for next payment date

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

  const genQR = async () => {
    const amount = parseFloat(item.price);

    if (isNaN(amount) || amount <= 0) {
      setError("Invalid amount");
      return;
    }

    try {
      const response = await axios.post("http://localhost:5001/generateQR", {
        amount: amount,
        phone: "0969962367",
      });

      if (response.data.RespCode === 200) {
        setQrCodeUrl(response.data.Result);
        setError("");
        setIsConfirmed(true); // ตั้งค่าเป็นยืนยันแล้ว
      } else {
        setError(response.data.RespMessage || "Failed to generate QR code");
      }
    } catch (err) {
      setError(err.message || "Failed to generate QR code");
      console.error("Request Error:", err);
    }
  };

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

  // ฟังก์ชันคำนวณวันที่ชำระเงินถัดไป
  const calculateNextPaymentDate = (date) => {
    const currentDate = new Date(date);
    currentDate.setMonth(currentDate.getMonth() + 1); // เพิ่มเดือน 1
    currentDate.setDate(1); // ตั้งวันเป็นวันที่ 1 ของเดือนถัดไป
    return currentDate;
  };

  // เมื่อคลิกที่ "Next pay At"
  const handleNextPaymentClick = (reservationDate) => {
    const nextDate = calculateNextPaymentDate(reservationDate);
    setNextPaymentDate(nextDate);
    setShowModal(true); // เปิด Modal
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
                    <p
                      style={getPaymentStatusColor(reservation.payment_status)}
                    >
                      Payment Status: {reservation.payment_status}
                    </p>
                    <p className="ur">
                      Created At:{" "}
                      {new Date(reservation.created_at).toLocaleDateString()}
                    </p>
                    <a
                      className="urll"
                      onClick={() => {
                        handleNextPaymentClick(reservation.created_at);
                        genQR();
                      }}
                    >
                      Next pay At:{" "}
                      {new Date(reservation.created_at).toLocaleDateString()}
                    </a>
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

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
          <img src={auImage} alt="" />
            <button onClick={() => setShowModal(false)}>Close</button>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
};

export default Roombooking;
