import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import "../css/Wtf.css";

const BookingInvoiceUpload = () => {
  const { state } = useLocation();
  const [bookings, setBookings] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedBookings, setSelectedBookings] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [messageType, setMessageType] = useState("");
  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (selectedUser) {
      const userBookings = bookings.filter(
        (booking) =>
          (booking.user_id &&
            booking.user_id === selectedUser._id &&
            booking.payment_status === "confirmed") ||
          ((booking.user_firstname === selectedUser.firstname ||
            booking.first_name === selectedUser.firstname) &&
            (booking.user_lastname === selectedUser.lastname ||
              booking.last_name === selectedUser.lastname) &&
            booking.payment_status === "confirmed")
      );
      setSelectedBookings(userBookings);
    } else {
      setSelectedBookings([]);
    }
  }, [selectedUser, bookings]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      await Promise.all([fetchBookings(), fetchUsers()]);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchBookings = async () => {
    try {
      const response = await fetch("http://localhost:5001/api/bookings");
      if (!response.ok) throw new Error("Unable to fetch bookings");
      setBookings(await response.json());
    } catch (error) {
      console.error("Error fetching bookings:", error);
      showErrorMessage("ไม่สามารถดึงข้อมูลการจองได้");
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch("http://localhost:5001/api/user");
      if (!response.ok) throw new Error("Unable to fetch users");
      setUsers(await response.json());
    } catch (error) {
      console.error("Error fetching users:", error);
      showErrorMessage("ไม่สามารถดึงข้อมูลผู้ใช้ได้");
    }
  };

  const getUsersInConfirmedBookings = () => {
    return users.filter((user) =>
      bookings.some(
        (booking) =>
          (booking.user_id &&
            booking.user_id === user._id &&
            booking.payment_status === "confirmed") ||
          ((booking.user_firstname === user.firstname ||
            booking.first_name === user.firstname) &&
            (booking.user_lastname === user.lastname ||
              booking.last_name === user.lastname) &&
            booking.payment_status === "confirmed")
      )
    );
  };

  const handleUserSelect = (e) => {
    const user = users.find((u) => u._id === e.target.value);
    setSelectedUser(user || null);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setImageFile(file || null);
    
    // Create preview URL for images
    if (file && file.type.startsWith('image/')) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      
      // Clean up URL when component unmounts
      return () => URL.revokeObjectURL(url);
    } else {
      setPreviewUrl(null);
    }
  };

  const showSuccessMessage = (msg) => {
    setMessage(msg);
    setMessageType("success");
  };

  const showErrorMessage = (msg) => {
    setMessage(msg);
    setMessageType("error");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

    if (!imageFile) {
      showErrorMessage("กรุณาเลือกไฟล์ใบเสร็จก่อนส่ง");
      setIsLoading(false);
      return;
    }

    if (!selectedUser) {
      showErrorMessage("ไม่พบข้อมูลผู้ใช้ โปรดเลือกผู้ใช้ก่อน");
      setIsLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("invoice", imageFile);
    formData.append("user_firstname", selectedUser.firstname);
    formData.append("user_lastname", selectedUser.lastname);
    formData.append("room_number", selectedUser.roomNumber || "Not specified");

    try {
      const response = await fetch("http://localhost:5001/collection", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        showSuccessMessage("อัปโหลดไฟล์ใบเสร็จสำเร็จ!");
        // Clear form after successful upload
        setImageFile(null);
        setPreviewUrl(null);
        const fileInput = document.getElementById('file-input');
        if (fileInput) fileInput.value = '';
      } else {
        showErrorMessage(`เกิดข้อผิดพลาด: ${await response.text()}`);
      }
    } catch (error) {
      console.error("Upload error:", error);
      showErrorMessage(
        "เกิดข้อผิดพลาดในการเชื่อมต่อกับเซิร์ฟเวอร์ โปรดลองใหม่อีกครั้ง"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container-on-wtf-page">
      <div className="upload-card">
        <h2 className="title">ส่งใบแจ้งหนี้ให้กับผู้เช่า</h2>

        {isLoading && (
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>กำลังโหลดข้อมูล...</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="form-container-on-wtf-page">
          <div className="form-group-on-wtf-page">
            <label htmlFor="user-select">เลือกผู้ใช้</label>
            <select
              id="user-select"
              onChange={handleUserSelect}
              value={selectedUser?._id || ""}
              disabled={isLoading}
              className="select-input"
            >
              <option value="">-- เลือกผู้ใช้ --</option>
              {getUsersInConfirmedBookings().map((user) => (
                <option key={user._id} value={user._id}>
                  {user.firstname} {user.lastname}
                </option>
              ))}
            </select>
          </div>

          {selectedBookings.length > 0 && (
            <div className="booking-info-card">
              <h3>ข้อมูลการจอง</h3>
              {selectedBookings.map((booking, index) => (
                <div key={index} className="booking-item">
                  <div className="booking-detail">
                    <span className="detail-label">ห้อง:</span>
                    <span className="detail-value">
                      {booking.roomNumber || booking.room_number || "(ไม่ระบุ)"}
                    </span>
                  </div>
                  <div className="booking-detail">
                    <span className="detail-label">สถานะการชำระเงิน:</span>
                    <span className="status-confirmed">ยืนยันแล้ว</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="form-group-on-wtf-page file-upload-group">
            <label htmlFor="file-input" className="file-input-label">
              <div className="upload-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">

                </svg>
              </div>
              <span>เลือกรูปภาพใบแจ้งหนี้</span>
            </label>
            <input
              id="file-input"
              type="file"
              accept="image/*,application/pdf"
              onChange={handleFileChange}
              disabled={isLoading || !selectedUser}
              className="file-input-hidden"
            />
            {imageFile && (
              <div className="file-info">
                <span className="file-name">{imageFile.name}</span>
                <span className="file-size">
                  {(imageFile.size / 1024).toFixed(2)} KB
                </span>
              </div>
            )}
          </div>

          {previewUrl && (
            <div className="image-preview">
              <img src={previewUrl} alt="ตัวอย่างใบเสร็จ" />
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading || !selectedUser || !imageFile}
            className={`submit-btn ${
              isLoading || !selectedUser || !imageFile ? "disabled" : ""
            }`}
          >
            {isLoading ? (
              <>
                <span className="spinner-small"></span>
                กำลังอัปโหลด...
              </>
            ) : (
              <>
                <svg 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2"
                  className="btn-icon"
                >
                  <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7" />
                  <path d="M16 5h6v6" />
                  <path d="M8 12l8-8" />
                </svg>
                อัปโหลดใบแจ้งหนี้ให้กับผู้เช่า
              </>
            )}
          </button>
        </form>

        {message && (
          <div className={`message-box ${messageType}`}>
            <div className="message-icon">
              {messageType === "success" ? (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12" y2="16" />
                </svg>
              )}
            </div>
            <div className="message-text">{message}</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingInvoiceUpload;