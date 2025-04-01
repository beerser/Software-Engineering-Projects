import React, { useState, useEffect } from "react";
import bedlogo from "../assets/bed.svg";
import fanlogo from "../assets/fan.svg";
import bathroomlogo from "../assets/bathroom.svg";
import { useNavigate, useLocation } from "react-router-dom";
import "../css/Room.css";
import Footer from "../components/footer";

const Room = () => {
  useEffect(() => {
    window.scrollTo(0, 0); // ✅ บังคับให้ scroll ขึ้นบนสุดตอนเปิดหน้า
  }, []);
  const [isBooked, setIsBooked] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const { item } = location.state || {};
  console.log(item);
  if (!item) {
    return (
      <div className="error-container">
        <p>No room selected</p>
        <button onClick={() => navigate("/")} className="back-button">
          Return to rooms
        </button>
      </div>
    );
  }


  const thumbnails = item.image_urls || [];

  const [previewImage, setPreviewImage] = useState(thumbnails[0]); // ภาพหลัก
  const [selectedImage, setSelectedImage] = useState(null); 

  const handleBookRoom = () => {
    setIsBooked(true);
    navigate("/payment", { state: { item } });
  };
  
  return (
    <>
      <div className="room-container">
        <div className="header">
          <button
            onClick={() => navigate("/")}
            className="back-button-on-room-page"
          >
            Back
          </button>
        </div>

        <div className="room-page">
          <div className="image-room-main">
            <img
              src={previewImage}
              alt={`Room ${item.room_number}`}
              className="room-image"
              style={{ cursor: "pointer" }}
              onClick={() => setSelectedImage(previewImage)}
            />
            <div className="thumbnail-container">
              {thumbnails.map((url, index) => (
                <img
                  key={index}
                  src={url}
                  alt={`Thumbnail ${index}`}
                  className="thumbnail-image"
                  onClick={() => setPreviewImage(url)}
                  style={{ cursor: "pointer" }}
                />
              ))}
            </div>
          </div>

          <div className="room-details-on-page">
            <h2>{item.roomNumber}</h2>
            <p>{item.price} Baht</p>
            <hr />

            <div className="icon-container">
              <div className="icon-item">
                <img src={bedlogo} alt="Furniture" />
                <p>Furniture - Wardrobe, Bed</p>
              </div>
              <div className="icon-item">
                <img src={fanlogo} alt="Fan" />
                <p>Fan</p>
              </div>
              <div className="icon-item">
                <img src={bathroomlogo} alt="Bathroom" />
                <p>Bathroom</p>
              </div>
            </div>
          </div>
        </div>

        <div className="Detailed">
          <p className="detail-text">
            <strong>Detail</strong>
            <br />
            {item.description || "No description available"}
            <button
              className="confirm-button-on-room-page"
              onClick={handleBookRoom}
            >
              Book a room
            </button>
          </p>
        </div>
        <div className="room-info-on-room-page">
          <div className="room-info-on-room-item">
          <div>รายเดือน: <span className="room-info-on-room-item-2">{item.price} บาท/เดือน</span></div>
          <hr />
          <div>ค่าน้ำ:</div>
          <hr />
          <div>ค่าไฟ:</div>
          <hr />
          <div>ค่าบริการ:<span className="room-info-on-room-item-2">{item.servicefee} บาท/เดือน</span></div>
          </div>
        </div>
      </div>

      {selectedImage && (
  <div
    className="modal-overlay"
    style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100vw",
      height: "100vh",
      backgroundColor: "rgba(0, 0, 0, 0.8)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 1000,
    }}
  >
    {/* ✅ ปุ่มกากบาทอยู่ขวาบนของหน้าจอ */}
    <button
      onClick={() => setSelectedImage(null)}
      style={{
        position: "fixed",        // เปลี่ยนจาก absolute → fixed
        top: "20px",
        right: "25px",
        fontSize: "1.8rem",
        background: "transparent",
        border: "none",
        borderRadius: "50%",
        color: "#ffffff",
        cursor: "pointer",
        fontWeight: "bold",
        padding: 0,
        lineHeight: 1,
        zIndex: 1001,
      }}
    >
      ×
    </button>

    <div
      style={{
        display: "inline-block",
      }}
    >
      <img
        src={selectedImage}
        alt="preview"
        style={{
          maxWidth: "90vw",
          maxHeight: "90vh",
          borderRadius: "10px",
          boxShadow: "0 0 10px rgba(255,255,255,0.3)",
        }}
      />
    </div>
  </div>
)}

      <Footer />
    </>
  );
};

export default Room;
