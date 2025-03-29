const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];  // ดึง token จาก Authorization header
  if (!token) return res.status(401).json({ error: "No token provided" });
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);  // ตรวจสอบ token ด้วย JWT_SECRET
    req.user = decoded;  // ถอดรหัส token และเพิ่มข้อมูลผู้ใช้ใน req.user
    next();  // ส่งต่อไปยัง handler ถ้า token ถูกต้อง
  } catch {
    res.status(403).json({ error: "Invalid token" });  // ถ้า token ไม่ถูกต้อง
  }
};

const isAdmin = (req, res, next) => {
  // ตรวจสอบว่า user ที่ถอดรหัสจาก token มี role เป็น 'admin' หรือไม่
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ error: 'Access denied: Admin only' });  // ถ้าไม่ใช่ admin ให้คืนค่าผิดพลาด
  }
  next();  // ถ้าเป็น admin ให้ส่งต่อไปยัง handler
};

module.exports = { auth, isAdmin };
