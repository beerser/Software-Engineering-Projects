import React, { useEffect, useState } from 'react';

const Managepay = () => {
  const [files, setFiles] = useState([]);

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

  // เรียกฟังก์ชันดึงข้อมูลไฟล์เมื่อหน้าเว็บโหลด
  useEffect(() => {
    fetchFiles();
  }, []);

  return (
    <div>
      <h2>จัดการการชำระเงิน</h2>

      {/* แสดงรายการไฟล์ที่อัปโหลด */}
      {files.length > 0 ? (
        <div>
          <h3>รายการไฟล์ที่อัปโหลด:</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap' }}>
            {files.map((file, index) => {
              const fileUrl = `http://localhost:5001/uploads/${file}`;
              const isImage = file.endsWith('.png') || file.endsWith('.jpg') || file.endsWith('.jpeg');
              return (
                <div key={index} style={{ margin: '10px' }}>
                  {/* หากไฟล์เป็นภาพให้แสดงภาพ */}
                  {isImage ? (
                    <img
                      src={fileUrl}
                      alt={file}
                      style={{ width: '200px', height: 'auto', borderRadius: '5px' }}
                    />
                  ) : (
                    // ถ้าไม่ใช่ภาพให้แสดงเป็นลิงก์
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
    </div>
  );
};

export default Managepay;
