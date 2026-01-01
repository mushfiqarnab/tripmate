import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { api } from "../api";
import { 
  MapPinIcon, 
  CalendarIcon, 
  CurrencyDollarIcon, 
  ClockIcon,
  CheckCircleIcon,
  SparklesIcon
} from "@heroicons/react/24/outline";

export function PackageDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pkg, setPkg] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPackage = async () => {
      try {
        const data = await api.getPackage(id);
        setPkg(data);
      } finally {
        setLoading(false);
      }
    };
    fetchPackage();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="glass rounded-2xl h-96 animate-pulse" />
      </div>
    );
  }

  if (!pkg) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="glass rounded-2xl p-12 text-center">
          <p className="text-sand/60">Package not found</p>
          <button onClick={() => navigate("/packages")} className="mt-4 px-6 py-2 rounded-lg bg-sky text-midnight font-semibold">
            Back to Packages
          </button>
        </div>
      </div>
    );
  }

  const displayPrice = pkg.isBonusDeal && pkg.discountedPrice ? pkg.discountedPrice : pkg.price;
  const hasDiscount = pkg.isBonusDeal && pkg.discountedPrice && pkg.discountedPrice < pkg.price;

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <button 
          onClick={() => navigate("/packages")} 
          className="mb-6 px-4 py-2 rounded-lg bg-white/5 text-sand/80 hover:bg-white/10 transition"
        >
          ← Back to Packages
        </button>

        <div className="glass rounded-2xl overflow-hidden border border-white/10">
          {/* Header Image */}
          <div className="h-80 bg-gradient-to-br from-sky/30 to-blush/20 relative">
            {pkg.isBonusDeal && (
              <div className="absolute top-4 right-4 px-4 py-2 rounded-full bg-blush text-white font-semibold flex items-center gap-2">
                <SparklesIcon className="h-5 w-5" />
                Bonus Deal
              </div>
            )}
          </div>

          <div className="p-8">
            {/* Title Section */}
            <div className="mb-6">
              <h1 className="text-4xl font-display font-semibold text-white mb-2">{pkg.title}</h1>
              <div className="flex items-center gap-2 text-sand/70">
                <MapPinIcon className="h-5 w-5" />
                <span>{pkg.destination}</span>
              </div>
            </div>

            {/* Price & Duration */}
            <div className="flex flex-wrap items-center gap-6 mb-8 pb-8 border-b border-white/10">
              <div>
                <div className="flex items-center gap-3">
                  <span className="text-4xl font-bold text-white">৳{displayPrice.toLocaleString()}</span>
                  {hasDiscount && (
                    <span className="text-xl text-sand/50 line-through">৳{pkg.price.toLocaleString()}</span>
                  )}
                </div>
                <p className="text-sm text-sand/60 mt-1">per person</p>
              </div>
              <div className="flex items-center gap-2 text-sand/80">
                <ClockIcon className="h-5 w-5" />
                <span>{pkg.duration} Days</span>
              </div>
            </div>

            {/* Description */}
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-3">About This Package</h2>
              <p className="text-sand/80 leading-relaxed">{pkg.description}</p>
            </div>

            {/* Activities */}
            {pkg.activities && pkg.activities.length > 0 && (
              <div className="mb-8">
                <h2 className="text-2xl font-semibold text-white mb-3">Activities</h2>
                <div className="flex flex-wrap gap-3">
                  {pkg.activities.map((activity, i) => (
                    <span key={i} className="px-4 py-2 rounded-full bg-sky/20 text-sky border border-sky/30">
                      {activity}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Itinerary */}
            {pkg.itinerary && (
              <div className="mb-8">
                <h2 className="text-2xl font-semibold text-white mb-3">Itinerary</h2>
                <p className="text-sand/80 leading-relaxed whitespace-pre-line">{pkg.itinerary}</p>
              </div>
            )}

            {/* Inclusions */}
            {pkg.inclusions && pkg.inclusions.length > 0 && (
              <div className="mb-8">
                <h2 className="text-2xl font-semibold text-white mb-3">What's Included</h2>
                <div className="grid sm:grid-cols-2 gap-3">
                  {pkg.inclusions.map((item, i) => (
                    <div key={i} className="flex items-center gap-2 text-sand/80">
                      <CheckCircleIcon className="h-5 w-5 text-green-400" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Book Button */}
            <button
              onClick={() => navigate(`/booking?type=package&packageId=${pkg._id}`)}
              className="w-full py-4 rounded-lg bg-sky text-midnight text-lg font-semibold hover:opacity-90 transition"
            >
              Book This Package
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
