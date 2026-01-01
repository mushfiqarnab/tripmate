import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { Navbar } from "./components/Navbar";
import { Home } from "./pages/Home";
import { Login } from "./pages/Login";
import { Signup } from "./pages/Signup";
import { Packages } from "./pages/Packages";
import { PackageDetail } from "./pages/PackageDetail";
import { Flights } from "./pages/Flights";
import { Hotels } from "./pages/Hotels";
import { Cars } from "./pages/Cars";
import { BookingPage } from "./pages/BookingPage";
import { MyBookings } from "./pages/MyBookings";
import { AdminDashboard } from "./pages/AdminDashboard";

function PrivateRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
}

function AdminRoute({ children }) {
  const { user } = useAuth();
  return user && user.type === "admin" ? children : <Navigate to="/" />;
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="min-h-screen">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/packages" element={<Packages />} />
            <Route path="/packages/:id" element={<PackageDetail />} />
            <Route path="/flights" element={<Flights />} />
            <Route path="/hotels" element={<Hotels />} />
            <Route path="/cars" element={<Cars />} />
            <Route path="/booking" element={<PrivateRoute><BookingPage /></PrivateRoute>} />
            <Route path="/my-bookings" element={<PrivateRoute><MyBookings /></PrivateRoute>} />
            <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
          </Routes>
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}
