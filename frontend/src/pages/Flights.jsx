import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { api } from "../api";
import { PaperAirplaneIcon, ClockIcon } from "@heroicons/react/24/outline";

export function Flights() {
  const navigate = useNavigate();
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchFlights = async () => {
      setLoading(true);
      try {
        const data = await api.getFlights();
        setFlights(data || []);
      } finally {
        setLoading(false);
      }
    };
    fetchFlights();
  }, []);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-48 glass rounded-2xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-4xl font-display font-semibold text-white mb-2">Available Flights</h1>
        <p className="text-sand/70 mb-8">Find the perfect flight for your journey</p>
        
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {flights.map((flight, idx) => (
            <motion.div
              key={flight._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="glass card-hover rounded-2xl p-5 border border-white/10"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-sky to-blush flex items-center justify-center">
                  <PaperAirplaneIcon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">{flight.airline}</h3>
                  <p className="text-sm text-sand/70">{flight.flightNumber}</p>
                </div>
              </div>
              
              <div className="space-y-2 text-sm text-sand/80">
                <div className="flex justify-between">
                  <span>From:</span>
                  <span className="text-white font-medium">{flight.origin}</span>
                </div>
                <div className="flex justify-between">
                  <span>To:</span>
                  <span className="text-white font-medium">{flight.destination}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-1">
                    <ClockIcon className="h-4 w-4" />
                    Duration:
                  </span>
                  <span className="text-white font-medium">{flight.duration || "N/A"}</span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between">
                <div>
                  <p className="text-2xl font-semibold text-white">৳{flight.price}</p>
                  <p className="text-xs text-sand/60">per person</p>
                </div>
                <button 
                  onClick={() => navigate(`/booking?type=flight&flightId=${flight._id}`)}
                  className="px-4 py-2 rounded-lg bg-sand text-midnight text-sm font-semibold hover:bg-white transition"
                >
                  Book
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {flights.length === 0 && !loading && (
          <div className="text-center py-12 text-sand/60">No flights available</div>
        )}
      </motion.div>
    </div>
  );
}
