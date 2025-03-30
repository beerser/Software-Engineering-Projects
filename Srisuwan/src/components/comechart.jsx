import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";

// Register the necessary components of Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Comechart = () => {
  const [incomeData, setIncomeData] = useState([]);

  useEffect(() => {
    const fetchIncomeData = async () => {
      try {
        const res = await fetch("http://localhost:5001/api/income");  
        const data = await res.json();
        console.log("Income data fetched:", data);

        // กรองข้อมูลเฉพาะเดือนที่ต้องการ (เช่น January, February)
        const filteredData = data.filter(item => item.month === "January" || item.month === "February");
        
        setIncomeData(filteredData);  
      } catch (err) {
        console.error("Error fetching income data:", err);
      }
    };

    fetchIncomeData();
  }, []);

  if (incomeData.length === 0) {
    return <div>Loading...</div>; // หากยังไม่มาข้อมูลให้แสดง Loading...
  }

  // กำหนดข้อมูลที่จะแสดงในกราฟ
  const data = {
    labels: incomeData.map(item => item.month),  // ใช้ชื่อเดือนจากข้อมูลที่ดึงมา
    datasets: [
      {
        label: "Monthly Income",
        data: incomeData.map(item => item.income),  // ใช้รายได้จากข้อมูลที่ดึงมา
        backgroundColor: "#4caf50",  // สีสำหรับรายได้
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

export default Comechart;
