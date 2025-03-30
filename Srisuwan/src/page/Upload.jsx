import React, { useState } from 'react';

const Upload = () => {
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('slip', e.target.elements.slip.files[0]);
  
    try {
      const response = await fetch('http://localhost:5001/upload', {
        method: 'POST',
        body: formData,
      });
      
      if (response.ok) {
        setMessage('ไฟล์อัปโหลดสำเร็จ!');
      } else {
        setMessage('เกิดข้อผิดพลาดในการอัปโหลดไฟล์');
      }
    } catch (error) {
      setMessage('เกิดข้อผิดพลาดในการเชื่อมต่อกับเซิร์ฟเวอร์');
    }
  };
  

  return (
    <div>
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
