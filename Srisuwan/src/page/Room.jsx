import React, { useState } from "react";
import bedlogo from "../assets/bed.svg";
import fanlogo from "../assets/fan.svg";
import bathroomlogo from "../assets/bathroom.svg";
import { useNavigate, useLocation } from "react-router-dom";
import "../css/Room.css";
import Footer from "../components/footer";

const Room = () => {
  const [isBooked, setIsBooked] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const { item } = location.state || {};
  console.log(item)
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

  const handleBookRoom = () => {
    setIsBooked(true);
    navigate("/payment", { state: { item } });
  };

  const thumbnails = [1, 2, 3, 4, 5].map((i) => item.imageUrl);

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
              src={item.imageUrl}
              alt={`Room ${item.roomNumber}`}
              className="room-image"
            />
            <div className="thumbnail-container">
              {thumbnails.map((url, index) => (
                <img
                  key={index}
                  src={url}
                  alt={`Thumbnail ${index}`}
                  className="thumbnail-image"
                  onClick={() => setSelectedImage(url)}
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
    <strong>Detail</strong><br />
    {item.description || "No description available"}
    <button className="confirm-button-on-room-page" onClick={handleBookRoom}>
      Book a room
    </button>
  </p>
</div>
      </div>

      {selectedImage && (
        <div
          className="modal-overlay"
          onClick={() => setSelectedImage(null)}
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "50vw",
            height: "50vh",
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
            borderRadius: "8px",
          }}
        >
          <img
            src={selectedImage}
            style={{ maxWidth: "100%", maxHeight: "100%", borderRadius: "5px" }}
            alt="preview"
          />
        </div>
      )}

      <Footer />
    </>
  );
};

export default Room;
