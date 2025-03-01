import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useLocation, Navigate } from "react-router-dom"; 
import { AuthProvider, useAuth } from "./components/AuthContext"; // Import useAuth from AuthContext
import Navbar from "./components/Navbar";
import Bannerbg from "./components/Bannerbg";
import Cards from "./components/Cards";
import Room from "./Room";
import Payment from "./Payment";
import Login from "./login";
import Editadmin from "./editadmin";

function App() {
  const [selectedItem, setSelectedItem] = useState(null);
  const [rooms, setRooms] = useState([]);

  // UseEffect to initialize rooms from localStorage
  useEffect(() => {
    const storedRooms = localStorage.getItem("rooms");
    if (storedRooms) {
      setRooms(JSON.parse(storedRooms));
    } else {
      setRooms([
        {
          id: 1,
          title: "Room 101",
          url: "https://storage.googleapis.com/zmyhome-bucket/apartment/3799/12-20-2022-04-17-38307981238.jpg",
          content: "1200 Bath",
        },
        {
          id: 2,
          title: "Room 102",
          url: "https://storage.googleapis.com/zmyhome-bucket/apartment/3799/12-20-2022-04-17-38307981238.jpg",
          content: "500 Bath",
        },
      ]);
    }
  }, []);

  // Update rooms in localStorage when rooms state changes
  useEffect(() => {
    localStorage.setItem("rooms", JSON.stringify(rooms));
  }, [rooms]);

  // Handle payment click to select room
  const handlePaymentClick = (item) => {
    setSelectedItem(item);
  };

  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          {/* Protected Route for Home */}
          <Route
            path="/"
            element={<ProtectedRoute><Home rooms={rooms} handlePaymentClick={handlePaymentClick} /></ProtectedRoute>}
          />
          <Route
            path="/room"
            element={<Room item={selectedItem} />}
          />
          <Route
            path="/payment"
            element={<Payment />}
          />
          <Route
            path="/login"
            element={<Login />}
          />
          <Route
            path="/editroom"
            element={<ProtectedRoute><Editadmin rooms={rooms} setRooms={setRooms} /></ProtectedRoute>}
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

// ProtectedRoute component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) {
    return <div>Loading...</div>; // สามารถแสดง loading ระหว่างการโหลดข้อมูลผู้ใช้
  }

  // ถ้าผู้ใช้ไม่ได้ล็อกอินให้ไปหน้า login
  if (!user) {
    return <Navigate to="/login" />;
  }

  return children;
};

// Home component
const Home = ({ rooms, handlePaymentClick }) => {
  return (
    <>
      <h1><Bannerbg /></h1>
      <h1 style={{ height: "30px", fontSize: "35px", fontFamily: "Segoe UI", marginTop: "25px", marginLeft: "25px", marginBottom: "5px" }}>
        Available rooms
      </h1>
      <Cards obj={rooms} onPaymentClick={handlePaymentClick} />
    </>
  );
};

export default App;
