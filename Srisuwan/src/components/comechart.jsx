import React from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";

// Register the necessary components of Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const comechart = () => {
  // ข้อมูลรายได้สำหรับแต่ละเดือนและปี
  const data = {
    labels: ["January", "February"],  // เดือน
    datasets: [
      {
        label: "Monthly Income",
        data: [2000, 500],  // รายได้แต่ละเดือน
        backgroundColor: "#4caf50", // สีสำหรับรายได้
      },
      {
        label: "Yearly Income",
        data: [2500, 600],  // รายได้ประจำปี
        backgroundColor: "#00bcd4",  // สีสำหรับรายได้ประจำปี
      },
    ],
  };

  return (
    <div style={{ width: "60%", margin: "20px auto" }}>
      <h3>Income Overview</h3>
      <Bar data={data} options={{ responsive: true }} />
    </div>
  );
};

export default comechart;
