import { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import DashboardAdmin from "./pages/DashboardAdmin/DashboardAdmin";
import DashboardClient from "./pages/DashboardClient/DashboardClient";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import Register from "./pages/Register";
import { Archive } from "./pages/DashboardClient/Archive";
import PricingPage from "./pages/DashboardAdmin/PricingPage";
import ClientsPage from "./pages/DashboardAdmin/ClientsPage";
import HistoryPage from "./pages/DashboardAdmin/HistoryPage";
import OrderDetailsPage from "./pages/DashboardAdmin/OrderDetailsPage"; // Import for individual order details
import ImportPage from "./pages/DashboardAdmin/ImportPage";
 
import PaymentsPage from "./pages/DashboardAdmin/PaymentsPage";
import ContactPage from "./pages/Contact";
import AddOrder from "./pages/DashboardAdmin/AddOrder";
  import Unpaid from "./pages/DashboardAdmin/Unpaid";
import Paid from "./pages/DashboardAdmin/Paid";
import { PriceProvider } from "./context/PriceProvider";




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
    <PriceProvider>

      <Header userRole={userRole} setUserRole={setUserRole} />

      <Routes  >
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login setUserRole={setUserRole} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/clientdash" element={<DashboardClient />} />
        <Route path="/archive" element={<Archive />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/clients" element={<ClientsPage />} />
        <Route path="/history" element={<HistoryPage />} />
        <Route path="/import" element={<ImportPage />} />
        <Route path="/add" element={<AddOrder />} />

        <Route path="/payment" element={<PaymentsPage />} />
        <Route path="/unpaid" element={<Unpaid />} />
        <Route path="/paid" element={<Paid />} />

 

        <Route path="/contact" element={<ContactPage />} />
 
        

        
        
        
        {/* Define the route for order details page with /history/:id path */}
        <Route path="/details/:trackCode" element={<OrderDetailsPage />} />

 


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
    </PriceProvider>

    </>
  );
}

export default App;
