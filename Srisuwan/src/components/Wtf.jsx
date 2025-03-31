import React, { useState, useEffect } from 'react';

const Wtf = () => {
  const [bookings, setBookings] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await fetch("http://localhost:5001/api/bookings");
        if (!response.ok) {
          throw new Error("Unable to fetch bookings");
        }
        const data = await response.json();
        setBookings(data);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      }
    };

    const fetchUsers = async () => {
      try {
        const response = await fetch("http://localhost:5001/api/user");
        if (!response.ok) {
          throw new Error("Unable to fetch users");
        }
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchBookings();
    fetchUsers();
  }, []);

  // Function to get user name from firstname and lastname
  const getUserName = (firstname, lastname) => {
    const user = users.find(
      (user) => user.firstname === firstname && user.lastname === lastname
    );
    return user ? user : null;
  };

  // Function to handle booking select
  const handleBookingSelect = (booking) => {
    setSelectedBooking(booking);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImageFile(file);
    }
  };

  const handleSubmit = async () => {
    if (!selectedBooking || !imageFile) {
      setMessage("Please select a booking and an image file.");
      return;
    }

    const user = getUserName(selectedBooking.user_firstname, selectedBooking.user_lastname);

    if (!user) {
      setMessage("No user found for the selected booking.");
      return;
    }

    const formData = new FormData();
    formData.append('image', imageFile);
    formData.append('bookingId', selectedBooking._id);

    // Assuming you have an endpoint to send the file to the user
    try {
      const response = await fetch('http://localhost:5001/api/upload-image', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        setMessage("Image uploaded successfully!");
      } else {
        setMessage("Error uploading image.");
      }
    } catch (error) {
      setMessage("Error connecting to the server.");
      console.error("Error uploading image:", error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Edit User Details</h2>

      {/* Select Booking */}
      <div className="mb-4">
        <label className="block text-lg font-medium text-gray-700 mb-2">Select Booking</label>
        <select
          onChange={(e) => {
            const selected = bookings.find((b) => b._id === e.target.value);
            handleBookingSelect(selected);
          }}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="">-- Select a booking --</option>
          {bookings.map((booking) => {
            const userName = getUserName(booking.user_firstname, booking.user_lastname);
            return (
              <option key={booking._id} value={booking._id}>
                {`${userName ? userName.firstname + " " + userName.lastname : "User not found"} - ${booking.room_number}`}
              </option>
            );
          })}
        </select>
      </div>

      {/* Show Selected Booking */}
      {selectedBooking && (
        <div className="mb-4">
          <h3 className="text-xl font-medium text-gray-700 mb-2">Booking Details</h3>
          <p><strong>Room Number:</strong> {selectedBooking.room_number}</p>
          <p><strong>Status:</strong> {selectedBooking.payment_status}</p>
        </div>
      )}

      {/* File Upload */}
      <div className="mb-4">
        <label className="block text-lg font-medium text-gray-700 mb-2">Select Image</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {/* Submit Button */}
      <button
        onClick={handleSubmit}
        className="w-full bg-indigo-500 text-white py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
      >
        Upload Image
      </button>

      {/* Message */}
      {message && <p className="mt-4 text-center text-lg text-red-600">{message}</p>}
    </div>
  );
};

export default Wtf;
