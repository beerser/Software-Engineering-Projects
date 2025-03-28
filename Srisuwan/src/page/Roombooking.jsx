import React, { useState, useEffect } from "react";
import Footer from "../components/footer";
import "../css/Roombooking.css";
import Edit from "../assets/edit.svg"; // สมมุติว่าไฟล์นี้คือไอคอนที่ใช้
import { useAuth } from "../components/AuthContext"; // ใช้สำหรับ Authentication ถ้ามี

const Roombooking = () => {
  const { user } = useAuth(); // ดึงข้อมูล user จาก useAuth
  const [activePage, setActivePage] = useState("allroomreservations"); // กำหนด activePage

  const renderContent = () => {
    switch (activePage) {
      case "allroomreservations":
        return (
          <div>
            <h2>All room reservations</h2>
            {/* เพิ่มเนื้อหาที่เกี่ยวข้องกับการจองห้อง */}
          </div>
        );
      case "personalinformations":
        // ตรวจสอบว่า user มีข้อมูลหรือไม่ก่อนที่จะแสดง
        if (user) {
          return (
            <div>
              <h2>Personal Information</h2>
              <h4>Username: {user.firstname} {user.lastname}</h4>
              <h4>Email: {user.email}</h4>
              <h4>Phone number: {user.phoneNumber}</h4>
            </div>
          );
        } else {
          return <div>Loading...</div>; // กรณีที่ user ยังไม่โหลด
        }
      default:
        return <div>Select a page from the menu.</div>;
    }
  };

  return (
    <>
      <div>
        <aside className="sidebar">
          <ul>
            <li
              onClick={() => setActivePage("allroomreservations")}
              style={{ cursor: "pointer" }}
            >
              <img
                src={Edit}
                alt="Edit Icon"
                style={{ width: "20px", marginRight: "10px" }}
              />
              All Room Reservations
            </li>
            <li
              onClick={() => setActivePage("personalinformations")}
              style={{ cursor: "pointer" }}
            >
              <img
                src={Edit}
                alt="Edit Icon"
                style={{ width: "20px", marginRight: "10px" }}
              />
              Personal Information
            </li>
          </ul>
        </aside>

        <main className="main-content">
          <section className="content">{renderContent()}</section>
        </main>
      </div>

      <Footer />
    </>
  );
};

export default Roombooking;
