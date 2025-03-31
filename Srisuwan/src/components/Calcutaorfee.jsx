import React, { useState, useEffect } from "react";
import Papa from "papaparse";
import { jsPDF } from "jspdf";
import { saveAs } from "file-saver";
import "../css/Calcuraorfee.css";

const RoomFeeCalculator = () => {
  const [roomNumber, setRoomNumber] = useState("");
  const [date, setDate] = useState("");
  const [roomCharge, setRoomCharge] = useState("");
  const [finalWater, setFinalWater] = useState("");
  const [initialWater, setInitialWater] = useState("");
  const [finalElectricity, setFinalElectricity] = useState("");
  const [initialElectricity, setInitialElectricity] = useState("");
  const [serviceFee, setServiceFee] = useState("");
  const [rooms, setRooms] = useState([]);

  const waterFee =
    finalWater && initialWater
      ? Math.abs(Number(finalWater) - Number(initialWater)) * 20
      : 0;

  const electricityFee =
    finalElectricity && initialElectricity
      ? Math.abs(Number(finalElectricity) - Number(initialElectricity)) * 7
      : 0;

  const total =
    Number(roomCharge || 0) +
    waterFee +
    electricityFee +
    Number(serviceFee || 0);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:5001/api/rooms", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        setRooms(data);
      } catch (err) {
        console.error("Error fetching rooms", err);
      }
    };

    fetchRooms();
  }, []);

  // Function to download PDF (with English labels)
  const generatePDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();

    // Format the date to be more readable
    let formattedDate = "-";
    if (date) {
      try {
        const dateObj = new Date(date + "-01");
        const monthNames = [
          "January", "February", "March", "April", "May", "June",
          "July", "August", "September", "October", "November", "December"
        ];
        formattedDate = monthNames[dateObj.getMonth()] + " " + (dateObj.getFullYear());
      } catch (e) {
        console.error("Error formatting date:", e);
      }
    }

    // Current date
    const today = new Date();
    const currentDate = today.getDate() + "/" + (today.getMonth() + 1) + "/" + today.getFullYear();

    // Margin
    const margin = 20;
    let y = margin;

    // Add title
    doc.setFontSize(20);
    doc.addFileToVFS("THSarabun.ttf", "<base64_encoded_font_data>");
    doc.setFont("THSarabun", "normal");
    doc.text("Room Rental Invoice", pageWidth / 2, y, { align: "center" });
    y += 15;

    // Add room number and date
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text(`Invoice Date: ${currentDate}`, margin, y);
    y += 10;

    // Room details
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Room Details", margin, y);
    y += 10;

    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text(`Room Number: ${roomNumber || "-"}`, margin, y);
    y += 8;
    doc.text(`Month: ${formattedDate}`, margin, y);
    y += 15;

    // Expense details header
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Expense Details", margin, y);
    y += 10;

    // Draw table (manual approach, not using autoTable)
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");

    // Column width
    const col1Width = 100;
    const col2Width = 70;

    // Create item row
    const drawItem = (label, value) => {
      doc.setFont("helvetica", "normal");
      doc.text(label, margin, y);
      doc.text(value, margin + col1Width, y);
      y += 8;
    };

    const drawSubItem = (label, value) => {
      doc.setFont("helvetica", "normal");
      doc.text(label, margin + 10, y);
      doc.text(value, margin + col1Width, y);
      y += 7;
    };

    // Room charge
    drawItem("Room Charge", `${roomCharge || "0"} Baht`);

    // Water fee
    drawItem("Water Fee", `${waterFee.toFixed(2)} Baht`);
    drawSubItem("- Initial Water Meter", `${initialWater || "0"} units`);
    drawSubItem("- Final Water Meter", `${finalWater || "0"} units`);
    const waterUnits = finalWater && initialWater ? Math.abs(Number(finalWater) - Number(initialWater)) : 0;
    drawSubItem("- Units Used", `${waterUnits} units`);
    drawSubItem("- Price per Unit", "20 Baht");

    // Electricity fee
    drawItem("Electricity Fee", `${electricityFee.toFixed(2)} Baht`);
    drawSubItem("- Initial Electricity Meter", `${initialElectricity || "0"} units`);
    drawSubItem("- Final Electricity Meter", `${finalElectricity || "0"} units`);
    const electricityUnits = finalElectricity && initialElectricity ? Math.abs(Number(finalElectricity) - Number(initialElectricity)) : 0;
    drawSubItem("- Units Used", `${electricityUnits} units`);
    drawSubItem("- Price per Unit", "7 Baht");

    // Service fee
    drawItem("Service Fee", `${serviceFee || "0"} Baht`);

    // Add a separator line
    y += 5;
    doc.setDrawColor(0);
    doc.line(margin, y, pageWidth - margin, y);
    y += 10;

    // Add total amount
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Total Amount", margin, y);
    doc.text(`${total.toFixed(2)} Baht`, pageWidth - margin, y, { align: "right" });
    y += 20;

    // Add notes
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("Notes:", margin, y);
    y += 6;
    doc.text("1. Please pay the rental fee by the 5th of each month", margin + 5, y);
    y += 6;
    doc.text("2. Payments can be made by bank transfer or in person at the office", margin + 5, y);
    y += 6;
    doc.text("3. For inquiries, please contact 099-XXX-XXXX", margin + 5, y);
    y += 20;

    // Add signature and date
    doc.line(margin, y, margin + 70, y);
    doc.line(pageWidth - margin - 70, y, pageWidth - margin, y);
    y += 5;
    doc.text("Signature............................................", margin, y);
    doc.text("Signature............................................", pageWidth - margin - 70, y);
    y += 10;
    doc.text("(Tenant)", margin + 35, y, { align: "center" });
    doc.text("(Landlord)", pageWidth - margin - 35, y, { align: "center" });

    // Download the PDF
    doc.save(`room_rental_invoice_${roomNumber || ""}_${date || ""}.pdf`);
  };

  // Function to generate CSV (no changes)
  const generateCSV = () => {
    const roomData = {
      roomNumber,
      date,
      roomCharge,
      waterFee,
      electricityFee,
      serviceFee,
      total,
    };

    const csvData = Papa.unparse([roomData]);

    const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "room_fees.csv");
  };

  // Function to handle confirm for both PDF and CSV
  const handleConfirm = () => {
    generatePDF(); // Generate PDF
    generateCSV(); // Generate CSV
  };

  return (
    <div className="calculator-room-fee-card">
      <h2 className="k">Room Fee Calculator</h2>

      <div className="Roomtext">
        <label>Room Number</label>
        <select
          value={roomNumber}
          onChange={(e) => {
            const selectedRoom = rooms.find(
              (room) => room.room_number === e.target.value
            );
            setRoomNumber(e.target.value);
            if (selectedRoom) {
              setRoomCharge(selectedRoom.price);
              setServiceFee(selectedRoom.servicefee || 0);
            } else {
              setRoomCharge("");
              setServiceFee("");
            }
          }}
        >
          <option value="">-- Select a room --</option>
          {rooms.map((room) => (
            <option key={room._id} value={room.room_number}>
              {room.room_number}
            </option>
          ))}
        </select>
      </div>

      <div className="date-on-calculator-page">
        <label>Date</label>
        <input
          type="month"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </div>

      <div className="Roomtext">
        <label>Room Charge</label>
        <input type="number" value={roomCharge} readOnly />
      </div>

      <div className="water">
        <label>Water Fee</label>
        <div>
          <input
            type="number"
            value={initialWater}
            onChange={(e) => setInitialWater(e.target.value)}
            placeholder="Initial"
          />
          <input
            type="number"
            value={finalWater}
            onChange={(e) => setFinalWater(e.target.value)}
            placeholder="Final"
          />
          <input type="number" value={waterFee} readOnly />
        </div>
      </div>

      <div className="water">
        <label>Electricity Fee</label>
        <div className="grid grid-cols-3 gap-2">
          <input
            type="number"
            value={initialElectricity}
            onChange={(e) => setInitialElectricity(e.target.value)}
            placeholder="Initial"
          />
          <input
            type="number"
            value={finalElectricity}
            onChange={(e) => setFinalElectricity(e.target.value)}
            placeholder="Final"
          />
          <input type="number" value={electricityFee} readOnly />
        </div>
      </div>

      <div className="Roomtext">
        <label>Service Fee</label>
        <input type="number" value={serviceFee} readOnly />
      </div>

      <div className="Roomtext">
        <label>Total</label>
        <input type="number" value={total} readOnly />
      </div>
      <div className="confirm-button-on-calculate-page">
        <button onClick={handleConfirm}>Confirm</button>
      </div>
    </div>
  );
};

export default RoomFeeCalculator;
