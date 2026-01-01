import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { api, getUserId } from "../api";
import { CalendarIcon, XCircleIcon, ExclamationTriangleIcon, CheckCircleIcon } from "@heroicons/react/24/outline";

export function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState(null);
  const [notification, setNotification] = useState(null);

  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const data = await api.getUserBookings(getUserId());
      setBookings(data || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCancel = async (id) => {
    setConfirmDialog({
      message: "Are you sure you want to cancel this booking? This action cannot be undone.",
      onConfirm: async () => {
        try {
          await api.cancelBooking(id);
          fetchBookings();
          showNotification("Booking cancelled successfully");
        } catch (err) {
          showNotification(err.message || "Failed to cancel booking", "error");
        }
      }
    });
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-32 glass rounded-2xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <AnimatePresence>
        {confirmDialog && (
          <ConfirmDialog
            message={confirmDialog.message}
            onConfirm={() => {
              confirmDialog.onConfirm();
              setConfirmDialog(null);
            }}
            onCancel={() => setConfirmDialog(null)}
          />
        )}
        {notification && (
          <Notification message={notification.message} type={notification.type} />
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-4xl font-display font-semibold text-white mb-2">My Bookings</h1>
        <p className="text-sand/70 mb-8">Manage your travel bookings</p>

        {bookings.length === 0 && !loading && (
          <div className="glass rounded-2xl p-12 text-center border border-white/10">
            <p className="text-sand/60">No bookings yet</p>
          </div>
        )}

        <div className="space-y-4">
          {bookings.map((booking, idx) => (
            <motion.div
              key={booking._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="glass card-hover rounded-2xl p-6 border border-white/10"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getTypeColor(booking.type)}`}>
                      {booking.type.toUpperCase()}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                      {booking.status.toUpperCase()}
                    </span>
                  </div>

                  <div className="space-y-2 text-sm">
                    {booking.flight && (
                      <p className="text-sand/80">
                        Flight: <span className="text-white">{booking.flight.airline} {booking.flight.flightNumber}</span>
                      </p>
                    )}
                    {booking.hotel && (
                      <p className="text-sand/80">
                        Hotel: <span className="text-white">{booking.hotel.name}</span>
                      </p>
                    )}
                    {booking.car && (
                      <p className="text-sand/80">
                        Car: <span className="text-white">{booking.car.make} {booking.car.model}</span>
                      </p>
                    )}
                    {booking.travelPackage && (
                      <p className="text-sand/80">
                        Package: <span className="text-white">{booking.travelPackage.title}</span>
                      </p>
                    )}
                    <p className="flex items-center gap-2 text-sand/80">
                      <CalendarIcon className="h-4 w-4" />
                      {new Date(booking.startDate).toLocaleDateString()}
                      {booking.endDate && ` - ${new Date(booking.endDate).toLocaleDateString()}`}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-2xl font-semibold text-white mb-2">${booking.totalPrice}</p>
                  {booking.status === "confirmed" && (
                    <button
                      onClick={() => handleCancel(booking._id)}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/20 text-red-300 border border-red-500/30 hover:bg-red-500/30 transition text-sm"
                    >
                      <XCircleIcon className="h-4 w-4" />
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

function getTypeColor(type) {
  const colors = {
    flight: "bg-sky/20 text-sky",
    hotel: "bg-blush/20 text-blush",
    car: "bg-purple-500/20 text-purple-300",
    package: "bg-green-500/20 text-green-300",
    custom: "bg-yellow-500/20 text-yellow-300",
  };
  return colors[type] || "bg-white/10 text-sand";
}

function getStatusColor(status) {
  const colors = {
    confirmed: "bg-green-500/20 text-green-300 border border-green-500/30",
    pending: "bg-yellow-500/20 text-yellow-300 border border-yellow-500/30",
    cancelled: "bg-red-500/20 text-red-300 border border-red-500/30",
  };
  return colors[status] || "bg-white/10 text-sand";
}

function ConfirmDialog({ message, onConfirm, onCancel }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onCancel}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        className="glass rounded-2xl border border-red-500/30 p-6 w-full max-w-md"
      >
        <div className="flex items-start gap-4 mb-6">
          <div className="p-3 rounded-full bg-red-500/20">
            <ExclamationTriangleIcon className="h-6 w-6 text-red-400" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-white mb-2">Confirm Cancellation</h3>
            <p className="text-sand/80">{message}</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button
            onClick={onConfirm}
            className="flex-1 py-3 rounded-lg bg-red-500 text-white font-semibold hover:bg-red-600 transition"
          >
            Cancel Booking
          </button>
          <button
            onClick={onCancel}
            className="flex-1 py-3 rounded-lg bg-white/10 text-sand hover:bg-white/20 transition"
          >
            Keep Booking
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

function Notification({ message, type }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -50, x: "-50%" }}
      animate={{ opacity: 1, y: 0, x: "-50%" }}
      exit={{ opacity: 0, y: -50, x: "-50%" }}
      className="fixed top-6 left-1/2 z-50 glass rounded-xl border border-white/20 px-6 py-4 shadow-2xl max-w-md"
    >
      <div className="flex items-center gap-3">
        {type === "success" ? (
          <CheckCircleIcon className="h-6 w-6 text-green-400 flex-shrink-0" />
        ) : (
          <ExclamationTriangleIcon className="h-6 w-6 text-red-400 flex-shrink-0" />
        )}
        <p className={`font-medium ${type === "success" ? "text-green-300" : "text-red-300"}`}>
          {message}
        </p>
      </div>
    </motion.div>
  );
}
