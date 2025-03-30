import React from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import "../css/RoomChart.css";
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const RoomChart = ({ rooms }) => {
  // Calculate room statistics
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

  // Calculate percentages
  const total = roomStats.available + roomStats.booked;
  const availablePercentage = Math.round((roomStats.available / total) * 100) || 0;
  const bookedPercentage = Math.round((roomStats.booked / total) * 100) || 0;

  const data = {
    labels: ["Available", "Booked"],
    datasets: [
      {
        label: "Rooms",
        data: [roomStats.available, roomStats.booked],
        backgroundColor: [
          "rgba(46, 204, 113, 0.8)",
          "rgba(231, 76, 60, 0.8)"
        ],
        borderColor: [
          "rgba(39, 174, 96, 1)",
          "rgba(192, 57, 43, 1)"
        ],
        borderWidth: 2,
        borderRadius: 8,
        hoverBackgroundColor: [
          "rgba(46, 204, 113, 1)",
          "rgba(231, 76, 60, 1)"
        ],
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          font: {
            family: "'Poppins', sans-serif",
            size: 14,
            weight: 'bold'
          },
          padding: 20,
          usePointStyle: true,
          pointStyle: 'rectRounded'
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleFont: {
          family: "'Poppins', sans-serif",
          size: 14
        },
        bodyFont: {
          family: "'Poppins', sans-serif",
          size: 13
        },
        padding: 12,
        cornerRadius: 8,
        callbacks: {
          label: function(context) {
            const value = context.raw;
            const percentage = context.dataIndex === 0 ? availablePercentage : bookedPercentage;
            return `${value} rooms (${percentage}%)`;
          }
        }
      },
      title: {
        display: false
      },
    },
    scales: {
      x: {
        grid: {
          display: false
        },
        ticks: {
          font: {
            family: "'Poppins', sans-serif",
            size: 13
          }
        }
      },
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(200, 200, 200, 0.2)'
        },
        ticks: {
          font: {
            family: "'Poppins', sans-serif",
            size: 12
          },
          stepSize: 1
        }
      }
    },
    animation: {
      duration: 2000,
      easing: 'easeOutQuart'
    }
  };

  return (
    <div className="room-chart-container">
      <div className="room-chart-header">
        <h2 className="room-chart-title">Room Availability Dashboard</h2>
        <div className="room-chart-summary">
          <div className="stat-box available">
            <span className="stat-value">{roomStats.available}</span>
            <span className="stat-label">Available</span>
            <span className="stat-percentage">{availablePercentage}%</span>
          </div>
          <div className="stat-box booked">
            <span className="stat-value">{roomStats.booked}</span>
            <span className="stat-label">Booked</span>
            <span className="stat-percentage">{bookedPercentage}%</span>
          </div>
          <div className="stat-box total">
            <span className="stat-value">{total}</span>
            <span className="stat-label">Total Rooms</span>
          </div>
        </div>
      </div>
      <div className="chart-wrapper">
        <Bar data={data} options={options} />
      </div>
    </div>
  );
};

export default RoomChart;