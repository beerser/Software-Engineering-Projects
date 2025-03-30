import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";

// Register the necessary components of Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Comechart = () => {
  const [incomeData, setIncomeData] = useState([]);  // กำหนด state สำหรับข้อมูลรายได้

  // ดึงข้อมูลรายได้จาก API
  useEffect(() => {
    const fetchIncomeData = async () => {
      try {
        const res = await fetch("http://localhost:5001/api/income");  // ดึงข้อมูลจาก API
        const data = await res.json();
        console.log("Income data fetched:", data);  // ตรวจสอบข้อมูลที่ดึงมาจาก API
        setIncomeData(data);  // อัปเดตข้อมูลที่ดึงมาใน state
      } catch (err) {
        console.error("Error fetching income data:", err);
      }
    };

    fetchIncomeData();
  }, []);

  // ตรวจสอบว่ามีข้อมูลรายได้หรือไม่
  if (incomeData.length === 0) {
    return <div>Loading...</div>;  // แสดงข้อความ "Loading..." หากยังไม่ได้รับข้อมูล
  }

  // การคำนวณข้อมูลที่แสดงในกราฟ
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
