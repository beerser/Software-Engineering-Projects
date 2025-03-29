import React, { useState, useEffect } from "react";
import Footer from "../components/footer";
import "../css/Roombooking.css";
import axios from "axios";
import { useAuth } from "../components/AuthContext";

const Roombooking = () => {
  const { user } = useAuth(); // ดึงข้อมูลผู้ใช้จาก context
  const [isEditing, setIsEditing] = useState(false); // สถานะการแก้ไข
  const [activePage, setActivePage] = useState("allroomreservations");
  const [userData, setUserData] = useState({
    firstname: user ? user.firstname : "",
    lastname: user ? user.lastname : "",
    email: user ? user.email : "",
    phoneNumber: user ? user.phoneNumber : "",
  });

  useEffect(() => {
    if (user) {
      setUserData({
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        phoneNumber: user.phoneNumber,
      });
    }
  }, [user]);

  const handleEditClick = () => {
    setIsEditing(true); // เปิดโหมดแก้ไขเมื่อคลิกปุ่ม
  };

  const handleSave = async () => {
    const token = localStorage.getItem('token');  // ดึง token จาก localStorage หรือที่ที่คุณเก็บไว้
  
    if (!token) {
      console.log("Token not found!");  // ถ้าไม่มี token
      return;
    }
  
    try {
      const response = await axios.put(
        "http://localhost:5001/api/user/update",  // ใช้ URL ที่ถูกต้อง
        {
          firstname: userData.firstname,
          lastname: userData.lastname,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,  // ส่ง JWT token ใน header
          },
        }
      );
  
      console.log("User updated:", response.data);
      setIsEditing(false);  // ปิดโหมดการแก้ไข
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };
  
  
  

  const handleCancel = () => {
    setIsEditing(false); // ยกเลิกการแก้ไข
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const renderContent = () => {
    switch (activePage) {
      case "allroomreservations":
        return (
          <section className="room-reservations">
            <p>All room reservations</p>
          </section>
        );
      case "personalinformations":
        if (user) {
          return (
            <section className="personal-info">
              <div className="info-item-users">
                <div className="user-info">
                  <p className="userr">Username</p>
                  {isEditing ? (
                    <div>
                      <input
                        type="text"
                        name="firstname"
                        value={userData.firstname || ""}
                        onChange={handleChange}
                        placeholder="First Name"
                      />
                      <input
                        type="text"
                        name="lastname"
                        value={userData.lastname || ""}
                        onChange={handleChange}
                        placeholder="Last Name"
                      />
                    </div>
                  ) : (
                    <p>{userData.firstname} {userData.lastname}</p>
                  )}
                </div>
                <div>
                  {isEditing ? (
                    <div>
                      <button className="cancel-btn" onClick={handleCancel}>Cancel</button>
                      <button className="confirm-btn" onClick={handleSave}>Confirm</button>
                    </div>
                  ) : (
                    <button className="edit-btn" onClick={handleEditClick}>Edit</button>
                  )}
                </div>
              </div>
              <div className="info-item-user">
                <p>Email</p>
                <p>{user.email}</p>
              </div>
              <div className="info-item-user">
                <p>Phone number</p>
                <p>{user.phoneNumber}</p>
              </div>
            </section>
          );
        } else {
          return <p>Loading...</p>;  // แสดงข้อความ "Loading..." หากข้อมูลผู้ใช้ยังไม่โหลด
        }
      default:
        return <p>Select a page from the menu.</p>;
    }
  };

  return (
    <>
      <div className="container">
        <aside className="sidebar">
          <ul>
            <li
              onClick={() => setActivePage("allroomreservations")}
              className="sidebar-item"
            >
              All Room Reservations
            </li>
            <li
              onClick={() => setActivePage("personalinformations")}
              className="sidebar-item"
            >
              Personal Information
            </li>
          </ul>
        </aside>

        <main className="main-content">{renderContent()}</main>
      </div>

      <Footer />
    </>
  );
};

export default Roombooking;
