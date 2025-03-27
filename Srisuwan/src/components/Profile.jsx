import React, { useState } from "react";
import "../css/Profile.css"; // สไตล์ CSS สำหรับโปรไฟล์

const Profile = () => {
  const [isModalOpen, setIsModalOpen] = useState(true); // ใช้ state ในการเปิด/ปิด modal

  const closeModal = () => {
    setIsModalOpen(false); // ปิด modal
  };

  return (
    <>
      {isModalOpen && (
        <div id="myModal" className="modal">
          <div className="modal-content">
            <span className="close" onClick={closeModal}>
              &times;
            </span>
            <div className="bg-white p-10 rounded-lg shadow-lg">
              <h3>User Profile</h3>
              <div className="user-details">
                <p>Name: Antony P. Johnson</p>
                <p>Job Title: UX/UI Designer</p>
                <p>Company: Company Name Ltd.</p>
                <p>Email: antony.johnson@email.com</p>
                <p>Phone: 123-456-7890</p>
              </div>
              <div className="sm:flex sm:flex-row-reverse flex gap-4">
                <button className="save-button" type="button">
                  Save changes
                </button>
                <button className="cancel-button" type="button" onClick={closeModal}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Profile;
