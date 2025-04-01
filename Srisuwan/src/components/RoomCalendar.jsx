import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "../css/RoomCalendar.css";
import "react-calendar/dist/Calendar.css";

const RoomCalendar = ({ rooms }) => {
  const [date, setDate] = useState(new Date());
  const [bookedDates, setBookedDates] = useState([]);

  useEffect(() => {
    // Fetch bookings from API
    const fetchBookings = async () => {
      const response = await fetch("http://localhost:5001/api/bookings");
      const data = await response.json();

      // Filter only confirmed bookings
      const confirmedBookings = data.filter(room => room.payment_status === "confirmed");

      // Create an array of all booked dates
      const dates = confirmedBookings.map(booking => {
        const createdAt = new Date(booking.created_at);
        return new Date(createdAt.setHours(0, 0, 0, 0)); // Only keep the date part
      });

      // Set booked dates if they are different from the previous state
      setBookedDates(prevDates => {
        const newDates = dates;
        if (newDates.length !== prevDates.length || !newDates.every((date, i) => date.getTime() === prevDates[i]?.getTime())) {
          return newDates;
        }
        return prevDates; // If no change, return previous dates
      });
    };

    fetchBookings();
  }, []); // Empty dependency array to run once on component mount

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
        tileDisabled={({ date }) => isBooked(date)} 
      />
      <div className="legend">
        <span><span className="dot booked-dot"></span> Booked</span>
        <span><span className="dot free-dot"></span> Available</span>
      </div>
    </div>
  );
};

export default RoomCalendar;
