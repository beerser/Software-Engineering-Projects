import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import "../css/BookingInvoiceUpload.css";

const BookingInvoiceUpload = () => {
  const { state } = useLocation();
  const [bookings, setBookings] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messageType, setMessageType] = useState(''); // 'success' or 'error'

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (selectedUser) {
      const userBooking = bookings.find(booking => 
        (booking.user_id && booking.user_id === selectedUser._id && booking.payment_status === "confirmed") ||
        ((booking.user_firstname === selectedUser.firstname || booking.first_name === selectedUser.firstname) &&
         (booking.user_lastname === selectedUser.lastname || booking.last_name === selectedUser.lastname) &&
         booking.payment_status === "confirmed")
      );

      if (userBooking) {
        setSelectedUser(prev => ({
          ...prev,
          roomNumber: userBooking.roomNumber || userBooking.room_number || 'Not specified'
        }));
      }

      setSelectedBooking(userBooking || null);
    } else {
      setSelectedBooking(null);
    }
  }, [selectedUser?._id, bookings]);

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
    return users.filter(user =>
      bookings.some(booking =>
        (booking.user_id && booking.user_id === user._id && booking.payment_status === "confirmed") ||
        ((booking.user_firstname === user.firstname || booking.first_name === user.firstname) &&
         (booking.user_lastname === user.lastname || booking.last_name === user.lastname) &&
         booking.payment_status === "confirmed")
      )
    );
  };

  const handleUserSelect = (e) => {
    const user = users.find(u => u._id === e.target.value);
    setSelectedUser(user || null);
  };

  const handleFileChange = (event) => {
    setImageFile(event.target.files[0] || null);
  };

  const showSuccessMessage = (msg) => {
    setMessage(msg);
    setMessageType('success');
  };

  const showErrorMessage = (msg) => {
    setMessage(msg);
    setMessageType('error');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    if (!imageFile) {
      showErrorMessage('กรุณาเลือกไฟล์ใบเสร็จก่อนส่ง');
      setIsLoading(false);
      return;
    }

    if (!selectedUser) {
      showErrorMessage('ไม่พบข้อมูลผู้ใช้ โปรดเลือกผู้ใช้ก่อน');
      setIsLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append('invoice', imageFile);
    formData.append('user_firstname', selectedUser.firstname);
    formData.append('user_lastname', selectedUser.lastname);
    formData.append('room_number', selectedUser.roomNumber || 'Not specified');

    try {
      const response = await fetch('http://localhost:5001/collection', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        showSuccessMessage('อัปโหลดไฟล์ใบเสร็จสำเร็จ!');
      } else {
        showErrorMessage(`เกิดข้อผิดพลาด: ${await response.text()}`);
      }
    } catch (error) {
      console.error("Upload error:", error);
      showErrorMessage('เกิดข้อผิดพลาดในการเชื่อมต่อกับเซิร์ฟเวอร์ โปรดลองใหม่อีกครั้ง');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container">
      <h2 className="title">อัปโหลดใบเสร็จค่าเช่า</h2>

      {isLoading && <div className="loading">กำลังโหลดข้อมูล...</div>}

      <form onSubmit={handleSubmit} className="form-container">
        <div className="form-group">
          <label htmlFor="user-select">เลือกผู้ใช้</label>
          <select id="user-select" onChange={handleUserSelect} value={selectedUser?._id || ""} disabled={isLoading}>
            <option value="">-- เลือกผู้ใช้ --</option>
            {getUsersInConfirmedBookings().map(user => (
              <option key={user._id} value={user._id}>
                {user.firstname} {user.lastname}
              </option>
            ))}
          </select>
        </div>

        {selectedBooking && (
          <div className="booking-info">
            <p>ห้อง: {selectedUser?.roomNumber || '(ไม่ระบุ)'}</p>
            <p>สถานะการชำระเงิน: ยืนยันแล้ว</p>
          </div>
        )}

        <div className="form-group">
          <label htmlFor="file-input">เลือกรูปภาพใบเสร็จ</label>
          <input id="file-input" type="file" accept="image/*,application/pdf" onChange={handleFileChange} disabled={isLoading || !selectedUser} />
        </div>

        <button type="submit" disabled={isLoading || !selectedUser || !imageFile} className="submit-btn">
          {isLoading ? 'กำลังอัปโหลด...' : 'อัปโหลดใบเสร็จ'}
        </button>
      </form>

      {message && <div className={`message ${messageType}`}>{message}</div>}
    </div>
  );
};

export default BookingInvoiceUpload;