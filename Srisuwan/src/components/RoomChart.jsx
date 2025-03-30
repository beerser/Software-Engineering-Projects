import React from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";


ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const RoomChart = ({ rooms }) => {
  
  const roomStats = rooms.reduce(
    (stats, room) => {
      if (room.status === "nonavailable") {
        stats.booked += 1;  
      } else if (room.status === "available") {
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
        backgroundColor: ["#4caf50", "#f44336"],  
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
