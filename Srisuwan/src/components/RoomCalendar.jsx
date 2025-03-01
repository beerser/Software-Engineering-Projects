import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

const RoomCalendar = ({ rooms }) => {
  const [date, setDate] = useState(new Date());
  
  const handleDateChange = (newDate) => {
    setDate(newDate);
  };

  return (
    <div style={{ width: "60%", margin: "20px auto" }}>
      <h3>Room Booking Calendar</h3>
      <Calendar onChange={handleDateChange} value={date} />
    </div>
  );
};

export default RoomCalendar;
