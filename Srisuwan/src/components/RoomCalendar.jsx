import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "../css/RoomCalendar.css";
import "react-calendar/dist/Calendar.css";

const RoomCalendar = ({ rooms }) => {
  const [date, setDate] = useState(new Date());
  const [bookedDates, setBookedDates] = useState([]);

  useEffect(() => {
    const confirmedDates = rooms
      .filter(room => room.payment_status === "confirmed")
      .map(room => {
        const date = new Date(room.created_at);
        return new Date(date.setHours(0, 0, 0, 0));
      });
    
    setBookedDates(confirmedDates);
  }, [rooms]);

  const isBooked = (date) => {
    return bookedDates.some(bookedDate => 
      bookedDate.getDate() === date.getDate() &&
      bookedDate.getMonth() === date.getMonth() &&
      bookedDate.getFullYear() === date.getFullYear()
    );
  };

  return (
    <div className="calendar-box">
      <h3>Room Availability</h3>
      <Calendar
        onChange={setDate}
        value={date}
        tileClassName={({ date }) => isBooked(date) ? 'booked' : 'free'}
      />
      <div className="legend">
        <span><span className="dot booked-dot"></span> Booked</span>
        <span><span className="dot free-dot"></span> Available</span>
      </div>
    </div>
  );
};

export default RoomCalendar;