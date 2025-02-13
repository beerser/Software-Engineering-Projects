import React, { useState } from "react";
import Bannerbg from "./components/Bannerbg";
import Cards from "./components/Cards";
import Navbar from "./components/Navbar";
import Room from "./Room";
import Payment from "./Payment";
import Login from "./login";
import Editadmin from "./editadmin";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  const [selectedItem, setSelectedItem] = useState(null);

  const obj = [
    { title: "Room 101", url: "https://storage.googleapis.com/zmyhome-bucket/apartment/3799/12-20-2022-04-17-38307981238.jpg", content: "1200 Bath" },
    { title: "Room 102", url: "https://storage.googleapis.com/zmyhome-bucket/apartment/3799/12-20-2022-04-17-38307981238.jpg", content: "500 Bath" },
    { title: "Room 103", url: "https://storage.googleapis.com/zmyhome-bucket/apartment/3799/12-20-2022-04-17-38307981238.jpg", content: "2500 Bath" },
    { title: "Room 104", url: "https://storage.googleapis.com/zmyhome-bucket/apartment/3799/12-20-2022-04-17-38307981238.jpg", content: "1200 Bath" },
    { title: "Room 105", url: "https://storage.googleapis.com/zmyhome-bucket/apartment/3799/12-20-2022-04-17-38307981238.jpg", content: "1200 Bath" },
    { title: "Room 106", url: "https://storage.googleapis.com/zmyhome-bucket/apartment/3799/12-20-2022-04-17-38307981238.jpg", content: "1200 Bath" },
    { title: "Room 107", url: "https://storage.googleapis.com/zmyhome-bucket/apartment/3799/12-20-2022-04-17-38307981238.jpg", content: "1200 Bath" },
    { title: "Room 108", url: "https://storage.googleapis.com/zmyhome-bucket/apartment/3799/12-20-2022-04-17-38307981238.jpg", content: "1200 Bath" },
    { title: "Room 109", url: "https://storage.googleapis.com/zmyhome-bucket/apartment/3799/12-20-2022-04-17-38307981238.jpg", content: "1200 Bath" },
  ];

  const handlePaymentClick = (item) => {
    setSelectedItem(item);
  };

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route
          path="/"
          element={
            <>
              <h1><Bannerbg /></h1>
              <h1 style={{ height: "30px", fontSize: "35px",fontFamily:"Segoe UI", marginTop: "25px", marginLeft: "25px", marginBottom: "5px" }}>
                Available rooms
              </h1>
              <Cards obj={obj} onPaymentClick={handlePaymentClick} />
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
          element={<Editadmin />}
        />
      </Routes>
      
    </Router>
  );
}

export default App;
