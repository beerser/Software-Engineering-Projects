import React, { useState } from 'react';
import { useAuth } from '../components/AuthContext';
import { useLocation, useNavigate } from 'react-router-dom';
import '../css/Upload.css';

const Upload = () => {
  const { state } = useLocation();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [fileName, setFileName] = useState('');

  // ตรวจสอบข้อมูลที่จำเป็น
  if (!state?.item || !user) {
    return (
      <div className="error-container">
        <h2>ข้อมูลไม่ครบถ้วน</h2>
        <p>โปรดกลับไปตรวจสอบข้อมูลอีกครั้ง</p>
        <button 
          onClick={() => navigate(-1)} 
          className="back-button"
        >
          กลับไปหน้าก่อนหน้า
        </button>
      </div>
    );
  }

  const item = state.item;

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileName(file.name);
    } else {
      setFileName('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');
    
    const formData = new FormData();
    const file = e.target.elements.slip.files[0];
  
    if (!file) {
      setMessage('กรุณาเลือกไฟล์สลิปก่อนส่ง');
      setIsLoading(false);
      return;
    }
  
    if (!user || !user.firstname || !user.lastname) {
      setMessage('ไม่พบข้อมูลผู้ใช้ โปรดเข้าสู่ระบบใหม่อีกครั้ง');
      setIsLoading(false);
      return;
    }
  
    if (!item.roomNumber) {
      setMessage('ไม่พบข้อมูลห้อง โปรดเลือกห้องใหม่อีกครั้ง');
      setIsLoading(false);
      return;
    }
  
    formData.append('slip', file);
    formData.append('user_firstname', user.firstname);
    formData.append('user_lastname', user.lastname);
    formData.append('room_number', item.roomNumber);
  
    try {
      const response = await fetch('http://localhost:5001/booking', {
        method: 'POST',
        body: formData,
      });
  
      if (response.ok) {
        setMessage('อัปโหลดสลิปสำเร็จ! รอการตรวจสอบและอนุมัติจากผู้ดูแลระบบ');
      } else {
        const errorText = await response.text();
        setMessage(`เกิดข้อผิดพลาด: ${errorText}`);
      }
    } catch (error) {
      setMessage('เกิดข้อผิดพลาดในการเชื่อมต่อกับเซิร์ฟเวอร์ โปรดลองใหม่อีกครั้ง');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="upload-container">
      <h2>อัปโหลดสลิปการชำระเงิน</h2>
      
      <div className="booking-info">
        <h3>ข้อมูลการจอง</h3>
        <p>ห้อง: <span>{item.roomNumber}</span></p>
        <p>ผู้จอง: <span>{user.firstname} {user.lastname}</span></p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="file-upload-wrapper">
          <label htmlFor="slip">เลือกสลิปการชำระเงิน:</label>
          
          <div className="file-input-container">
            <input 
              type="file" 
              id="slip" 
              name="slip" 
              accept="image/*, .pdf" 
              required 
              onChange={handleFileChange}
              className="file-input"
            />
            <div className="custom-file-upload">
              <div className="upload-icon"></div>
              <p className="file-name">
                {fileName ? fileName : 'คลิกเพื่อเลือกไฟล์ หรือลากไฟล์มาวาง'}
              </p>
              <p className="file-hint">รองรับไฟล์ภาพและ PDF</p>
            </div>
          </div>
        </div>

        <button 
          type="submit" 
          disabled={isLoading} 
          className={`submit-button ${isLoading ? 'loading' : ''}`}
        >
          {isLoading ? 'กำลังอัปโหลด...' : 'อัปโหลดสลิป'}
        </button>
      </form>

      {message && (
        <div className={`message ${message.includes('สำเร็จ') ? 'success' : 'error'}`}>
          {message}
        </div>
      )}
      
      <div className="navigation">
        <button 
          onClick={() => navigate(-1)} 
          className="back-link"
        >
          &larr; กลับไปหน้าก่อนหน้า
        </button>
      </div>
    </div>
  );
};

export default Upload;