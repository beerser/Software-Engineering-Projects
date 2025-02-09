import React, { useState } from "react";
import Bannerbg from "./components/Bannerbg";
import Cards from "./components/Cards";
import Navbar from "./components/Navbar";
import Room from "./Room";

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedItem, setSelectedItem] = useState(null);
  
  const [obj, setObj] = useState([
    {title:"Room 101", url:"https://storage.googleapis.com/zmyhome-bucket/apartment/3799/12-20-2022-04-17-38307981238.jpg", content:"1200 Bath"},
    {title:"Room 102", url:"https://storage.googleapis.com/zmyhome-bucket/apartment/3799/12-20-2022-04-17-38307981238.jpg", content:"1200 Bath"},
    {title:"Room 103", url:"https://storage.googleapis.com/zmyhome-bucket/apartment/3799/12-20-2022-04-17-38307981238.jpg", content:"1200 Bath"},
    {title:"Room 104", url:"https://storage.googleapis.com/zmyhome-bucket/apartment/3799/12-20-2022-04-17-38307981238.jpg", content:"1200 Bath"},
    {title:"Room 105", url:"https://storage.googleapis.com/zmyhome-bucket/apartment/3799/12-20-2022-04-17-38307981238.jpg", content:"1200 Bath"},
    {title:"Room 106", url:"https://storage.googleapis.com/zmyhome-bucket/apartment/3799/12-20-2022-04-17-38307981238.jpg", content:"1200 Bath"},
    {title:"Room 107", url:"https://storage.googleapis.com/zmyhome-bucket/apartment/3799/12-20-2022-04-17-38307981238.jpg", content:"1200 Bath"},
    {title:"Room 108", url:"https://storage.googleapis.com/zmyhome-bucket/apartment/3799/12-20-2022-04-17-38307981238.jpg", content:"1200 Bath"},
    {title:"Room 109", url:"https://storage.googleapis.com/zmyhome-bucket/apartment/3799/12-20-2022-04-17-38307981238.jpg", content:"1200 Bath"},
  ]);

  const handlePaymentClick = (item) => {
    setSelectedItem(item);
    setCurrentPage('Room');
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return (
          <>
            <h1><Bannerbg/></h1>
            <h1 style={{ 
              height: "30px",
              fontSize: "35px",
              marginTop: "25px",
              marginLeft: "25px",
              marginBottom: "5px"
            }}>
              Available rooms
            </h1>
            <Cards obj={obj} onPaymentClick={handlePaymentClick} />
          </>
        );
      case 'Room':
        return (
          <Room
            item={selectedItem} 
            onBackClick={() => setCurrentPage('home')} 
          />
        );
      default:
        return null;
    }
  };

  return (
    <>
      <h1><Navbar onHomeClick={() => setCurrentPage('home')} /></h1>
      {renderPage()}
    </>
  );
}

export default App;
