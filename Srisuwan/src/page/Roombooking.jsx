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
  const [showModal, setShowModal] = useState(false);
  const [nextPaymentDate, setNextPaymentDate] = useState(null);
  const [qrCode, setQrCode] = useState(null);
  const [isLoadingQR, setIsLoadingQR] = useState(false);
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const res = await fetch("http://localhost:5001/api/bookings");
        const data = await res.json();

        // Filter reservations for current user
        const filteredReservations = data.filter(
          (reservation) =>
            reservation.user_firstname === user?.firstname &&
            reservation.user_lastname === user?.lastname
        );
        setReservations(filteredReservations);
      } catch (error) {
        console.error("Error fetching reservations:", error);
      }
    };

    if (user) {
      fetchReservations();
    }
  }, [user]);

  // ฟังก์ชันสร้าง QR code จาก API
  const genQR = async (reservationId, amount) => {
    setIsLoadingQR(true);
    try {
      // สร้าง payload สำหรับส่งไปยัง API
      const payload = {
        reservationId: reservationId || "default",
        amount: amount || 5000, // จำนวนเงินเริ่มต้น หากไม่มีการระบุ
        description: `Room payment - ${user?.firstname} ${user?.lastname}`,
      };

      // เรียกใช้ API เพื่อสร้าง QR code
      const response = await axios.post(
        "http://localhost:5001/api/payments/generate-qr",
        payload
      );

      // API ควรส่งข้อมูล URL ของรูปภาพ QR code กลับมา
      if (response.data && response.data.qrCodeUrl) {
        setQrCode(response.data.qrCodeUrl);
        console.log("QR code generated:", response.data.qrCodeUrl);
      } else {
        console.error("Invalid QR code response:", response.data);
        // ใช้ API สาธารณะเป็น fallback เพื่อสร้าง QR code ง่ายๆ
        setQrCode(`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=payment_${reservationId}_${amount}`);
      }
    } catch (error) {
      console.error("Error generating QR code:", error);
      // ใช้ API สาธารณะเป็น fallback เพื่อสร้าง QR code ง่ายๆ
      setQrCode(`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=fallback_payment`);
    } finally {
      setIsLoadingQR(false);
    }
  };

  const showErrorMessage = (message) => {
    console.error(message);
    // คุณสามารถใช้ toast หรือ alert ตรงนี้
  };

  const getPaymentStatusColor = (status) => {
    if (status === "pending") {
      return { color: "#f44336", fontWeight: "bold" };
    } else if (status === "confirmed") {
      return { color: "#4CAF50", fontWeight: "bold" };
    } else {
      return { color: "#757575" };
    }
  };

  const getPaymentStatusBadge = (status) => {
    let badgeClass = "status-badge ";
    if (status === "pending") {
      badgeClass += "pending";
    } else if (status === "confirmed") {
      badgeClass += "confirmed";
    } else {
      badgeClass += "other";
    }
    return badgeClass;
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const fetchnotification = async () => {
    try {
      const response = await fetch("http://localhost:5001/api/collection");
      if (!response.ok) {
        throw new Error("Unable to fetch bookings");
      }
      const data = await response.json();
      setBookings(data);
    } catch (error) {
      console.error("Error fetching bookings:", error);
      showErrorMessage("ไม่สามารถดึงข้อมูลการจองได้");
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
    // คืนค่าข้อมูลผู้ใช้เป็นค่าเดิม
    setUserData({
      firstname: user ? user.firstname : "",
      lastname: user ? user.lastname : "",
      email: user ? user.email : "",
      phoneNumber: user ? user.phoneNumber : "",
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  // คำนวณวันที่ชำระเงินครั้งถัดไป
  const calculateNextPaymentDate = (date) => {
    const currentDate = new Date(date);
    currentDate.setMonth(currentDate.getMonth() + 1);
    currentDate.setDate(1);
    return currentDate;
  };

  // จัดการคลิกปุ่มชำระเงินครั้งถัดไป
  const handleNextPaymentClick = (reservation) => {
    const nextDate = calculateNextPaymentDate(reservation.created_at);
    setNextPaymentDate(nextDate);
    
    // เรียกใช้ API เพื่อสร้าง QR code สำหรับการชำระเงิน
    // ส่ง ID ของการจองและจำนวนเงินไปด้วย (ถ้ามี)
    genQR(reservation._id, reservation.room_price || 5000);
    
    setShowModal(true);
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const renderContent = () => {
    switch (activePage) {
      case "allroomreservations":
        return (
          <section className="info-section">
            <h2 className="section-title">All Room Reservations</h2>
            <div className="reservation-list">
              {reservations.length === 0 ? (
                <div className="no-reservations">
                  <p>No bookings found. Book a room to see your reservations here.</p>
                </div>
              ) : (
                reservations.map((reservation) => (
                  <div key={reservation._id} className="reservation-card">
                    <div className="reservation-header">
                      <h3 className="room-number">{reservation.room_number}</h3>
                      <span className={getPaymentStatusBadge(reservation.payment_status)}>
                        {reservation.payment_status}
                      </span>
                    </div>
                    <div className="reservation-details">
                      <div className="detail-item">
                        <span className="detail-label">Booked On:</span>
                        <span className="detail-value">{formatDate(reservation.created_at)}</span>
                      </div>
                      <div className="detail-item payment-link">
                        <span className="detail-label">Next Payment:</span>
                        <button 
                          className="next-payment-btn"
                          onClick={() => handleNextPaymentClick(reservation)}
                        >
                          {formatDate(calculateNextPaymentDate(reservation.created_at))}
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>
        );
      case "personalinformations":
        if (user) {
          return (
            <section className="info-section">
              <h2 className="section-title">Personal Information</h2>
              <div className="profile-card">
                <div className="profile-item">
                  <h3 className="profile-label">Username</h3>
                  <div className="username-main-card">
                  {isEditing ? (
                    <div className="edit-fields">
                      <input
                        type="text"
                        name="firstname"
                        value={userData.firstname || ""}
                        onChange={handleChange}
                        placeholder="First Name"
                        className="edit-input"
                      />
                      <input
                        type="text"
                        name="lastname"
                        value={userData.lastname || ""}
                        onChange={handleChange}
                        placeholder="Last Name"
                        className="edit-input"
                      />
                    </div>
                  ) : 
                  (
                    <p className="profile-value">{user.firstname} {user.lastname}</p>
                  )}
                  <div className="action-buttons">
                    {isEditing ? (
                      <>
                        <button className="cancel-btn" onClick={handleCancel}>
                          Cancel
                        </button>
                        <button className="confirm-btn" onClick={handleSave}>
                          Save
                        </button>
                      </>
                    ) : (
                      <button className="edit-btn" onClick={handleEditClick}>
                        Edit Profile
                      </button>
                    )}
                  </div>
                  </div>
                </div>

                <div className="profile-item">
                  <h3 className="profile-label">Email</h3>
                  <p className="profile-value">{user.email}</p>
                </div>

                <div className="profile-item">
                  <h3 className="profile-label">Phone Number</h3>
                  <p className="profile-value">{user.phoneNumber}</p>
                </div>
              </div>
            </section>
          );
        } else {
          return (
            <div className="loading-container">
              <p>Loading user information...</p>
            </div>
          );
        }
      case "notification":
        return (
          <section className="info-section">
            <h2 className="section-title">Notifications</h2>
            <div className="notification-list">
              <p>No new notifications</p>
            </div>
          </section>
        );
      default:
        return <p>notification</p>;
    }
  };

  return (
    <>
      <div className="dashboard-containerr">
        <aside className="dashboard-sidebar">
          <div className="sidebar-header">
            <h2>My Account</h2>
          </div>
          <ul className="sidebar-menu">
            <li
              onClick={() => setActivePage("allroomreservations")}
              className={`sidebar-item ${activePage === "allroomreservations" ? "active" : ""}`}
            >
              All Room Reservations
            </li>
            <li
              onClick={() => setActivePage("personalinformations")}
              className={`sidebar-item ${activePage === "personalinformations" ? "active" : ""}`}
            >
              Personal Information
            </li>
            <li
              onClick={() => setActivePage("notification")}
              className={`sidebar-item ${activePage === "notification" ? "active" : ""}`}
            >
              Notification
            </li>
          </ul>
        </aside>

        <main className="dashboard-content">{renderContent()}</main>
      </div>

      {/* QR Code Payment Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Payment Information</h2>
              <button className="close-btn" onClick={() => setShowModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <p className="payment-date">Next payment due: {formatDate(nextPaymentDate)}</p>
              <div className="qr-container">
                {isLoadingQR ? (
                  <div className="loading-qr">
                    <p>กำลังโหลด QR code...</p>
                  </div>
                ) : qrCode ? (
                  <img 
                    src={qrCode} 
                    alt="Payment QR Code" 
                    className="qr-image" 
                    style={{ 
                      maxWidth: '250px', 
                      height: 'auto', 
                      display: 'block', 
                      margin: '0 auto',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      padding: '5px'
                    }} 
                  />
                ) : (
                  <p>ไม่สามารถสร้าง QR code ได้ กรุณาลองอีกครั้ง</p>
                )}
              </div>
              <p className="payment-instructions">สแกนด้วยแอพธนาคารของคุณเพื่อชำระเงิน</p>
            </div>
            <div className="modal-footer">
              <button className="close-modal-btn" onClick={() => setShowModal(false)}>ปิด</button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
};

export default Roombooking;