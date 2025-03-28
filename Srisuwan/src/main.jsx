import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./css/index.css";
import Home  from "./page/Home.jsx";
import "bootstrap/dist/css/bootstrap.css";
import { AuthProvider } from "./components/AuthContext"; 

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider> 
      <Home />
    </AuthProvider>
  </StrictMode>
);
