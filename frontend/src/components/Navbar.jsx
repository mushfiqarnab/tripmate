import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";
import { UserCircleIcon, ArrowRightOnRectangleIcon } from "@heroicons/react/24/outline";

export function Navbar() {
  const { user, logout } = useAuth();

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="sticky top-0 z-50 glass border-b border-white/10 backdrop-blur-xl"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-sky to-blush" />
            <span className="text-xl font-display font-semibold text-white">TripMate</span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            <NavLink to="/packages">Packages</NavLink>
            <NavLink to="/flights">Flights</NavLink>
            <NavLink to="/hotels">Hotels</NavLink>
            <NavLink to="/cars">Cars</NavLink>
            {user && <NavLink to="/booking">Book Now</NavLink>}
            {user && <NavLink to="/my-bookings">My Bookings</NavLink>}
            {user && user.type === "admin" && <NavLink to="/admin">Admin</NavLink>}
          </div>

          <div className="flex items-center gap-3">
            {user ? (
              <>
                <div className="flex items-center gap-2 text-sm text-sand/80">
                  <UserCircleIcon className="h-5 w-5" />
                  <span>{user.name}</span>
                </div>
                <button
                  onClick={logout}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sand hover:bg-white/10 transition"
                >
                  <ArrowRightOnRectangleIcon className="h-5 w-5" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-lg text-sand hover:bg-white/5 transition"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="px-4 py-2 rounded-lg bg-sky text-midnight font-semibold hover:opacity-90 transition"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </motion.nav>
  );
}

function NavLink({ to, children }) {
  return (
    <Link
      to={to}
      className="text-sand/80 hover:text-white transition-colors text-sm font-medium"
    >
      {children}
    </Link>
  );
}
