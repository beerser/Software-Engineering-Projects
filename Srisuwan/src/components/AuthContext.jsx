import { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "../../../Back-end/supabaseClient";  // นำเข้า Supabase

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const storedUser = JSON.parse(localStorage.getItem('user'));
    
    if (storedUser) {
      setUser(storedUser);
      console.log("Loaded User from localStorage:", storedUser);
    }


    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);
        localStorage.setItem("user", JSON.stringify(session.user)); // เก็บข้อมูลใน localStorage
      } else {
        setUser(null);  
      }
      setLoading(false); 
    };

    getSession(); 


    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null);
      if (session?.user) {
        localStorage.setItem("user", JSON.stringify(session.user)); // อัปเดตข้อมูลใน localStorage
      } else {
        localStorage.removeItem("user"); 
      }
    });

    return () => {
      listener?.subscription?.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};
