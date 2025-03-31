import React, { useState, useEffect } from "react";
import "../css/Confirm.css";
const Confirm = () => {
  const [bookings, setBookings] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await fetch("http://localhost:5001/api/bookings");
        if (!response.ok) {
          throw new Error("ไม่สามารถดึงข้อมูลการจอง");
        }
        const data = await response.json();

        // กรองการจองที่มีสถานะเป็น "pending"
        const pendingBookings = data.filter(
          (booking) => booking.payment_status === "pending"
        );
        setBookings(pendingBookings); // เก็บข้อมูลการจองที่มีสถานะ "pending" ใน state
      } catch (error) {
        setMessage("เกิดข้อผิดพลาดในการดึงข้อมูลการจอง");
      }
    };

    fetchBookings();
  }, []); // เรียกใช้เพียงครั้งเดียวเมื่อโหลดหน้า

  return (
    <div className="manage-booking-main">
      <h2 className="text-header-on-manage-booking">ข้อมูลการจองทั้งหมด</h2>

      {/* แสดงข้อความสถานะ */}
      <div>
        <p>{message}</p>
      </div>

      {/* แสดงข้อมูลการจองที่มีสถานะ "pending" */}
      {bookings.length === 0 ? (
        <p>ไม่พบข้อมูลการจองที่รอดำเนินการ</p>
      ) : (
        bookings.map((booking, index) => (
          <div key={index} className="booking-card">
            <h3 className="booking-header">ข้อมูลผู้จอง:</h3>
            <div className="booking-details">
              <p>
                <strong>ชื่อ:</strong> {booking.user_firstname}{" "}
                {booking.user_lastname}
              </p>
              <p>
                <strong>หมายเลขห้อง:</strong> {booking.room_number}
              </p>
              <p>
                <strong>สลิปการชำระเงิน:</strong> {booking.slip_filename}
              </p>
              <p>
                <strong>สถานะการจอง:</strong>
                <span
                  className={`status ${
                    booking.payment_status === "confirmed"
                      ? "confirmed"
                      : "pending"
                  }`}
                >
                  {booking.payment_status}
                </span>
              </p>
              <p>
                <strong>วันที่จอง:</strong>{" "}
                {new Date(booking.created_at).toLocaleString()}
              </p>
            </div>
            <hr className="booking-divider" />
          </div>
        ))
      )}
    </div>
  );
};

export default Confirm;
