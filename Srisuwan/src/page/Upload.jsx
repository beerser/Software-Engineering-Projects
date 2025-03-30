import React, { useState } from 'react';
import { useAuth } from '../components/AuthContext';
import { useLocation } from 'react-router-dom';

const Upload = () => {
  const { state } = useLocation();  
  const { user } = useAuth(); 
  const [message, setMessage] = useState('');

  const item = state?.item;  
  if (!item || !user) {
    return <p>ข้อมูลไม่ครบถ้วน โปรดกลับไปตรวจสอบข้อมูล.</p>;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    const file = e.target.elements.slip.files[0];
  
    if (!file) {
      setMessage('กรุณาเลือกไฟล์ก่อนส่ง');
      return;
    }
  
    if (!user || !user.firstname || !user.lastname) {
      setMessage('ไม่พบข้อมูลผู้ใช้');
      return;
    }
  
    if (!item.roomNumber) {
      setMessage('ไม่พบข้อมูลห้อง');
      return;
    }
  
    formData.append('slip', file);
    formData.append('user_firstname', user.firstname) 
    formData.append('user_lastname', user.lastname);
    formData.append('room_number', item.roomNumber);
  
    try {
      const response = await fetch('http://localhost:5001/booking', {
        method: 'POST',
        body: formData,
      });
  
      if (response.ok) {
        setMessage('ไฟล์อัปโหลดสำเร็จ! รอการอนุมัติจากผู้ดูแล');
      } else {
        const errorText = await response.text();
        setMessage(`เกิดข้อผิดพลาดในการอัปโหลดไฟล์: ${errorText}`);
      }
    } catch (error) {
      setMessage('เกิดข้อผิดพลาดในการเชื่อมต่อกับเซิร์ฟเวอร์');
    }
  };

  return (
    <div className="uploade-container">
      <form onSubmit={handleSubmit}>
        <label htmlFor="slip">เลือกสลีปเงินของคุณ:</label>
        <input type="file" id="slip" name="slip" accept="image/*, .pdf" required />
        <button type="submit">อัปโหลด</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default Upload;