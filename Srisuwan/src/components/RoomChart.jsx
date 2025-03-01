import React, { useState } from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";


ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const RoomChart = ({ rooms }) => {

  const roomStats = rooms.reduce(
    (stats, room) => {
      if (room.booked) {
        stats.booked += 1;
      } else {
        stats.available += 1;
      }
      return stats;
    },
    { booked: 0, available: 0 }
  );

  const data = {
    labels: ["Available", "Booked"],
    datasets: [
      {
        label: "Rooms",
        data: [roomStats.available, roomStats.booked],
        backgroundColor: ["#4caf50", "#f44336"], // สีสำหรับห้องว่างและห้องที่ถูกจอง
      },
    ],
  };

  return (
    <div style={{ width: "60%", margin: "20px auto" }}>
      <h3>Room Status</h3>
      <Bar data={data} options={{ responsive: true }} />
    </div>
  );
};

export default RoomChart;
