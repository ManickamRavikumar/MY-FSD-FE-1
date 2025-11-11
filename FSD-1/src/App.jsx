// src/App.jsx
import { useContext, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './Components/Navbar';
import { AuthContext } from './Context/AuthContext';
import Home from './Pages/Home';
import FoodDetails from './Pages/Fooddetails';
import Login from './Pages/Login';
import Signin from './Pages/Signin';
import Cart from './Pages/Cart';
import AdminDashboard from './Admin/AdminDashboard';
import Order from './Pages/Order';
import OrderSuccess from './Pages/OrderSuccess';
import OrderHistory from './Pages/OrderHistory';
import DeliveryBoyDashboard from './Admin/DeliveryBoyDashbord';
import socket from './socket'; // ✅ import socket instance

function App() {
  const { user } = useContext(AuthContext);

  useEffect(() => {
    console.log("👤 User data from AuthContext:", user);

    // ✅ Socket.io Connection Setup
    socket.on("connect", () => {
      console.log("🟢 Connected to backend via socket:", socket.id);

      // Send a test message to the backend
      socket.emit("helloFromClient", { msg: "Hi from frontend 👋" });
    });

    // Listen for messages from backend
    socket.on("serverMessage", (data) => {
      console.log("📩 Message from server:", data);
    });

    // Handle disconnection
    socket.on("disconnect", () => {
      console.log("🔴 Disconnected from backend socket");
    });

    // ✅ Cleanup when component unmounts
    return () => {
      socket.off("connect");
      socket.off("serverMessage");
      socket.off("disconnect");
    };
  }, [user]);

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/food/:id" element={<FoodDetails />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/order" element={<Order />} />
        <Route path="/ordersuccess" element={<OrderSuccess />} />
        <Route path="/orderhistory" element={<OrderHistory />} />
        <Route
          path="/admin"
          element={
            user && user.role?.toLowerCase() === "admin" ? (
              <AdminDashboard />
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route
          path="/delivery"
          element={
            user && user.role?.toLowerCase() === "delivery" ? (
              <DeliveryBoyDashboard user={user} />
            ) : (
              <Navigate to="/" />
            )
          }
        />
      </Routes>
    </>
  );
}

export default App;
