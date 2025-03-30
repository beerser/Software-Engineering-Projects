require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const generatePayload = require('promptpay-qr');
const qrcode = require('qrcode');
const bodyParser = require('body-parser');
const User = require('./models/User');
const bcrypt = require('bcrypt');
const app = express();
const Booking = require('./models/Booking');
const { auth, isAdmin } = require('./middleware/auth'); 
const Room = require('./models/Room');
const PORT = process.env.PORT || 5001;

app.use(express.json());

app.use(cors()); 

app.use(bodyParser.json());

app.get('/', (req, res) => {
    return res.send("hello");
});

// เชื่อมต่อ MongoDB Atlas
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log('🔥 Connected to MongoDB Atlas'))
.catch(err => console.error(err));
  

// สมัครสมาชิก
app.post('/api/register', async (req, res) => {
    const { firstname, lastname, email, password, confirmPassword, phoneNumber, role } = req.body; // เพิ่ม role

    if (password !== confirmPassword) {
      return res.status(400).json({ error: 'Passwords do not match' });
    }

    try {
      const existingUser = await User.findOne({ email });
      if (existingUser) return res.status(400).json({ error: 'Email already registered' });

      // เพิ่มการกำหนดค่า role เป็น 'admin' หรือ 'user'
      const newUser = new User({ 
        firstname, 
        lastname, 
        email, 
        password, 
        phoneNumber, 
        role: role || 'user' // กำหนดค่า role เป็น 'user' ถ้าไม่ได้ส่งค่า role มา
      });

      await newUser.save();
      res.json({ message: '✅ Registered successfully' });
    } catch (err) {
      console.log('❌ Error in /register:', err); // เพิ่มการแสดง error
      res.status(500).json({ error: 'Something went wrong' });
    }
});

  app.use((req, res, next) => {
    console.log(`📥 Request: ${req.method} ${req.url}`);
    next();
  });
  
  app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
  
    try {
      const user = await User.findOne({ email });
      if (!user) return res.status(401).json({ error: 'User not found' });
  
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(401).json({ error: 'Invalid password' });
  
      const token = jwt.sign(
        { userId: user._id, role: user.role },  // เพิ่ม role เพื่อรู้ว่าเป็น admin หรือ user
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );
  
      res.json({ message: '✅ Login success', token, role: user.role });
    } catch (err) {
      res.status(500).json({ error: 'Something went wrong' });
    }
  });

app.post('/api/book-dorm', auth, async (req, res) => {
    // ถ้ามาถึงตรงนี้ แปลว่า token ผ่านแล้ว
    const { dormName, date } = req.body;
    const userId = req.user.userId;
  
    const newBooking = new Booking({
      userId,
      dormName,
      date
    });
  
    await newBooking.save();
    res.json({ message: '✅ Booking success', booking: newBooking });
  });

  // ดึงข้อมูลห้องทั้งหมด (admin เท่านั้น)
app.get('/api/admin/rooms', auth, isAdmin, async (req, res) => {
    try {
      const rooms = await Room.find();
      res.json(rooms);
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch rooms' });
    }
  });

  app.put('/api/admin/update-rooms', auth, isAdmin, async (req, res) => {
    try {
      const updatedRooms = req.body;
  
      for (const room of updatedRooms) {
        if (room._id) {
          await Room.findByIdAndUpdate(room._id, room, { new: true });
        } else {
          await Room.create(room);
        }
      }
  
      res.json({ message: '✅ Rooms updated successfully' });
    } catch (err) {
      res.status(500).json({ error: 'Failed to update rooms' });
    }
  });

// แก้ไขข้อมูลห้องทั้งหมด (admin เท่านั้น)
app.put('/api/admin/update-rooms', auth, isAdmin, async (req, res) => {
    try {
      const updatedRooms = req.body;
  
      for (const room of updatedRooms) {
        if (room._id) {
          await Room.findByIdAndUpdate(room._id, room, { new: true });
        } else {
          await Room.create(room);
        }
      }
  
      res.json({ message: '✅ Rooms updated successfully' });
    } catch (err) {
      res.status(500).json({ error: 'Failed to update rooms' });
    }
  });


app.post('/generateQR', async (req, res) => {
    try {
        const mobileNumber = req.body.phone || '000-000-0000';
        const amount = req.body.amount || 0;

        if (mobileNumber === "000-000-0000") {
            return res.status(404).json({
                RespCode: 404,
                RespMessage: 'Invalid phone number'
            });
        }

        const payload = generatePayload(mobileNumber, { amount });
        
        // Generate QR code as data URL instead of saving to file
        const qrCodeDataURL = await qrcode.toDataURL(payload, {
            type: 'image/png',
            width: 500,
            margin: 1
        });

        return res.json({
            RespCode: 200,
            Result: qrCodeDataURL,
            RespMessage: 'Success'
        });

    } catch (error) {
        console.log(error);
        return res.status(400).json({
            RespCode: 400,
            RespMessage: error.message
        });
    }
});

app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});