import React, { useState, useEffect, useCallback } from "react";
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
  const [isFetching, setIsFetching] = useState(false);
  const [messageType, setMessageType] = useState("");
  const [previewUrl, setPreviewUrl] = useState(null);

  // สร้างฟังก์ชันแสดงข้อความด้วย useCallback เพื่อป้องกันการสร้างฟังก์ชันซ้ำๆ
  const showSuccessMessage = useCallback((msg) => {
    setMessage(msg);
    setMessageType("success");
    // ให้ข้อความหายไปหลังจาก 5 วินาที
    setTimeout(() => {
      setMessage("");
      setMessageType("");
    }, 5000);
  }, []);

  const showErrorMessage = useCallback((msg) => {
    setMessage(msg);
    setMessageType("error");
    // ให้ข้อความหายไปหลังจาก 5 วินาที
    setTimeout(() => {
      setMessage("");
      setMessageType("");
    }, 5000);
  }, []);

  const handleCancelImage = () => {
    setImageFile(null);
    setPreviewUrl(null);
    const fileInput = document.getElementById('file-input');
    if (fileInput) fileInput.value = '';
  };

  const fetchData = useCallback(async () => {
    setIsFetching(true);
    try {
      await Promise.all([fetchBookings(), fetchUsers()]);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsFetching(false);
    }
  }, []);

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

  // ดึงข้อมูลเมื่อ component โหลด
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // อัพเดทข้อมูลการจองเมื่อเลือกผู้ใช้
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

  // ทำความสะอาด URL เมื่อมีการอัปโหลดรูป
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const getUsersInConfirmedBookings = useCallback(() => {
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
  }, [users, bookings]);

  const handleUserSelect = (e) => {
    const user = users.find((u) => u._id === e.target.value);
    setSelectedUser(user || null);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    
    if (file) {
      // ตรวจสอบประเภทไฟล์
      if (!file.type.startsWith('image/') && file.type !== 'application/pdf') {
        showErrorMessage("กรุณาอัปโหลดไฟล์รูปภาพหรือ PDF เท่านั้น");
        event.target.value = '';
        return;
      }
      
      // ตรวจสอบขนาดไฟล์ (จำกัดที่ 5MB)
      if (file.size > 5 * 1024 * 1024) {
        showErrorMessage("ขนาดไฟล์เกิน 5MB กรุณาเลือกไฟล์ขนาดเล็กลง");
        event.target.value = '';
        return;
      }
    }
    
    setImageFile(file || null);
    
    // สร้าง preview URL สำหรับรูปภาพ
    if (file && file.type.startsWith('image/')) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    } else {
      setPreviewUrl(null);
    }
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
        // ล้างฟอร์มหลังจากอัปโหลดสำเร็จ
        setImageFile(null);
        setPreviewUrl(null);
        const fileInput = document.getElementById('file-input');
        if (fileInput) fileInput.value = '';
      } else {
        const errorText = await response.text();
        showErrorMessage(`เกิดข้อผิดพลาด: ${errorText}`);
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

  // คำนวณปุ่มปิดกล่องข้อความ
  const handleCloseMessage = () => {
    setMessage("");
    setMessageType("");
  };

  // แสดงสถานะการชำระเงินด้วยสีและไอคอน
  const renderPaymentStatus = (status) => {
    if (status === "confirmed") {
      return (
        <span className="status-confirmed">
          <svg className="status-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
          ยืนยันแล้ว
        </span>
      );
    }
    return <span className="status-pending">รอการยืนยัน</span>;
  };

  const usersWithConfirmedBookings = getUsersInConfirmedBookings();

  return (
    <div className="container-on-wtf-page">
      <div className="upload-card">
        <h2 className="title">ส่งใบแจ้งหนี้ให้กับผู้เช่า</h2>

        {isFetching && (
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>กำลังโหลดข้อมูล...</p>
          </div>
        )}

        {!isFetching && usersWithConfirmedBookings.length === 0 && (
          <div className="empty-state">
            <svg className="empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="8" y1="12" x2="16" y2="12" />
            </svg>
            <p>ไม่พบผู้ใช้ที่มีการจองที่ยืนยันแล้ว</p>
          </div>
        )}

        {!isFetching && usersWithConfirmedBookings.length > 0 && (
          <form onSubmit={handleSubmit} className="form-container-on-wtf-page">
            <div className="form-group-on-wtf-page">
              <label htmlFor="user-select">เลือกผู้ใช้</label>
              <div className="select-wrapper">
                <select
                  id="user-select"
                  onChange={handleUserSelect}
                  value={selectedUser?._id || ""}
                  disabled={isLoading}
                  className="select-input"
                >
                  <option value="">-- เลือกผู้ใช้ --</option>
                  {usersWithConfirmedBookings.map((user) => (
                    <option key={user._id} value={user._id}>
                      {user.firstname} {user.lastname} {user.roomNumber ? `(ห้อง ${user.roomNumber})` : ''}
                    </option>
                  ))}
                </select>
                <svg className="select-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </div>
            </div>

            {selectedBookings.length > 0 && (
              <div className="booking-info-card">
                <h3>ข้อมูลการจอง ({selectedBookings.length})</h3>
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
                      {renderPaymentStatus(booking.payment_status)}
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="form-group-on-wtf-page file-upload-group">
              <label htmlFor="file-input" className={`file-input-label ${!selectedUser ? 'disabled' : ''}`}>
                <div className="upload-icon">
                    
                </div>
                <span>{imageFile ? 'เปลี่ยนไฟล์' : 'เลือกรูปภาพใบแจ้งหนี้'}</span>
                <p className="file-hint">รองรับไฟล์ JPG, PNG หรือ PDF (ไม่เกิน 5MB)</p>
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
                  <div className="file-details">
                    <svg className="file-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      {imageFile.type.startsWith('image/') ? (
                        <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z M14 2v6h6 M3 15l5-5 6 6 M18 14l-3-3 2-2 1 1 2-2" />
                      ) : (
                        <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z M14 2v6h6 M16 13H8 M16 17H8 M10 9H8" />
                      )}
                    </svg>
                    <div>
                      <span className="file-name">{imageFile.name}</span>
                      <span className="file-size">
                        {(imageFile.size / 1024).toFixed(2)} KB
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="cancel-image-btn"
                    onClick={handleCancelImage}
                    title="ยกเลิกรูปภาพ"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10" />
                      <line x1="15" y1="9" x2="9" y2="15" />
                      <line x1="9" y1="9" x2="15" y2="15" />
                    </svg>
                  </button>
                </div>
              )}
            </div>

            {previewUrl && (
              <div className="image-preview">
                <img src={previewUrl} alt="ตัวอย่างใบเสร็จ" />
                <button
                  type="button"
                  className="preview-fullscreen-btn"
                  onClick={() => window.open(previewUrl, '_blank')}
                  title="ดูขนาดเต็ม"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="15 3 21 3 21 9" />
                    <polyline points="9 21 3 21 3 15" />
                    <line x1="21" y1="3" x2="14" y2="10" />
                    <line x1="3" y1="21" x2="10" y2="14" />
                  </svg>
                </button>
              </div>
            )}
            
            {!imageFile && selectedUser && (
              <div className="file-placeholder">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <polyline points="21 15 16 10 5 21" />
                </svg>
                <p>กรุณาอัปโหลดรูปภาพใบแจ้งหนี้</p>
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
        )}

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
            <button
              type="button"
              className="message-close"
              onClick={handleCloseMessage}
              title="ปิด"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingInvoiceUpload;