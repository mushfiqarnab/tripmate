import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { api } from "../api";
import { BuildingOfficeIcon, StarIcon } from "@heroicons/react/24/solid";

export function Hotels() {
  const navigate = useNavigate();
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchHotels = async () => {
      setLoading(true);
      try {
        const data = await api.getHotels();
        setHotels(data || []);
      } finally {
        setLoading(false);
      }
    };
    fetchHotels();
  }, []);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-56 glass rounded-2xl animate-pulse" />
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
        <h1 className="text-4xl font-display font-semibold text-white mb-2">Available Hotels</h1>
        <p className="text-sand/70 mb-8">Choose from our selection of comfortable accommodations</p>
        
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {hotels.map((hotel, idx) => (
            <motion.div
              key={hotel._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="glass card-hover rounded-2xl overflow-hidden border border-white/10"
            >
              <div className="h-40 bg-gradient-to-br from-blush/30 to-sky/20 flex items-center justify-center">
                <BuildingOfficeIcon className="h-16 w-16 text-white/40" />
              </div>
              
              <div className="p-5">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-lg font-semibold text-white">{hotel.name}</h3>
                  {hotel.rating > 0 && (
                    <div className="flex items-center gap-1 text-sm">
                      <StarIcon className="h-4 w-4 text-yellow-400" />
                      <span className="text-white">{hotel.rating}</span>
                    </div>
                  )}
                </div>
                <p className="text-sm text-sand/70 mb-3">{hotel.location}</p>
                
                {hotel.amenities && hotel.amenities.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {hotel.amenities.slice(0, 3).map((amenity, i) => (
                      <span key={i} className="text-xs px-2 py-1 rounded-full bg-white/5 text-sand/70">
                        {amenity}
                      </span>
                    ))}
                  </div>
                )}

                <div className="flex items-center justify-between pt-3 border-t border-white/10">
                  <div>
                    <p className="text-2xl font-semibold text-white">৳{hotel.pricePerNight}</p>
                    <p className="text-xs text-sand/60">per night</p>
                  </div>
                  <button 
                    onClick={() => navigate(`/booking?type=hotel&hotelId=${hotel._id}`)}
                    className="px-4 py-2 rounded-lg bg-sand text-midnight text-sm font-semibold hover:bg-white transition"
                  >
                    Book
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {hotels.length === 0 && !loading && (
          <div className="text-center py-12 text-sand/60">No hotels available</div>
        )}
      </motion.div>
    </div>
  );
}
