import React, { useState, useEffect } from "react";
import bedlogo from "../assets/bed.svg";
import fanlogo from "../assets/fan.svg";
import bathroomlogo from "../assets/bathroom.svg";
import { useNavigate, useLocation } from "react-router-dom";
import "../css/Room.css";
import Footer from "../components/footer";

const Room = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [isBooked, setIsBooked] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const { item } = location.state || {};
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
  const [previewImage, setPreviewImage] = useState(thumbnails[0]);
  const [selectedImage, setSelectedImage] = useState(null);

  const handleBookRoom = () => {
    setIsBooked(true);
    navigate("/payment", { state: { item } });
  };

  return (
    <>
      <div className="room-container">
        <div className="header">
          <button onClick={() => navigate("/")} className="back-button-on-room-page">
            Back
          </button>
        </div>

        <div className="room-page">
          <div className="image-room-main">
            <img
              src={previewImage}
              alt={`Room ${item.room_number}`}
              className="room-image"
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
            <button className="confirm-button-on-room-page" onClick={handleBookRoom}>
              Book a room
            </button>
          </p>
        </div>

        <div className="room-info-on-room-page">
          <div className="room-info-on-room-item">
            <div>
              รายเดือน: <span className="room-info-on-room-item-2">{item.price} บาท/เดือน</span>
            </div>
            <hr />
            <div>ค่าน้ำ:</div>
            <hr />
            <div>ค่าไฟ:</div>
            <hr />
            <div>
              ค่าบริการ: <span className="room-info-on-room-item-2">{item.servicefee} บาท/เดือน</span>
            </div>
          </div>
        </div>
      </div>

      {selectedImage && (
        <div className="modal-overlay-on-room-page">
          <div className="preview-card-fot-room-page">
            <img src={selectedImage} alt="preview" className="modal-image" />
          </div>
          <button className="close-button" onClick={() => setSelectedImage(null)}>
            Click to go back
          </button>
        </div>
      )}

      <Footer />
    </>
  );
};

export default Room;