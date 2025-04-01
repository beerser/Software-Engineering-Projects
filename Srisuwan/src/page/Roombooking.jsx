import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom"; // Added missing import
import Footer from "../components/footer";
import "../css/Roombooking.css";
import axios from "axios";
import { useAuth } from "../components/AuthContext";
import promptbit from "../assets/prompt-bid-by-srisuwan.png";


// Configuration object for API endpoints - Fixed for Vite
const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || "http://localhost:5001",
  get BOOKINGS_URL() { return `${this.BASE_URL}/api/bookings` },
  get NOTIFICATIONS_URL() { return `${this.BASE_URL}/api/collection` },
  get USER_UPDATE_URL() { return `${this.BASE_URL}/api/user/update` },
  get GENERATE_QR_URL() { return `${this.BASE_URL}/api/payments/generate-qr` },
  get INVOICE_URL() { return `${this.BASE_URL}/rentalInvoices` }
};

// Modified NotificationCard Component to download PDFs instead of displaying them
const NotificationCard = ({ notification }) => {
  // Function to handle PDF download
  const handleDownloadPDF = () => {
    // Create a temporary anchor element
    const link = document.createElement('a');
    link.href = notification.imageUrl;
    link.download = notification.invoice_filename || `invoice-${notification.room_number}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };



  return (
    <div className="notification-card">
      <div className="notification-header">
        <h3 className="notification-title">{notification.room_number}</h3>
      </div>
      <div className="notification-body">
        <p>{notification.message}</p>
        {notification.isPdf ? (
          <div className="pdf-download-container">
            <h4>ใบเสร็จ PDF</h4>
            <button 
              onClick={handleDownloadPDF}
              className="download-pdf-btn"
            >
              ดาวน์โหลด PDF
            </button>
          </div>
        ) : (
          <img
            src={notification.imageUrl}
            alt={notification.room_number}
            className="notification-image"
          />
        )}
      </div>
    </div>
  );
};


const handleUploadClick = () => {
  navigate("/upload", { state: { item: item } });
};

// Reservation Card Component (unchanged)
const ReservationCard = ({ reservation, onPaymentClick, formatDate, calculateNextPaymentDate, getPaymentStatusBadge }) => (
  <div className="reservation-card">
    <div className="reservation-header">
      <h3 className="room-number">{reservation.room_number}</h3>
      <span className={getPaymentStatusBadge(reservation.payment_status)}>
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
          onClick={() => onPaymentClick(reservation)}
        >
          {formatDate(calculateNextPaymentDate(reservation.created_at))}
        </button>
      </div>
    </div>
  </div>
);

// Payment Modal Component (unchanged)
const PaymentModal = ({ nextPaymentDate, formatDate, qrCode, isLoadingQR, onClose }) => (
  <div className="modal-overlay">
    <div className="modal-content-on-room-booking-page">
      <div className="modal-header">
        <h2>Payment Information</h2>
        <button className="close-btn-on-room-booking" onClick={onClose}>×</button>
      </div>
      <div className="modal-body">
        <p className="payment-date">
          Next payment due: {formatDate(nextPaymentDate)}
        </p>
        <img 
          src={promptbit} 
          alt="prompt-bit" 
          className="prompt-bit-image" 
        />
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
          
        <div className='uploade-slip-payment-card'>
            <p className='warning-text-uploade'>‼️ Don’t forget to send your payment slip.</p>
            <hr />
            <div className='main-upload-and-warning'>
              <p>If it is verified that the
                <span className='blue-text'> payment slip is not genuine </span>
                or 
                <span className='blue-text'> has been altered</span>
                , we will cancel the check-in immediately</p>
              <button onClick={handleUploadClick} className="upload">Upload payment receipt</button>
            </div>
          </div>
      </div>
      <div className="modal-footer">
        <button className="close-modal-btn" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  </div>
);

// Profile Edit Form Component (unchanged)
const ProfileEditForm = ({ userData, onSave, onCancel, onChange }) => (
  <div className="edit-fields">
    <input
      type="text"
      name="firstname"
      value={userData.firstname || ""}
      onChange={onChange}
      placeholder="First Name"
      className="edit-input"
    />
    <input
      type="text"
      name="lastname"
      value={userData.lastname || ""}
      onChange={onChange}
      placeholder="Last Name"
      className="edit-input"
    />
    <div className="action-buttons-submit-on-room-booking">
      <button className="cancel-btn" onClick={onCancel}>Cancel</button>
      <button className="confirm-btn" onClick={onSave}>Save</button>
    </div>
  </div>
);

// Define missing components mentioned in renderContent
const RoomReservations = ({ reservations, error, formatDate, calculateNextPaymentDate, getPaymentStatusBadge, handlePaymentClick }) => (
  <section className="info-section">
    <h2 className="section-title">All Room Reservations</h2>
    {error && <div className="error-message">{error}</div>}
    <div className="reservation-list">
      {reservations?.length === 0 ? (
        <div className="no-reservations">
          <p>No bookings found. Book a room to see your reservations here.</p>
        </div>
      ) : (
        reservations?.map((reservation) => (
          <ReservationCard
            key={reservation._id}
            reservation={reservation}
            onPaymentClick={handlePaymentClick}
            formatDate={formatDate}
            calculateNextPaymentDate={calculateNextPaymentDate}
            getPaymentStatusBadge={getPaymentStatusBadge}
          />
        ))
      )}
    </div>
  </section>
);

const PersonalInformation = ({ user, userData, isEditing, error, handleEditProfile, handleSaveProfile, handleCancelEdit, handleInputChange }) => (
  <section className="info-section">
    <h2 className="section-title">Personal Information</h2>
    {error && <div className="error-message">{error}</div>}
    <div className="profile-card">
      <div className="profile-item">
        <h3 className="profile-label">Username</h3>
        <div className="username-main-card">
          {isEditing ? (
            <ProfileEditForm
              userData={userData}
              onSave={handleSaveProfile}
              onCancel={handleCancelEdit}
              onChange={handleInputChange}
            />
          ) : (
            <>
              <p className="profile-value">
                {user?.firstname} {user?.lastname}
              </p>
              <div className="action-buttons-edit-on-room-booking">
                <button className="edit-btn" onClick={handleEditProfile}>
                  Edit Profile
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="profile-item">
        <h3 className="profile-label">Email</h3>
        <p className="profile-value">{user?.email}</p>
      </div>

      <div className="profile-item">
        <h3 className="profile-label">Phone Number</h3>
        <p className="profile-value">{user?.phoneNumber}</p>
      </div>
    </div>
  </section>
);

const Notification = ({ notifications, error }) => (
  <section className="info-section">
    <h2 className="section-title">Notifications</h2>
    {error && <div className="error-message">{error}</div>}
    <div className="notification-list">
      {notifications?.length === 0 ? (
        <p>No new notifications.</p>
      ) : (
        notifications?.map((notification) => (
          <NotificationCard 
            key={notification._id} 
            notification={notification} 
          />
        ))
      )}
    </div>
  </section>
);


// Main Roombooking Component
const Roombooking = () => {
  const { user } = useAuth();
  const [reservations, setReservations] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [activePage, setActivePage] = useState("allroomreservations");
  const [userData, setUserData] = useState({
    firstname: user?.firstname || "",
    lastname: user?.lastname || "",
    email: user?.email || "",
    phoneNumber: user?.phoneNumber || ""
  });
  const [showModal, setShowModal] = useState(false);
  const [nextPaymentDate, setNextPaymentDate] = useState(null);
  const [qrCode, setQrCode] = useState(null);
  const [isLoadingQR, setIsLoadingQR] = useState(false);
  const [error, setError] = useState(null);
  const { pageName } = useParams();

  // Initialize user data when user changes
  useEffect(() => {
    if (user) {
      setUserData({
        firstname: user.firstname || "",
        lastname: user.lastname || "",
        email: user.email || "",
        phoneNumber: user.phoneNumber || ""
      });
    }
  }, [user]);

  // Fetch data when user changes
  useEffect(() => {
    if (user) {
      fetchReservations();
      fetchNotifications();
    }
  }, [user]);

  // Memoized user filter for reservations
  const userFilter = useCallback((item) => {
    return item.user_firstname === user?.firstname && 
           item.user_lastname === user?.lastname;
  }, [user?.firstname, user?.lastname]);

  // Fetch reservations with error handling
  const fetchReservations = async () => {
    try {
      const res = await fetch(API_CONFIG.BOOKINGS_URL);
      if (!res.ok) {
        throw new Error(`HTTP error ${res.status}`);
      }
      const data = await res.json();
      const filteredReservations = data.filter(userFilter);
      setReservations(filteredReservations);
      setError(null);
    } catch (error) {
      console.error("Error fetching reservations:", error);
      setError("Unable to load your reservations. Please try again later.");
    }
  };

  // Fetch notifications with error handling
  const fetchNotifications = async () => {
    try {
      const response = await fetch(API_CONFIG.NOTIFICATIONS_URL);
      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }
      const data = await response.json();
      const filteredNotifications = data.filter(userFilter);

      const notificationsWithImage = filteredNotifications.map(notification => ({
        ...notification,
        imageUrl: `${API_CONFIG.INVOICE_URL}/${notification.invoice_filename}`,
        isPdf: notification.invoice_filename?.endsWith('.pdf') || false,
      }));
      
      setNotifications(notificationsWithImage);
      setError(null);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      
    }
  };

  // Generate QR code with more secure fallback
  const generateQRCode = async (reservationId, amount) => {
    setIsLoadingQR(true);
    try {
      const payload = {
        reservationId: reservationId || "default",
        amount: amount || 5000,
        description: `Room payment - ${user?.firstname} ${user?.lastname}`,
      };

      const response = await axios.post(API_CONFIG.GENERATE_QR_URL, payload);

      if (response.data && response.data.qrCodeUrl) {
        setQrCode(response.data.qrCodeUrl);
      } else {
        throw new Error("Invalid QR code response");
      }
    } catch (error) {
      console.error("Error generating QR code:", error);
      // More secure fallback that doesn't expose payment details in URL
      setQrCode(
        `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=payment_reference_required`
      );
    
    } finally {
      setIsLoadingQR(false);
    }
  };

  // Format date for display
  const formatDate = useCallback((dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  }, []);

  // Calculate next payment date
  const calculateNextPaymentDate = useCallback((date) => {
    const currentDate = new Date(date);
    currentDate.setMonth(currentDate.getMonth() + 1);
    currentDate.setDate(1);
    return currentDate;
  }, []);

  // Get payment status badge class
  const getPaymentStatusBadge = useCallback((status) => {
    let badgeClass = "status-badge ";
    if (status === "pending") {
      badgeClass += "pending";
    } else if (status === "confirmed") {
      badgeClass += "confirmed";
    } else {
      badgeClass += "other";
    }
    return badgeClass;
  }, []);

  // Handle user profile edit
  const handleEditProfile = () => {
    setIsEditing(true);
  };

  // Handle saving profile changes
  const handleSaveProfile = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Authentication required. Please log in again.");
      return;
    }

    try {
      const response = await axios.put(
        API_CONFIG.USER_UPDATE_URL,
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
      setError(null);
    } catch (error) {
      console.error("Error updating user:", error);
      setError("Failed to update profile. Please try again.");
    }
  };

  // Handle cancel profile editing
  const handleCancelEdit = () => {
    setIsEditing(false);
    setUserData({
      firstname: user?.firstname || "",
      lastname: user?.lastname || "",
      email: user?.email || "",
      phoneNumber: user?.phoneNumber || "",
    });
  };
  const navigate = useNavigate(); 
  // Handle form field changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData(prev => ({ ...prev, [name]: value }));
  };

  // Handle payment button click
  const handlePaymentClick = (reservation) => {
    const nextDate = calculateNextPaymentDate(reservation.created_at);
    setNextPaymentDate(nextDate);
    generateQRCode(reservation._id, reservation.room_price || 5000);
    setShowModal(true);
  };

  // Close payment modal
  const handleCloseModal = () => {
    setShowModal(false);
    setQrCode(null);
  };


  const handlePageChange = (pageName) => {
    navigate(`/information/${pageName}`);
  };

  // Render content based on active page
  const renderContent = () => {
    const currentPage = pageName || activePage;
    
    switch (currentPage) {
      case "allroomreservations":
        return (
          <RoomReservations 
            reservations={reservations} 
            error={error} 
            formatDate={formatDate} 
            calculateNextPaymentDate={calculateNextPaymentDate} 
            getPaymentStatusBadge={getPaymentStatusBadge} 
            handlePaymentClick={handlePaymentClick}
          />
        );
      case "personalinformations":
        return (
          <PersonalInformation 
            user={user} 
            userData={userData} 
            isEditing={isEditing} 
            error={error} 
            handleEditProfile={handleEditProfile} 
            handleSaveProfile={handleSaveProfile} 
            handleCancelEdit={handleCancelEdit} 
            handleInputChange={handleInputChange}
          />
        );
      case "notification":
        return <Notification notifications={notifications} error={error} />;
      default:
        return <RoomReservations 
          reservations={reservations} 
          error={error} 
          formatDate={formatDate} 
          calculateNextPaymentDate={calculateNextPaymentDate} 
          getPaymentStatusBadge={getPaymentStatusBadge} 
          handlePaymentClick={handlePaymentClick}
        />;
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
    onClick={() => handlePageChange("allroomreservations")}
    className={`sidebar-item ${pageName  === "allroomreservations" ? "active" : ""}`}
  >
    All Room Reservations
  </li>
  <li
    onClick={() => handlePageChange("personalinformations")}
    className={`sidebar-item ${pageName === "personalinformations" ? "active" : ""}`}
  >
    Personal Information
  </li>
  <li
    onClick={() => handlePageChange("notification")}
    className={`sidebar-item ${pageName  === "notification" ? "active" : ""}`}
  >
    Notification
  </li>
</ul>
        </aside>

        <main className="dashboard-content">{renderContent()}</main>
      </div>

      {/* QR Code Payment Modal */}
      {showModal && (
        <PaymentModal
          nextPaymentDate={nextPaymentDate}
          formatDate={formatDate}
          qrCode={qrCode}
          isLoadingQR={isLoadingQR}
          onClose={handleCloseModal}
        />
      )}

      <Footer />
    </>
  );
};

export default Roombooking;