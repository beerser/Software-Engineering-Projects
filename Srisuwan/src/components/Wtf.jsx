import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

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

  // Debug log เพื่อดูข้อมูล
  useEffect(() => {
    if (bookings.length > 0 && users.length > 0) {
      console.log("Bookings:", bookings);
      console.log("Users:", users);
    }
  }, [bookings, users]);

  useEffect(() => {
    // เมื่อเลือกผู้ใช้ ให้ค้นหาการจองของผู้ใช้นั้นที่สถานะเป็น confirmed
    if (selectedUser) {
      console.log("Selected user:", selectedUser);
      
      // ค้นหาการจองที่ตรงกับผู้ใช้นี้ - ตรวจสอบทั้ง user_id และชื่อ-นามสกุล
      const userBooking = bookings.find(booking => {
        // ตรวจสอบโดยใช้ user_id ถ้ามี
        if (booking.user_id && booking.user_id === selectedUser._id) {
          return booking.payment_status === "confirmed";
        }
        
        // ตรวจสอบโดยใช้ชื่อและนามสกุล
        const firstnameMatch = booking.user_firstname === selectedUser.firstname || 
                               booking.first_name === selectedUser.firstname;
        const lastnameMatch = booking.user_lastname === selectedUser.lastname || 
                              booking.last_name === selectedUser.lastname;
        
        return firstnameMatch && lastnameMatch && booking.payment_status === "confirmed";
      });
      
      console.log("Found booking:", userBooking);
      setSelectedBooking(userBooking || null);
    } else {
      setSelectedBooking(null);
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
      if (!response.ok) {
        throw new Error("Unable to fetch bookings");
      }
      const data = await response.json();
      setBookings(data);
    } catch (error) {
      console.error("Error fetching bookings:", error);
      showErrorMessage("ไม่สามารถดึงข้อมูลการจองได้");
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
      showErrorMessage("ไม่สามารถดึงข้อมูลผู้ใช้ได้");
    }
  };

  const getUsersInConfirmedBookings = () => {
    // หาผู้ใช้ที่มีการจองที่ยืนยันแล้ว
    return users.filter(user =>
      bookings.some(booking => {
        // ตรวจสอบโดยใช้ user_id ถ้ามี
        if (booking.user_id && booking.user_id === user._id) {
          return booking.payment_status === "confirmed";
        }
        
        // ตรวจสอบโดยใช้ชื่อและนามสกุล
        const firstnameMatch = booking.user_firstname === user.firstname || 
                              booking.first_name === user.firstname;
        const lastnameMatch = booking.user_lastname === user.lastname || 
                              booking.last_name === user.lastname;
        
        return firstnameMatch && lastnameMatch && booking.payment_status === "confirmed";
      })
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

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setImageFile(file || null);
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

    // ตรวจสอบไฟล์
    if (!imageFile) {
      showErrorMessage('กรุณาเลือกไฟล์ใบเสร็จก่อนส่ง');
      setIsLoading(false);
      return;
    }

    // ตรวจสอบผู้ใช้
    if (!selectedUser || !selectedUser.firstname || !selectedUser.lastname) {
      showErrorMessage('ไม่พบข้อมูลผู้ใช้ โปรดเลือกผู้ใช้ก่อน');
      setIsLoading(false);
      return;
    }

    // ถ้าไม่พบข้อมูลการจอง ให้สร้างข้อมูลการจองใหม่โดยใช้ข้อมูลผู้ใช้ที่เลือก
    let bookingData = selectedBooking;
    
    // ถ้าไม่พบข้อมูลการจอง ให้อัปโหลดโดยใช้เฉพาะข้อมูลผู้ใช้
    const formData = new FormData();
    formData.append('invoice', imageFile);
    formData.append('userId', selectedUser._id);
    


    try {
      const response = await fetch('http://localhost:5001/api/rentalInvoices/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        showSuccessMessage('อัปโหลดไฟล์ใบเสร็จสำเร็จ!');
        setImageFile(null);
        document.getElementById('file-input').value = '';
      } else {
        const errorText = await response.text();
        showErrorMessage(`เกิดข้อผิดพลาด: ${errorText}`);
      }
    } catch (error) {
      showErrorMessage('เกิดข้อผิดพลาดในการเชื่อมต่อกับเซิร์ฟเวอร์ โปรดลองใหม่อีกครั้ง');
      console.error("Upload error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">อัปโหลดใบเสร็จค่าเช่า</h2>

      {isLoading && (
        <div className="text-center my-4">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
          <p className="mt-2 text-gray-600">กำลังโหลดข้อมูล...</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-md">
        {/* เลือกผู้ใช้ */}
        <div className="mb-4">
          <label htmlFor="user-select" className="block text-lg font-medium text-gray-700 mb-2">
            เลือกผู้ใช้ที่จะอัพโหลดใบเสร็จ
          </label>
          <select
            id="user-select"
            onChange={handleUserSelect}
            value={selectedUser ? selectedUser._id : ""}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            disabled={isLoading}
          >
            <option value="" key="user-default">-- เลือกผู้ใช้ --</option>
            {getUsersInConfirmedBookings().map((user) => (
              <option key={`user-${user._id}`} value={user._id}>
                {user.firstname} {user.lastname}
              </option>
            ))}
          </select>
        </div>

        {/* แสดงข้อมูลการจอง (ถ้ามี) */}
        {selectedUser && (
          <div className="p-4 bg-blue-50 rounded-md border border-blue-200 mb-4">
            {selectedBooking ? (
              <>
                <h3 className="font-medium text-blue-800 mb-2">ข้อมูลการจอง</h3>
                <p>ห้อง: {selectedBooking.roomNumber || selectedBooking.room_number || '(ไม่ระบุ)'}</p>
                <p>สถานะการชำระเงิน: {selectedBooking.payment_status === 'confirmed' ? 'ยืนยันแล้ว' : selectedBooking.payment_status}</p>
                {selectedBooking.booking_date && (
                  <p>วันที่จอง: {new Date(selectedBooking.booking_date).toLocaleDateString('th-TH')}</p>
                )}
              </>
            ) : (
              <div className="text-amber-700">
                <p className="font-medium">ไม่พบข้อมูลการจองที่ยืนยันสำหรับผู้ใช้นี้</p>
                <p className="text-sm">ระบบจะบันทึกใบเสร็จให้กับผู้ใช้นี้โดยตรง</p>
              </div>
            )}
          </div>
        )}

        {/* อัปโหลดไฟล์ */}
        <div className="mb-4">
          <label htmlFor="file-input" className="block text-lg font-medium text-gray-700 mb-2">
            เลือกรูปภาพใบเสร็จ
          </label>
          <input
            id="file-input"
            type="file"
            name="invoice"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            disabled={isLoading || !selectedUser}
          />
        </div>

        {/* ปุ่มส่ง */}
        <button
          type="submit"
          disabled={isLoading || !selectedUser || !imageFile}
          className={`w-full py-3 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium ${
            isLoading || !selectedUser || !imageFile
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-indigo-500 text-white hover:bg-indigo-600"
          }`}
        >
          {isLoading ? 'กำลังอัปโหลด...' : 'อัปโหลดใบเสร็จ'}
        </button>
      </form>

      {/* ข้อความแจ้งเตือน */}
      {message && (
        <div className={`mt-6 p-4 rounded-md ${messageType === 'success' ? "bg-green-100 text-green-700 border border-green-400" : "bg-red-100 text-red-700 border border-red-400"}`}>
          <p className="text-center text-lg">{message}</p>
        </div>
      )}
    </div>
  );
};

export default BookingInvoiceUpload;