import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from "react-router-dom"; // Import useLocation
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
        <DashboardButton /> {/* Include the DashboardButton here */}
        <Routes>
          <Route
            path="/"
            element={
              <>
                <h1><Bannerbg /></h1>
                <h1 style={{ height: "30px", fontSize: "35px", fontFamily: "Segoe UI", marginTop: "25px", marginLeft: "25px", marginBottom: "5px" }}>
                  Available rooms
                </h1>
                <Cards obj={rooms} onPaymentClick={handlePaymentClick} />
              </>
            }
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
            element={<Editadmin rooms={rooms} setRooms={setRooms} />}
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

// DashboardButton Component
const DashboardButton = () => {
  const { user } = useAuth();
  const location = useLocation();

  // Only show the button if the user is an admin and not currently on the dashboard page
  if (!user || user.role !== "admin" || location.pathname === "/editroom") {
    return null;
  }

  return (
    <Link to="/editroom" className="dashboard-button">
      Go to Dashboard
    </Link>
  );
};

export default App;
