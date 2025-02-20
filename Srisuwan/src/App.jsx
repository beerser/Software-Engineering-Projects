import React, { useState } from "react";
import { supabase } from "../../Back-end/supabaseClient";
import Bannerbg from "./components/Bannerbg";
import Cards from "./components/Cards";
import Navbar from "./components/Navbar";
import Room from "./Room";
import Payment from "./Payment";
import Login from "./login";
import { AuthProvider } from "./components/AuthContext";
import Editadmin from "./editadmin";



import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  const [selectedItem, setSelectedItem] = useState(null);

  const [rooms, setRooms] = useState([
    {
      id: 1,
      title: "Room 101",
      url: "https://storage.googleapis.com/zmyhome-bucket/apartment/3799/12-20-2022-04-17-38307981238.jpg",
      content: "1200 Bath"
    },
    {
      id: 2,
      title: "Room 102",
      url: "https://storage.googleapis.com/zmyhome-bucket/apartment/3799/12-20-2022-04-17-38307981238.jpg",
      content: "500 Bath"
    }
  ]);


  const handlePaymentClick = (item) => {
    setSelectedItem(item);
  };



  return (
    <AuthProvider>
      <Router>
        <Navbar />
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

export default App;