import React, { useEffect, useState } from 'react';
import '../css/Managepay.css';

const ImageModal = ({ src, alt, onClose }) => {

  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    
    
    document.body.style.overflow = 'hidden';
    
    return () => {
      window.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'auto';
    };
  }, [onClose]);

  return (
    <div className="image-modal-overlay" onClick={onClose}>
      <div className="image-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-button" onClick={onClose}>×</button>
        <img src={src} alt={alt} className="modal-image" />
      </div>
    </div>
  );
};

const Managepay = () => {
  const [files, setFiles] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [modalImage, setModalImage] = useState(null);

  
  const openImageModal = (imageUrl) => {
    setModalImage(imageUrl);
  };


  const closeImageModal = () => {
    setModalImage(null);
  };

  // ฟังก์ชันดึงรายการไฟล์จากเซิร์ฟเวอร์
  const fetchFiles = async () => {
    try {
      const response = await fetch('http://localhost:5001/files');
      if (response.ok) {
        const data = await response.json();
        setFiles(data);
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
        setReservations(pendingReservations);
      } else {
        console.error('ไม่สามารถดึงข้อมูลการจอง');
      }
    } catch (error) {
      console.error('เกิดข้อผิดพลาดในการดึงข้อมูลการจอง:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const fetchAllData = async () => {
      setIsLoading(true);
      await Promise.all([
        fetchFiles(),
        fetchReservations(),
        fetchRooms()
      ]);
    };
    
    // ดึงข้อมูลห้อง
    const fetchRooms = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:5001/api/rooms", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setRooms(data);
      } catch (err) {
        console.error("Error fetching rooms", err);
      }
    };

    fetchAllData();
  }, []);

  const updateBookingStatus = async (user_firstname, user_lastname, room_number, slip_filename, status) => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");
      const response = await fetch('http://localhost:5001/api/confirmBooking', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
          user_firstname, 
          user_lastname, 
          room_number, 
          slip_filename, 
          status,
        }),
      });
      
      if (response.ok) {
        const statusText = status === 'confirmed' ? 'ยืนยัน' : 'ปฏิเสธ';
        alert(`การจองถูก${statusText}เรียบร้อยแล้ว`);
        setSelectedBooking(null);
        fetchReservations();
      } else {
        const errorMessage = await response.text();
        alert(`เกิดข้อผิดพลาดในการอัปเดตสถานะ: ${errorMessage}`);
      }
    } catch (error) {
      console.error('Error updating booking status:', error);
      alert('เกิดข้อผิดพลาดในการอัปเดตสถานะ');
    } finally {
      setIsLoading(false);
    }
  };

  // สร้างตัวเลือกสถานะการจอง
  const handleSelectBooking = (booking) => {
    setSelectedBooking(booking);
  };

  // หาชื่อห้องจาก room_number
  const getRoomName = (roomNumber) => {
    const room = rooms.find(r => r.room_number === roomNumber);
    return room ? room.name : roomNumber;
  };

  return (
    <div className="managepay-container">
     
      {modalImage && (
        <ImageModal 
          src={modalImage} 
          alt="รายละเอียดรูปภาพ" 
          onClose={closeImageModal} 
        />
      )}

      <div className="dashboard-header">
        <h2>จัดการการชำระเงิน</h2>
        {isLoading && <div className="loading-spinner"></div>}
      </div>

      <div className="dashboard-content">
        <div className="reservations-section">
          <div className="section-header">
            <h3>รายการรอการยืนยัน</h3>
            <button className="refresh-button" onClick={fetchReservations}>รีเฟรช</button>
          </div>
          
          {isLoading ? (
            <div className="loading-message">กำลังโหลดข้อมูล...</div>
          ) : reservations.length > 0 ? (
            <div className="reservations-list">
              {reservations.map((reservation) => (
                <div 
                  key={reservation._id} 
                  className={`reservation-card ${selectedBooking && selectedBooking._id === reservation._id ? 'selected' : ''}`}
                  onClick={() => handleSelectBooking(reservation)}
                >
                  <div className="reservation-info">
                    <h4>ห้อง: {getRoomName(reservation.room_number)}</h4>
                    <p>
                      <span className="user-name">
                        {reservation.user_firstname} {reservation.user_lastname}
                      </span>
                    </p>
                    <p>
                      <span className="status-badge pending">
                        {reservation.payment_status}
                      </span>
                      <span className="date-info">
                        {new Date(reservation.created_at).toLocaleDateString('th-TH', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </p>
                  </div>
                  <div className="reservation-actions">
                    <button 
                      className="select-button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelectBooking(reservation);
                      }}
                    >
                      เลือก
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-message">ไม่มีการจองที่รอการยืนยัน</div>
          )}
        </div>

        <div className="details-section">
          {selectedBooking ? (
            <div className="booking-details">
              <h3>รายละเอียดการจอง</h3>
              <div className="booking-info">
                <p><strong>ชื่อ-นามสกุล:</strong> {selectedBooking.user_firstname} {selectedBooking.user_lastname}</p>
                <p><strong>หมายเลขห้อง:</strong> {selectedBooking.room_number} ({getRoomName(selectedBooking.room_number)})</p>
                <p><strong>สถานะการชำระเงิน:</strong> <span className="status-badge pending">{selectedBooking.payment_status}</span></p>
                <p><strong>วันที่จอง:</strong> {new Date(selectedBooking.created_at).toLocaleDateString('th-TH', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}</p>
                
                {selectedBooking.slip_filename && (
                  <div className="payment-slip">
                    <h4>หลักฐานการชำระเงิน</h4>
                    <img 
                      src={`http://localhost:5001/uploads/${selectedBooking.slip_filename}`}
                      alt="หลักฐานการชำระเงิน"
                      onClick={() => openImageModal(`http://localhost:5001/uploads/${selectedBooking.slip_filename}`)}
                    />
                  </div>
                )}
                
                <div className="action-buttons">
                  <button 
                    className="confirm-button"
                    onClick={() => updateBookingStatus(
                      selectedBooking.user_firstname, 
                      selectedBooking.user_lastname, 
                      selectedBooking.room_number, 
                      selectedBooking.slip_filename, 
                      'confirmed'
                    )}
                  >
                    ยืนยันการชำระเงิน
                  </button>
                  <button 
                    className="reject-button"
                    onClick={() => updateBookingStatus(
                      selectedBooking.user_firstname, 
                      selectedBooking.user_lastname, 
                      selectedBooking.room_number, 
                      selectedBooking.slip_filename, 
                      'rejected'
                    )}
                  >
                    ปฏิเสธการชำระเงิน
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="no-selection-message">
              <p>กรุณาเลือกรายการจองเพื่อดูรายละเอียด</p>
            </div>
          )}
        </div>
      </div>

      {files.length > 0 && (
        <div className="all-uploads-section">
          <h3>ไฟล์ที่อัปโหลดทั้งหมด</h3>
          <div className="files-grid">
            {files.map((file, index) => {
              const fileUrl = `http://localhost:5001/uploads/${file}`;
              const isImage = file.endsWith('.png') || file.endsWith('.jpg') || file.endsWith('.jpeg');
              return (
                <div key={index} className="file-item">
                  {isImage ? (
                    <div className="image-preview">
                      <img
                        src={fileUrl}
                        alt={file}
                        onClick={() => openImageModal(fileUrl)}
                      />
                      <div className="file-name">{file}</div>
                    </div>
                  ) : (
                    <div className="file-link">
                      <a href={fileUrl} target="_blank" rel="noopener noreferrer">{file}</a>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default Managepay;