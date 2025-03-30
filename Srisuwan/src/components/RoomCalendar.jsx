import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "../css/RoomCalendar.css";
import "react-calendar/dist/Calendar.css";

const RoomCalendar = ({ rooms }) => {
  const [date, setDate] = useState(new Date());
  const [bookedDates, setBookedDates] = useState([]);

  useEffect(() => {
    // Only consider confirmed bookings
    const confirmedBookings = rooms.filter(room => room.payment_status === "confirmed");
    
    // Create an array of all booked dates
    // Assuming each booking has check_in and check_out dates
    const dates = [];
    
    confirmedBookings.forEach(booking => {
      // If your booking object includes actual booking dates, use those instead
      if (booking.check_in && booking.check_out) {
        // Convert date strings to Date objects
        const checkIn = new Date(booking.check_in);
        const checkOut = new Date(booking.check_out);
        
        // Add all dates between check-in and check-out
        const currentDate = new Date(checkIn);
        while (currentDate <= checkOut) {
          dates.push(new Date(currentDate));
          currentDate.setDate(currentDate.getDate() + 1);
        }
      } else {
        // Fallback to using created_at if no check_in/check_out dates
        const date = new Date(booking.created_at);
        dates.push(new Date(date.setHours(0, 0, 0, 0)));
      }
    });
  
    setBookedDates(dates);
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
        tileDisabled={({ date }) => isBooked(date)} // Optional: disable booked dates
      />
      <div className="legend">
        <span><span className="dot booked-dot"></span> Booked</span>
        <span><span className="dot free-dot"></span> Available</span>
      </div>
    </div>
  );
};

export default RoomCalendar;