import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { SparklesIcon } from "@heroicons/react/24/solid";

export function PackageGrid({ packages, loading }) {
  const navigate = useNavigate();
  if (loading) {
    return (
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-48 glass rounded-2xl animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {packages.map((pkg, idx) => (
        <motion.div
          key={pkg._id || idx}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.05, duration: 0.4 }}
          className="glass card-hover rounded-2xl p-5 border border-white/10"
        >
          <div className="flex items-start gap-3">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-sky to-blush flex items-center justify-center text-midnight font-semibold">
              {pkg.destination?.slice(0, 2)?.toUpperCase() || "TM"}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-semibold text-white">{pkg.title}</h3>
                {pkg.isBonusDeal && (
                  <span className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-sky/20 text-sky">
                    <SparklesIcon className="h-4 w-4" /> Bonus
                  </span>
                )}
              </div>
              <p className="text-sm text-sand/70">{pkg.destination}</p>
            </div>
          </div>
          <p className="mt-3 text-sm text-sand/80 line-clamp-2">{pkg.description || "Curated escape with flights, stays, and rides."}</p>
          <div className="mt-4 flex items-center justify-between text-sm">
            <div>
              <p className="text-white text-lg font-semibold">৳{(pkg.discountedPrice || pkg.price).toLocaleString()}</p>
              <p className="text-sand/60">{pkg.duration} days</p>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => navigate(`/packages/${pkg._id}`)}
                className="px-3 py-2 rounded-lg bg-white/5 border border-white/20 text-sand text-sm font-medium hover:bg-white/10 transition"
              >
                View
              </button>
              <button 
                onClick={() => navigate(`/booking?packageId=${pkg._id}`)}
                className="px-3 py-2 rounded-lg bg-sky text-midnight text-sm font-semibold hover:opacity-90 transition"
              >
                Book
              </button>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
