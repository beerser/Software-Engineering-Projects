import React, { useState, useEffect } from 'react';

const Confirm = () => {
  const [bookings, setBookings] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await fetch('http://localhost:5001/api/bookings');
        if (!response.ok) {
          throw new Error('ไม่สามารถดึงข้อมูลการจอง');
        }
        const data = await response.json();
        
        // กรองการจองที่มีสถานะเป็น "pending"
        const pendingBookings = data.filter((booking) => booking.payment_status === 'pending');
        setBookings(pendingBookings);  // เก็บข้อมูลการจองที่มีสถานะ "pending" ใน state
      } catch (error) {
        setMessage('เกิดข้อผิดพลาดในการดึงข้อมูลการจอง');
      }
    };

    fetchBookings();
  }, []);  // เรียกใช้เพียงครั้งเดียวเมื่อโหลดหน้า

  return (
    <div>
      <h2>ข้อมูลการจองทั้งหมด</h2>

      {/* แสดงข้อความสถานะ */}
      <div>
        <p>{message}</p>
      </div>

      {/* แสดงข้อมูลการจองที่มีสถานะ "pending" */}
      {bookings.length === 0 ? (
        <p>ไม่พบข้อมูลการจองที่รอดำเนินการ</p>
      ) : (
        bookings.map((booking, index) => (
          <div key={index}>
            <h3>ข้อมูลผู้จอง:</h3>
            <p>ชื่อ: {booking.user_firstname} {booking.user_lastname}</p>
            <p>หมายเลขห้อง: {booking.room_number}</p>
            <p>สลิปการชำระเงิน: {booking.slip_filename}</p>
            <p>สถานะการจอง: {booking.payment_status}</p>
            <p>วันที่จอง: {new Date(booking.created_at).toLocaleString()}</p>
            <hr />
          </div>
        ))
      )}
    </div>
  );
};

export default Confirm;
