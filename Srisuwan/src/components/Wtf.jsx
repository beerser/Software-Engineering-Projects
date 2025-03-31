import React, { useState, useEffect } from 'react';

const BookingInvoiceUpload = () => {
  const [bookings, setBookings] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      await Promise.all([fetchBookings(), fetchUsers()]);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const fetchBookings = async () => {
    try {
      const response = await fetch("http://localhost:5001/api/bookings");
      if (!response.ok) {
        throw new Error("Unable to fetch bookings");
      }
      const data = await response.json();
      setBookings(data);
    } catch (error) {
      console.error("Error fetching bookings:", error);
      setMessage("ไม่สามารถดึงข้อมูลการจองได้");
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch("http://localhost:5001/api/user");
      if (!response.ok) {
        throw new Error("Unable to fetch users");
      }
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
      setMessage("ไม่สามารถดึงข้อมูลผู้ใช้ได้");
    }
  };

  // ฟังก์ชันกรองผู้ใช้ที่มีการจองที่สถานะ "confirmed"
  const getConfirmedUsers = () => {
    return users.filter(user => 
      bookings.some(booking =>
        booking.user_firstname === user.firstname &&
        booking.user_lastname === user.lastname &&
        booking.payment_status === "confirmed"
      )
    );
  };

  const handleUserSelect = (e) => {
    const userId = e.target.value;
    if (!userId) {
      setSelectedUser(null);
      return;
    }

    const user = users.find(u => u._id === userId);
    setSelectedUser(user);
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">แสดงข้อมูลผู้ใช้ที่มีการจองที่สถานะ "confirmed"</h2>

      {/* Select User - Filtered by Bookings with confirmed status */}
      <div className="mb-4">
        <label className="block text-lg font-medium text-gray-700 mb-2">เลือกผู้ใช้ที่จะอัพโหลดใบเสร็จ</label>
        <select
          id="user-select"
          onChange={handleUserSelect}
          value={selectedUser ? selectedUser._id : ""}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="" key="user-default">-- เลือกผู้ใช้ --</option>
          {getConfirmedUsers().map((user) => (
            <option key={`user-${user._id}`} value={user._id}>
              {user.firstname} {user.lastname}
            </option>
          ))}
        </select>
      </div>

      {/* Show Selected User's Booking Info */}
      {selectedUser && (
        <div className="mb-4 p-4 bg-gray-50 rounded-md">
          <h3 className="text-xl font-medium text-gray-700 mb-2">ข้อมูลการจองของผู้ใช้</h3>
          {(() => {
            const booking = bookings.find(
              (booking) =>
                booking.user_firstname === selectedUser.firstname &&
                booking.user_lastname === selectedUser.lastname &&
                booking.payment_status === "confirmed"
            );
            if (booking) {
              return (
                <>
                  <p><strong>ชื่อ-นามสกุล:</strong> {selectedUser.firstname} {selectedUser.lastname}</p>
                  <p><strong>หมายเลขห้อง:</strong> {booking.room_number}</p>
                  <p><strong>วันที่เริ่มเช่า:</strong> {new Date(booking.created_at).toLocaleDateString('th-TH')}</p>
                </>
              );
            } else {
              return <p className="text-red-500">ไม่พบข้อมูลการจองที่ยืนยันแล้ว</p>;
            }
          })()}
        </div>
      )}

      {/* Message */}
      {message && (
        <div className={`mt-4 p-3 rounded-md ${message.includes("สำเร็จ") ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
          <p className="text-center text-lg">{message}</p>
        </div>
      )}
    </div>
  );
};

export default BookingInvoiceUpload;
