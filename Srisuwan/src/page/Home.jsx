import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useLocation, Navigate } from "react-router-dom"; 
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


function Home() {
  const [selectedItem, setSelectedItem] = useState(null);
  const [rooms, setRooms] = useState([
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
      content: "1000 Bath",
    },{
      id: 3,
      title: "Room 103",
      url: "https://storage.googleapis.com/zmyhome-bucket/apartment/3799/12-20-2022-04-17-38307981238.jpg",
      content: "700 Bath",
    },{
      id: 4,
      title: "Room 104",
      url: "https://storage.googleapis.com/zmyhome-bucket/apartment/3799/12-20-2022-04-17-38307981238.jpg",
      content: "500 Bath",
    },{
      id: 5,
      title: "Room 105",
      url: "https://storage.googleapis.com/zmyhome-bucket/apartment/3799/12-20-2022-04-17-38307981238.jpg",
      content: "400 Bath",
    },{
      id: 6,
      title: "Room 106",
      url: "https://storage.googleapis.com/zmyhome-bucket/apartment/3799/12-20-2022-04-17-38307981238.jpg",
      content: "400 Bath",
    },{
      id: 7,
      title: "Room 107",
      url: "https://storage.googleapis.com/zmyhome-bucket/apartment/3799/12-20-2022-04-17-38307981238.jpg",
      content: "400 Bath",
    }
  ]);

  useEffect(() => {
    localStorage.setItem("rooms", JSON.stringify(rooms));
  }, [rooms]);

  const handlePaymentClick = (paymentDetails) => {
    setSelectedItem(paymentDetails);
  };

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
      <h2 className="texthomecenter-small">Things avaiilable in the room</h2>
      <Cardsexample></Cardsexample>
      <Footer/>
    </>
  );
};


export default Home;
