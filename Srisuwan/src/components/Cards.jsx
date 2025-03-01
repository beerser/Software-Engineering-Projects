import React from "react";
import { useNavigate } from "react-router-dom";

const Cards = ({ obj, onPaymentClick }) => {
  const navigate = useNavigate();

  const handleRentClick = (item) => {
    const paymentDetails = {
      roomNumber: item.title,
      price: item.content,
      imageUrl: item.url,
      timestamp: new Date().toLocaleString(),
      bookingId: `BK${Math.random().toString(36).substr(2, 9)}`.toUpperCase()
    };

    onPaymentClick(paymentDetails);
    navigate("/room", { state: { item: paymentDetails } }); 
  };

  return (
    <div
      style={{
        display: "flex",
        gap: "1rem",
        overflowX: "scroll",
        scrollSnapType: "x mandatory",
        padding: "1rem",
        scrollbarWidth: "none",
        msOverflowStyle: "none",
      }}
      className="scroll-container"
    >
{obj.map((item, index) => {
  console.log("Item in Cards:", item); // ตรวจสอบข้อมูลแต่ละห้อง
  return (
    <div
      key={index}
      className="card"
      style={{
        width: "13rem",
        padding: "10px",
        scrollSnapAlign: "start",
        flex: "0 0 auto",
        borderRadius: "15px",
        margin: "7px",
        boxShadow: "5px 5px 15px rgba(0, 0, 0, 0.1)",
      }}
    >
      <img src={item.url} className="card-img-top" alt={item.title} style={{ width: "100%", height: "150px", objectFit: "cover" }} />
      <div className="card-body">
        <h5 className="card-title">{item.title}</h5>
        <p className="card-text">{item.content}</p>
        <button
          className="btn btn-primary"
          onClick={() => handleRentClick(item)}
        >
          เช่า
        </button>
      </div>
    </div>
  );
})}
    </div>
  );
};

export default Cards;
