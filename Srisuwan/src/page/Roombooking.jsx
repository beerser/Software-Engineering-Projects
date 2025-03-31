import React, { useState, useEffect } from "react";
import Footer from "../components/footer";
import "../css/Roombooking.css";
import axios from "axios";
import { useAuth } from "../components/AuthContext";

const Roombooking = () => {
  const { user } = useAuth();
  const [reservations, setReservations] = useState([]);
  const [notifications, setNotifications] = useState([]); // Initialize missing state
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
  const [selectedBooking, setSelectedBooking] = useState(null); // Declare selectedBooking state

  useEffect(() => {
    if (user) {
      fetchReservations();
      fetchNotifications(); // Call the fetchNoti function with a renamed function
    }
  }, [user]); // Only re-fetch when user changes

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

  // Renamed from fetchNoti to be more descriptive
  const fetchNotifications = async () => {
    try {
      const response = await fetch("http://localhost:5001/api/collection");
      if (!response.ok) {
        throw new Error("Unable to fetch notifications");
      }
      const data = await response.json();

      // Filter notifications by user
      const filteredNotifications = data.filter(
        (notification) =>
          notification.user_firstname === user?.firstname &&
          notification.user_lastname === user?.lastname
      );

      // สร้าง URL สำหรับรูปภาพจาก invoice_filename
      const notificationsWithImage = filteredNotifications.map(notification => ({
        ...notification,
        imageUrl: `http://localhost:5001/rentalInvoices/${notification.invoice_filename}`  // ใช้ URL ที่ชี้ไปที่โฟลเดอร์ rentalInvoices
      }));

      setNotifications(notificationsWithImage);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  // Generate QR code from API
  const genQR = async (reservationId, amount) => {
    setIsLoadingQR(true);
    try {
      // Create payload for API
      const payload = {
        reservationId: reservationId || "default",
        amount: amount || 5000, // Default amount if not specified
        description: `Room payment - ${user?.firstname} ${user?.lastname}`,
      };

      // Call API to generate QR code
      const response = await axios.post(
        "http://localhost:5001/api/payments/generate-qr",
        payload
      );

      // API should return QR code image URL
      if (response.data && response.data.qrCodeUrl) {
        setQrCode(response.data.qrCodeUrl);
        console.log("QR code generated:", response.data.qrCodeUrl);
      } else {
        console.error("Invalid QR code response:", response.data);
        // Use public API as fallback to create a simple QR code
        setQrCode(
          `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=payment_${reservationId}_${amount}`
        );
      }
    } catch (error) {
      console.error("Error generating QR code:", error);
      // Use public API as fallback to create a simple QR code
      setQrCode(
        `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=fallback_payment`
      );
    } finally {
      setIsLoadingQR(false);
    }
  };

  const renderNotificationContent = () => {
    if (notifications.length === 0) {
      return <p>No new notifications.</p>;
    }
  
    return notifications.map((notification) => (
      <div key={notification._id} className="notification-card">
        <div className="notification-header">
          <h3 className="notification-title">
            {notification.room_number}
          </h3>
        </div>
        <div className="notification-body">
          <p>{notification.message}</p>
          {/* Show image if available */}
          {notification.imageUrl && (
            <img
              src={notification.imageUrl}
              alt={notification.room_number}
              className="notification-image"
            />
          )}
        </div>
      </div>
    ));
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
    // Reset user data to original values
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

  // Calculate next payment date
  const calculateNextPaymentDate = (date) => {
    const currentDate = new Date(date);
    currentDate.setMonth(currentDate.getMonth() + 1);
    currentDate.setDate(1);
    return currentDate;
  };

  const handleNextPaymentClick = (reservation) => {
    const nextDate = calculateNextPaymentDate(reservation.created_at);
    setNextPaymentDate(nextDate);

    // Call API to generate QR code for payment
    // Send reservation ID and amount (if available)
    genQR(reservation._id, reservation.room_price || 5000);

    setShowModal(true);
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
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
                  <p>
                    No bookings found. Book a room to see your reservations
                    here.
                  </p>
                </div>
              ) : (
                reservations.map((reservation) => (
                  <div key={reservation._id} className="reservation-card">
                    <div className="reservation-header">
                      <h3 className="room-number">{reservation.room_number}</h3>
                      <span
                        className={getPaymentStatusBadge(
                          reservation.payment_status
                        )}
                      >
                        {reservation.payment_status}
                      </span>
                    </div>
                    <div className="reservation-details">
                      <div className="detail-item">
                        <span className="detail-label">Booked On:</span>
                        <span className="detail-value">
                          {formatDate(reservation.created_at)}
                        </span>
                      </div>
                      <div className="detail-item payment-link">
                        <span className="detail-label">Next Payment:</span>
                        <button
                          className="next-payment-btn"
                          onClick={() => handleNextPaymentClick(reservation)}
                        >
                          {formatDate(
                            calculateNextPaymentDate(reservation.created_at)
                          )}
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
                    ) : (
                      <p className="profile-value">
                        {user.firstname} {user.lastname}
                      </p>
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
              {renderNotificationContent()}
            </div>
          </section>
        );
      default:
        return <p>Select a page from the sidebar</p>;
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
              className={`sidebar-item ${
                activePage === "allroomreservations" ? "active" : ""
              }`}
            >
              All Room Reservations
            </li>
            <li
              onClick={() => setActivePage("personalinformations")}
              className={`sidebar-item ${
                activePage === "personalinformations" ? "active" : ""
              }`}
            >
              Personal Information
            </li>
            <li
              onClick={() => setActivePage("notification")}
              className={`sidebar-item ${
                activePage === "notification" ? "active" : ""
              }`}
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
              <button className="close-btn" onClick={() => setShowModal(false)}>
                ×
              </button>
            </div>
            <div className="modal-body">
              <p className="payment-date">
                Next payment due: {formatDate(nextPaymentDate)}
              </p>
              <div className="qr-container">
                {isLoadingQR ? (
                  <div className="loading-qr">
                    <p>Loading QR code...</p>
                  </div>
                ) : qrCode ? (
                  <img
                    src={qrCode}
                    alt="Payment QR Code"
                    className="qr-image"
                    style={{
                      maxWidth: "250px",
                      height: "auto",
                      display: "block",
                      margin: "0 auto",
                      border: "1px solid #ddd",
                      borderRadius: "4px",
                      padding: "5px",
                    }}
                  />
                ) : (
                  <p>Cannot generate QR code. Please try again.</p>
                )}
              </div>
              <p className="payment-instructions">
                Scan with your banking app to make payment
              </p>
            </div>
            <div className="modal-footer">
              <button
                className="close-modal-btn"
                onClick={() => setShowModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
};

export default Roombooking;
