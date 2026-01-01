import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { api } from "../api";
import { TruckIcon } from "@heroicons/react/24/outline";

export function Cars() {
  const navigate = useNavigate();
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCars = async () => {
      setLoading(true);
      try {
        const data = await api.getCars();
        setCars(data || []);
      } finally {
        setLoading(false);
      }
    };
    fetchCars();
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
        <h1 className="text-4xl font-display font-semibold text-white mb-2">Available Cars</h1>
        <p className="text-sand/70 mb-8">Rent a car for your journey</p>
        
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {cars.map((car, idx) => (
            <motion.div
              key={car._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="glass card-hover rounded-2xl p-5 border border-white/10"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-sky to-blush flex items-center justify-center">
                  <TruckIcon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">{car.make} {car.model}</h3>
                  <p className="text-sm text-sand/70">{car.year}</p>
                </div>
              </div>
              
              <div className="space-y-2 text-sm text-sand/80 mb-4">
                <div className="flex justify-between">
                  <span>Location:</span>
                  <span className="text-white font-medium">{car.location}</span>
                </div>
                <div className="flex justify-between">
                  <span>Status:</span>
                  <span className={`font-medium ${car.isAvailable ? "text-green-400" : "text-red-400"}`}>
                    {car.isAvailable ? "Available" : "Rented"}
                  </span>
                </div>
              </div>

              <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                <div>
                  <p className="text-2xl font-semibold text-white">৳{car.pricePerDay}</p>
                  <p className="text-xs text-sand/60">per day</p>
                </div>
                <button
                  onClick={() => car.isAvailable && navigate(`/booking?type=car&carId=${car._id}`)}
                  disabled={!car.isAvailable}
                  className="px-4 py-2 rounded-lg bg-sand text-midnight text-sm font-semibold hover:bg-white transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {car.isAvailable ? "Book" : "Unavailable"}
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {cars.length === 0 && !loading && (
          <div className="text-center py-12 text-sand/60">No cars available</div>
        )}
      </motion.div>
    </div>
  );
}
