import React, { useState, useEffect } from 'react';

const BookingInvoiceUpload = () => {
  const [bookings, setBookings] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

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

  const getUsersInConfirmedBookings = () => {
    return users.filter(user =>
      bookings.some(
        booking =>
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

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImageFile(file);
    } else {
      setImageFile(null);
    }
  };

  const handleSubmit = async () => {
    if (!selectedUser || !imageFile) {
      setMessage("กรุณาเลือกผู้ใช้ และไฟล์รูปภาพ");
      return;
    }
  
    const formData = new FormData();
    formData.append('rentalInvoice', imageFile);  // เปลี่ยนจาก 'slip' เป็น 'rentalInvoice'
    formData.append('userId', selectedUser._id);  // ส่ง userId ของผู้ใช้ที่เลือก
    
    try {
      const response = await fetch('http://localhost:5001/api/rentalInvoices/upload', {
        method: 'POST',
        body: formData,
      });
  
      if (response.ok) {
        const result = await response.json();
        setMessage("ไฟล์ใบเสร็จถูกอัปโหลดสำเร็จ!");
        console.log("Uploaded file:", result.filename);
        // ตอนนี้ข้อมูลการจองจะถูกอัปเดตในฐานข้อมูลด้วยชื่อไฟล์ที่ถูกอัปโหลด
      } else {
        const errorText = await response.text();
        setMessage(`เกิดข้อผิดพลาดในการอัปโหลดไฟล์: ${errorText}`);
      }
    } catch (error) {
      setMessage("ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้");
      console.error("Error uploading image:", error);
    }
  };
  
  

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">อัปโหลดใบเสร็จค่าเช่า</h2>

      {isLoading && (
        <div className="text-center my-4">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
          <p className="mt-2 text-gray-600">กำลังโหลดข้อมูล...</p>
        </div>
      )}

      {/* Select User - Filtered by Bookings with confirmed status */}
      <div className="mb-4">
        <label className="block text-lg font-medium text-gray-700 mb-2">เลือกผู้ใช้ที่จะอัพโหลดใบเสร็จ</label>
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

      {/* File Upload */}
      <div className="mb-4">
        <label className="block text-lg font-medium text-gray-700 mb-2">เลือกรูปภาพใบเสร็จ</label>
        <input
          id="file-input"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          disabled={isLoading || !selectedUser}
        />
      </div>

      {/* Submit Button */}
      <button
        onClick={handleSubmit}
        disabled={isLoading || !selectedUser || !imageFile}
        className={`w-full py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
          isLoading || !selectedUser || !imageFile
            ? "bg-gray-300 text-gray-500 cursor-not-allowed" 
            : "bg-indigo-500 text-white hover:bg-indigo-600"
        }`}
      >
        {isLoading ? 'กำลังอัปโหลด...' : 'อัปโหลดใบเสร็จ'}
      </button>

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
