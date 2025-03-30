import React, { useEffect, useState } from 'react';

const Managepay = () => {
  const [files, setFiles] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);

  // ฟังก์ชันดึงรายการไฟล์จากเซิร์ฟเวอร์
  const fetchFiles = async () => {
    try {
      const response = await fetch('http://localhost:5001/files');
      if (response.ok) {
        const data = await response.json();
        setFiles(data); // เก็บรายการไฟล์ใน state
      } else {
        console.error('ไม่สามารถดึงข้อมูลไฟล์');
      }
    } catch (error) {
      console.error('เกิดข้อผิดพลาดในการดึงไฟล์:', error);
    }
  };

  // ฟังก์ชันดึงข้อมูลการจอง
  const fetchReservations = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/bookings');
      if (response.ok) {
        const data = await response.json();
        // กรองข้อมูลที่สถานะเป็น "pending"
        const pendingReservations = data.filter(reservation => reservation.payment_status.trim() === 'pending');
        setReservations(pendingReservations);// เก็บข้อมูลการจองที่มีสถานะเป็น pending
      } else {
        console.error('ไม่สามารถดึงข้อมูลการจอง');
      }
    } catch (error) {
      console.error('เกิดข้อผิดพลาดในการดึงข้อมูลการจอง:', error);
    }
  };
  useEffect(() => {
    fetchFiles();
    fetchReservations();
  }, []);

  const updateBookingStatus = async (user_firstname, user_lastname, room_number, slip_filename, status) => {
    try {
      const response = await fetch('http://localhost:5001/api/confirmBooking', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          user_firstname, 
          user_lastname, 
          room_number, 
          slip_filename, 
          status 
        }),  // ส่งข้อมูลที่ต้องการ
      });
      
      if (response.ok) {
        alert('การจองถูกอัปเดตสถานะเรียบร้อย');
        setSelectedBooking(null);  // เคลียร์การเลือกการจอง
        fetchReservations();  // รีเฟรชการจองที่กรองตามสถานะ "pending"
      } else {
        const errorMessage = await response.text();  // รับข้อความจาก server ถ้ามีข้อผิดพลาด
        alert(`เกิดข้อผิดพลาดในการอัปเดตสถานะ: ${errorMessage}`);
      }
    } catch (error) {
      console.error('Error updating booking status:', error);
      alert('เกิดข้อผิดพลาดในการอัปเดตสถานะ');
    }
  };
  
  

  // สร้างตัวเลือกสถานะการจอง
  const handleSelectBooking = (booking) => {
    setSelectedBooking(booking);
  };

  return (
    <div>
      {/* แสดงรายการไฟล์ที่อัปโหลด */}
      {files.length > 0 ? (
        <div>
          <div style={{ display: 'flex', flexWrap: 'wrap' }}>
            {files.map((file, index) => {
              const fileUrl = `http://localhost:5001/uploads/${file}`;
              const isImage = file.endsWith('.png') || file.endsWith('.jpg') || file.endsWith('.jpeg');
              return (
                <div key={index} style={{ margin: '10px' }}>
                  {isImage ? (
                    <img
                      src={fileUrl}
                      alt={file}
                      style={{ width: '200px', height: 'auto', borderRadius: '5px' }}
                    />
                  ) : (
                    <a href={fileUrl} target="_blank" rel="noopener noreferrer">{file}</a>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <p>ยังไม่มีไฟล์ที่อัปโหลด</p>
      )}

      {/* แสดงรายการการจอง */}
      <h3>Manage Room Reservations</h3>
      {reservations.length > 0 ? (
        reservations.map((reservation) => (
          <div key={reservation._id}>
            <p><strong>Room Number:</strong> {reservation.room_number}</p>
            <p><strong>Payment Status:</strong> {reservation.payment_status}</p>
            <p><strong>Created At:</strong> {new Date(reservation.created_at).toLocaleDateString()}</p>
            <button onClick={() => handleSelectBooking(reservation)}>Select Booking</button>
          </div>
        ))
      ) : (
        <p>No pending reservations</p>
      )}

      {/* แสดงข้อมูลการจองที่เลือก */}
      {selectedBooking && (
        <div>
          <h4>Selected Booking</h4>
          <p><strong>Room Number:</strong> {selectedBooking.room_number}</p>
          <p><strong>Payment Status:</strong> {selectedBooking.payment_status}</p>
          <button onClick={() => updateBookingStatus(selectedBooking.user_firstname, selectedBooking.user_lastname, selectedBooking.room_number, selectedBooking.slip_filename, 'confirmed')}>Confirm Payment</button>
          <button onClick={() => updateBookingStatus(selectedBooking.user_firstname, selectedBooking.user_lastname, selectedBooking.room_number, selectedBooking.slip_filename, 'rejected')}>Reject Payment</button>
        </div>
      )}
    </div>
  );
};


export default Managepay;
