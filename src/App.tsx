import { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import DashboardAdmin from "./pages/DashboardAdmin";
import DashboardClient from "./pages/DashboardClient/DashboardClient";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import Register from "./pages/Register";
import { Archive } from "./pages/DashboardClient/Archive";

function App() {
  const [userRole, setUserRole] = useState(localStorage.getItem("userRole"));

  useEffect(() => {
    const handleStorageChange = () => {
      setUserRole(localStorage.getItem("userRole"));
    };
    
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  return (
    <>
     <Header userRole={userRole} setUserRole={setUserRole} />

      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login setUserRole={setUserRole} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/clientdash" element={<DashboardClient />} />
        <Route path="/archive" element={<Archive />} />
        <Route
          path="/dashboard"
          element={
            userRole === "client" ? <DashboardClient /> :
            userRole === "admin" ? <DashboardAdmin /> :
            <Navigate to="/login" />
          }
        />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
