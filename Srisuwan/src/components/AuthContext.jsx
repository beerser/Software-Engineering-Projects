import React, { createContext, useState, useContext, useEffect } from "react";

// สร้าง Context สำหรับผู้ใช้
const AuthContext = createContext();

// สร้าง hook `useAuth` สำหรับดึงข้อมูลจาก Context
export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // สร้าง state สำหรับเก็บข้อมูลผู้ใช้

  useEffect(() => {
    // เมื่อโหลดแอปพลิเคชัน, โหลดข้อมูลผู้ใช้จาก localStorage
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser); // หากมีข้อมูลผู้ใช้ใน localStorage, โหลดข้อมูลมา
    }
  }, []);

  // ฟังก์ชันการล็อกอิน
  const login = (userData) => {
    localStorage.setItem("user", JSON.stringify(userData)); // เก็บข้อมูลผู้ใช้ใน localStorage
    setUser(userData); // อัปเดตข้อมูลผู้ใช้ใน state
  };

  // ฟังก์ชันการออกจากระบบ
  const logout = () => {
    localStorage.removeItem("user");
    setUser(null); // ล้างข้อมูลผู้ใช้
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
