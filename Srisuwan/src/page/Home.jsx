import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"; 
import { AuthProvider, useAuth } from "../components/AuthContext";
import Navbar from "../components/Navbar";
import Bannerbg from "../components/Bannerbg";
import Cards from "../components/Cards";
import Room from "./Room";
import Payment from "./Payment";
import Admin from "./Admin";
import "../css/Home.css";
import Cardtext from "../components/Cardtext";
import Cardsexample from "../components/Cardsexample";
import Login from "./Login";
import Register from "./Register";
import Footer from "../components/footer";
import Neary from "../components/Neary";
import Roombooking from "./Roombooking";
import Upload from "./Upload";
import SrisuwanAnimation from "../components/SrisuwanAnimation";

// สร้างคอมโพเนนต์ Preloader สำหรับหน้าโหลด
const Preloader = () => {
  return (
    <div className="preloader">
      <div className="preloader-content">
        <div className="spinner"></div>
        <h2>กำลังโหลดเว็บไซต์</h2>
        <p>โปรดรอสักครู่...</p>
      </div>
    </div>
  );
};

function Home() {
  const [selectedItem, setSelectedItem] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showSrisuwanAnimation, setShowSrisuwanAnimation] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    // Check if the user is logging in for the first time
    const hasVisitedBefore = sessionStorage.getItem('hasVisitedBefore');
    
    if (!hasVisitedBefore && !user) {
      // Show Srisuwan animation only on first visit and when not logged in
      setShowSrisuwanAnimation(true);
      sessionStorage.setItem('hasVisitedBefore', 'true');
    } else {
      // Skip animation and just show loading
      setLoading(true);
      const timer = setTimeout(() => {
        setLoading(false);
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [user]);

  const handleAnimationComplete = () => {
    setShowSrisuwanAnimation(false);
    setLoading(true);
    
    const timer = setTimeout(() => {
      setLoading(false);
    }, 100);
    
    return () => clearTimeout(timer);
  };

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const token = localStorage.getItem('token');
  
        const response = await fetch('http://localhost:5001/api/rooms', {
          method: 'GET',
          headers: token ? { 'Authorization': `Bearer ${token}` } : {},  // ✅ เงื่อนไขตรงนี้
        });
  
        if (!response.ok) {
          throw new Error('Failed to fetch rooms');
        }
  
        const data = await response.json();
        setRooms(data);
        console.log(data);
      } catch (error) {
        console.error('Error fetching rooms:', error);
      }
    };
  
    fetchRooms();
  }, []);

  useEffect(() => {
    if (rooms.length > 0) {
      localStorage.setItem("rooms", JSON.stringify(rooms));  // Use the correct state here
    }
  }, [rooms]);  // Trigger when rooms state changes

  const handlePaymentClick = (paymentDetails) => {
    setSelectedItem(paymentDetails);
  };

  // แสดง Srisuwan Animation
  if (showSrisuwanAnimation) {
    return <SrisuwanAnimation onAnimationComplete={handleAnimationComplete} />;
  }

  // แสดง Preloader
  if (loading) {
    return <Preloader />;
  }

  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route
            path="/"
            element={<ProtectedRoute><HomePage rooms={rooms} handlePaymentClick={handlePaymentClick} /></ProtectedRoute>}
          />
          <Route
            path="/room"
            element={<Room item={selectedItem} />}
          />
          <Route
            path="/payment"
            element={<Payment />}
          />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register/>} />
          <Route
            path="/admin"
            element={<ProtectedRoute><Admin rooms={rooms} setRooms={setRooms} /></ProtectedRoute>}
          />
          <Route path="/upload" element={<Upload/>}/>
          <Route
            path="/information"
            element={<Roombooking/>}/>
         
          <Route path="/information/:pageName" element={<Roombooking />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  // if (!user) {
  //   return <Navigate to="/login" />;
  // }

  return children;
};

const HomePage = ({ rooms, handlePaymentClick }) => {
  return (
    <>
      <h1><Bannerbg /></h1>
      <h1 className="texthome">
        Available rooms
      </h1>
      
      <Cards obj={rooms} onPaymentClick={handlePaymentClick} />
      <h1 className="texthome">
        Hightlights of this apartment
      </h1>
      <Cardtext></Cardtext>
      <Neary/>
      <h1 className="texthomecenter">Key Features of the Room</h1>
      <h2 className ="texthomecenter-small">Things avaiilable in the room</h2>
      <Cardsexample></Cardsexample>
      <Footer/>
    </>
  );
};

export default Home;