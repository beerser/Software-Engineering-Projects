require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const generatePayload = require("promptpay-qr");
const qrcode = require("qrcode");
const bodyParser = require("body-parser");
const User = require("./models/User");
const bcrypt = require("bcrypt");
const app = express();
const Booking = require("./models/Booking");
const { auth, isAdmin } = require("./middleware/auth");
const Room = require("./models/Room");
const PORT = process.env.PORT || 5001;
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const Income = require("./models/Income");
const Money = require("./models/Money");


app.use(express.json());

app.use(cors());

app.use(bodyParser.json());

app.get("/", (req, res) => {
  return res.send("hello");
});

// เชื่อมต่อ MongoDB Atlas
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("🔥 Connected to MongoDB Atlas"))
  .catch((err) => console.error(err));

// สมัครสมาชิก
app.post("/api/register", async (req, res) => {
  const {
    firstname,
    lastname,
    email,
    password,
    confirmPassword,
    phoneNumber,
    role,
  } = req.body; // เพิ่ม role

  if (password !== confirmPassword) {
    return res.status(400).json({ error: "Passwords do not match" });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ error: "Email already registered" });

    // เพิ่มการกำหนดค่า role เป็น 'admin' หรือ 'user'
    const newUser = new User({
      firstname,
      lastname,
      email,
      password,
      phoneNumber,
      role: role || "user", // กำหนดค่า role เป็น 'user' ถ้าไม่ได้ส่งค่า role มา
    });

    await newUser.save();
    res.json({ message: "✅ Registered successfully" });
  } catch (err) {
    console.log("❌ Error in /register:", err); // เพิ่มการแสดง error
    res.status(500).json({ error: "Something went wrong" });
  }
});

app.use((req, res, next) => {
  console.log(`📥 Request: ${req.method} ${req.url}`);
  next();
});
app.get("/api/user", async (req, res) => {
  try {
    const user = await User.find(); // ดึงข้อมูลห้องจาก MongoDB
    if (user.length === 0) {
      return res.status(404).json({ message: "No rooms found" });
    }
    res.json(user);
  } catch (err) {
    console.error("Error fetching rooms:", err);
    res.status(500).json({ error: "Failed to fetch rooms" });
  }
});

app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: "Invalid password" });

    const token = jwt.sign(
      { userId: user._id, role: user.role }, // เพิ่ม role เพื่อรู้ว่าเป็น admin หรือ user
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    console.log("Sending response data: ", {
      message: "Login success",
      role: user.role,
      token: token,
      firstname: user.firstname, // ตรวจสอบว่าได้ดึงข้อมูลเหล่านี้มาหรือไม่
      lastname: user.lastname,
      phoneNumber: user.phoneNumber,
    });
    res.json({
      message: "Login success",
      role: user.role,
      token: token,
      firstname: user.firstname,
      lastname: user.lastname,
      phoneNumber: user.phoneNumber,
    });
  } catch (err) {
    res.status(500).json({ error: "Something went wrong" });
  }
});

app.put("/api/user/update", auth, async (req, res) => {
  const { firstname, lastname } = req.body;

  try {
    const user = await User.findById(req.user.userId); // ใช้ userId จาก token

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // อัปเดตข้อมูลชื่อและนามสกุล
    user.firstname = firstname || user.firstname;
    user.lastname = lastname || user.lastname;

    // บันทึกข้อมูลที่อัปเดต
    await user.save();

    res.json({
      message: "User information updated successfully",
      user: {
        firstname: user.firstname,
        lastname: user.lastname,
      },
    });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ error: "Failed to update user" });
  }
});

// API สำหรับการจองห้อง
app.post("/api/book-room", auth, async (req, res) => {
  const { roomId } = req.body; // ห้องที่ผู้ใช้เลือก
  const userId = req.user.userId; // ผู้ใช้ที่กำลังจอง

  try {
    // หาห้องที่ผู้ใช้เลือกจากห้องที่มี
    const room = await Room.findById(roomId);

    if (!room || room.status !== "available") {
      return res.status(400).json({ error: "Room not available for booking" });
    }

    // เปลี่ยนสถานะห้องจาก 'available' เป็น 'booked'
    room.status = "booked";

    // บันทึกการจองในฐานข้อมูล (คอลเล็กชัน bookings)
    const newBooking = new Booking({
      userId,
      roomId: room._id,
      room_number: room.room_number,
      price: room.price,
      booking_date: new Date(),
    });

    await newBooking.save(); // บันทึกการจองในฐานข้อมูล

    // บันทึกสถานะห้องที่อัปเดต
    await room.save();

    res.json({ message: "Room booked successfully", booking: newBooking });
  } catch (err) {
    console.error("Error booking room:", err);
    res.status(500).json({ error: "Failed to book room" });
  }
});

app.get("/api/rooms", async (req, res) => {
  try {
    const rooms = await Room.find(); // ดึงข้อมูลห้องจาก MongoDB
    if (rooms.length === 0) {
      return res.status(404).json({ message: "No rooms found" });
    }
    res.json(rooms); // ส่งข้อมูลห้องกลับเป็น JSON
  } catch (err) {
    console.error("Error fetching rooms:", err);
    res.status(500).json({ error: "Failed to fetch rooms" });
  }
});

app.put("/api/admin/rooms", async (req, res) => {
  try {
    console.log("Request Body:", req.body); // ตรวจสอบข้อมูลที่ได้รับ
    const updatedRooms = req.body;

    for (const room of updatedRooms) {
      if (room._id) {
        const updatedRoom = await Room.findByIdAndUpdate(
          room._id,
          {
            status: room.status,
            description: room.description,
            image_url: room.image_url,
            price: room.price,
            room_number: room.room_number,
            servicefee: room.servicefee,
          },
          { new: true }
        );

        if (!updatedRoom) {
          console.log(`Room with id ${room._id} not found`);
        }
      } else {
        await Room.create(room);
      }
    }

    res.json({ message: "Rooms updated successfully", data: updatedRooms });
  } catch (err) {
    console.error("Error updating rooms:", err);
    res.status(500).json({ error: "Failed to update rooms" });
  }
});

// แก้ไขข้อมูลห้องทั้งหมด (admin เท่านั้น)
app.put("/api/admin/update-rooms", auth, isAdmin, async (req, res) => {
  try {
    const updatedRooms = req.body;

    for (const room of updatedRooms) {
      if (room._id) {
        await Room.findByIdAndUpdate(room._id, room, { new: true });
      } else {
        await Room.create(room);
      }
    }

    res.json({ message: "✅ Rooms updated successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to update rooms" });
  }
});

app.post("/generateQR", (req, res) => {
  let mobileNumber = req.body.phone?.replace(/-/g, "") || "0000000000";
  const amount = req.body.amount || 0;

  if (mobileNumber === "0000000000") {
    return res.status(404).json({
      RespCode: 404,
      RespMessage: "Invalid phone number",
    });
  }

  const payload = generatePayload(mobileNumber, { amount });

  qrcode.toDataURL(
    payload,
    {
      type: "image/png",
      width: 500,
      margin: 1,
    },
    (err, qrCodeDataURL) => {
      if (err) {
        console.log("❌ QR Code generation failed:", err);
        return res.status(400).json({
          RespCode: 400,
          RespMessage: err.message,
        });
      }

      return res.json({
        RespCode: 200,
        Result: qrCodeDataURL,
        RespMessage: "Success",
      });
    }
  );
});

app.use("/uploads", express.static("uploads"));
const uploadDir = "uploads";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir); // เก็บไฟล์ในโฟลเดอร์ uploads
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // ตั้งชื่อไฟล์ใหม่
  },
});

// กำหนดตัวกรองไฟล์
const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "application/pdf"];
    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new Error("ไฟล์ที่อัปโหลดไม่ถูกต้อง"));
    }
    cb(null, true);
  },
});

// กำหนดเส้นทาง POST /upload
app.post("/upload", upload.single("slip"), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send("ไม่พบไฟล์ที่อัปโหลด");
    }
    res.json({ message: "ไฟล์ถูกอัปโหลดสำเร็จ!", filename: req.file.filename }); // ส่งชื่อไฟล์กลับไป
  } catch (error) {
    console.error("เกิดข้อผิดพลาดในการอัปโหลดไฟล์:", error.message);
    res.status(500).send("เกิดข้อผิดพลาดในการอัปโหลดไฟล์");
  }
});

app.get("/files", (req, res) => {
  fs.readdir("uploads", (err, files) => {
    if (err) {
      return res.status(500).send("ไม่สามารถอ่านโฟลเดอร์ uploads");
    }
    res.json(files);
  });
});

app.post("/booking", upload.single("slip"), async (req, res) => {
  try {
    const { user_firstname, user_lastname, room_number } = req.body;

    const booking = new Booking({
      user_firstname,
      user_lastname,
      room_number,
      slip_filename: req.file.filename,
      payment_status: "pending",
    });

    await booking.save();
    res.status(201).send("การจองสำเร็จ");
  } catch (error) {
    console.error("เกิดข้อผิดพลาด:", error.message);
    res.status(500).send("เกิดข้อผิดพลาดในการสร้างการจอง");
  }
});

// API สำหรับดึงข้อมูลการจองทั้งหมด
app.get("/api/bookings", async (req, res) => {
  try {
    const bookings = await Booking.find(); // ดึงข้อมูลการจองทั้งหมดจาก MongoDB

    if (!bookings || bookings.length === 0) {
      return res.status(404).send("ไม่พบข้อมูลการจอง");
    }

    // ส่งข้อมูลทั้งหมดของการจอง (ไม่รวม _id)
    const bookingData = bookings.map((booking) => {
      const {
        user_firstname,
        user_lastname,
        room_number,
        slip_filename,
        payment_status,
        created_at,
      } = booking;
      return {
        user_firstname,
        user_lastname,
        room_number,
        slip_filename,
        payment_status,
        created_at,
      };
    });

    res.status(200).json(bookingData); // ส่งข้อมูลการจองทั้งหมด
  } catch (error) {
    console.error(error);
    res.status(500).send("เกิดข้อผิดพลาดในการดึงข้อมูลการจอง");
  }
});

app.put("/booking/:id/approve", async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).send("ไม่พบการจองนี้");
    }

    if (booking.payment_status === "approved") {
      return res.status(400).send("การจองนี้ได้รับการอนุมัติแล้ว");
    }

    booking.payment_status = "approved";
    await booking.save();

    const room = await Room.findById(booking.room_id);
    room.status = "booked";
    await room.save();

    res.send("การจองได้รับการอนุมัติแล้ว");
  } catch (error) {
    console.error("เกิดข้อผิดพลาดในการอนุมัติการจอง:", error.message);
    res.status(500).send("เกิดข้อผิดพลาด");
  }
});

app.post("/api/confirmBooking", async (req, res) => {
  const { user_firstname, user_lastname, room_number, slip_filename, status } =
    req.body;

  try {
    // ค้นหาการจองที่ตรงกับข้อมูลที่ได้รับ
    const booking = await Booking.findOne({
      user_firstname,
      user_lastname,
      room_number,
      slip_filename,
    });

    if (!booking) {
      return res.status(404).send("ไม่พบการจอง");
    }

    // อัปเดตสถานะการจอง
    booking.payment_status = status;
    await booking.save();
    // สำหรับการอัปเดตสถานะการจอง และการเปลี่ยนสถานะของห้อง
    if (status === "confirmed") {
      const booking = await Booking.findOne({ room_number }); // ค้นหาการจองที่มี room_number ตรงกัน
      const room = await Room.findOne({ room_number }); // ค้นหาห้องที่มี room_number ตรงกัน

      if (room) {
        room.status = "nonavailable"; // เปลี่ยนสถานะห้อง
        await room.save(); // บันทึกสถานะใหม่ของห้อง
      }

      if (booking) {
        booking.payment_status = "confirmed"; // เปลี่ยนสถานะการจอง
        await booking.save(); // บันทึกการเปลี่ยนแปลงใน booking
      }
    }

    res.status(200).send("การจองถูกอัปเดตสถานะเรียบร้อย");
  } catch (error) {
    console.error(error);
    res.status(500).send("เกิดข้อผิดพลาดในการอัปเดตสถานะ");
  }
});

app.post("/api/rejectBooking", async (req, res) => {
  const { bookingId } = req.body;

  if (!bookingId) {
    return res.status(400).send("ไม่พบ bookingId");
  }

  try {
    // ลบการจองจาก MongoDB
    const result = await Booking.deleteOne({ _id: bookingId }); // ลบเอกสารที่ตรงกับ bookingId

    if (result.deletedCount === 0) {
      return res.status(404).send("ไม่พบการจองที่ต้องการลบ");
    }

    res.status(200).send("การจองถูกปฏิเสธและลบเรียบร้อยแล้ว");
  } catch (error) {
    console.error(error);
    res.status(500).send("เกิดข้อผิดพลาดในการปฏิเสธการจอง");
  }
});



app.get("/uploads/:filename", (req, res) => {
  const file = path.join(__dirname, "uploads", req.params.filename);
  res.sendFile(file);
});



app.get("/api/income", async (req, res) => {
  try {
    const incomeData = await Income.aggregate([
      { $match: {} }, // ดึงข้อมูลทั้งหมด
    ]);
    console.log("Income data:", incomeData);
    res.json(incomeData);
  } catch (err) {
    console.error("Error fetching income data:", err);
    res.status(500).send("Error fetching income data.");
  }
});







app.post("/api/money", async (req, res) => {
  const { price } = req.body;


    try {
      // สร้างอินสแตนซ์ใหม่ของ Money เพื่อบันทึกข้อมูล
      const newMoney = new Money({
        price: price, // ส่งข้อมูล price ที่ได้จาก React
      });
  
      // บันทึกข้อมูลลงใน MongoDB
      await newMoney.save();
  
      res.status(201).json({
        message: 'Total price saved successfully',
        money: newMoney,
      });
    } catch (err) {
      console.error("Error saving total price:", err);
      res.status(500).json({ error: 'Failed to save total price' });
    }
  
});









app.listen(5001, () => {
  console.log("server running");
});
