import React, { useState, useEffect } from "react";
import Footer from "../components/footer";
import "../css/Roombooking.css";
import axios from "axios";
import { useAuth } from "../components/AuthContext";

const Roombooking = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false); 
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
    setIsEditing(true); 
  };

  const handleSave = async () => {
    const token = localStorage.getItem('token');  
  
    if (!token) {
      console.log("Token not found!"); 
      return;
    }
  
    try {
      const response = await axios.put(
        "http://localhost:5001/api/user/update",  
        {
          firstname: userData.firstname,
          lastname: userData.lastname,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, 
          },
        }
      );
  
      console.log("User updated:", response.data);
      setIsEditing(false);  
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };
  
  
  

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const renderContent = () => {
    switch (activePage) {
      case "allroomreservations":
        return (
          <section className="info-item-rooms">
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
                    <div className="userrrr">
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
                <div className="bttcontir">
                  {isEditing ? (
                    <div className="btcontir">
                      <button className="cancel-btn" onClick={handleCancel}>Cancel</button>
                      <button className="confirm-btn" onClick={handleSave}>Confirm</button>
                    </div>
                  ) : (
                    <button className="edit-btn" onClick={handleEditClick}>Edit</button>
                  )}
                </div>
              </div>
              <div className="info-item-user">
                <p className="userrr">Email</p>
                <p className="userrrr">{user.email}</p>
              </div>
              <div className="info-item-user">
                <p className="userrr">Phone number</p>
                <p className="userrrr">{user.phoneNumber}</p>
              </div>
            </section>
          );
        } else {
          return <p>Loading...</p>;  
        }
      default:
        return <p>Select a page from the menu.</p>;
    }
  };

  return (
    <>
      <div className="containere">
        <aside className="sidebare">
          <ul>
            <li
              onClick={() => setActivePage("allroomreservations")}
              className="sidebare-item"
            >
              All Room Reservations
            </li>
            <li
              onClick={() => setActivePage("personalinformations")}
              className="sidebare-item"
            >
              Personal Information
            </li>
          </ul>
        </aside>

        <main className="main-contente">{renderContent()}</main>
      </div>

      <Footer />
    </>
  );
};

export default Roombooking;
