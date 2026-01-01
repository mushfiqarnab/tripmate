import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { api } from "../api";
import { PackageFilters } from "../components/PackageFilters";
import { PackageGrid } from "../components/PackageGrid";

export function Packages() {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({ destination: "", maxPrice: "", minDuration: "", maxDuration: "", isBonusDeal: false });

  const fetchPackages = async () => {
    setLoading(true);
    try {
      const query = buildQuery(filters);
      const data = await api.getPackages(query);
      setPackages(data || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-4xl font-display font-semibold text-white mb-2">Travel Packages</h1>
        <p className="text-sand/70 mb-8">Discover curated travel experiences with all-inclusive packages</p>
        
        <PackageFilters filters={filters} setFilters={setFilters} onApply={fetchPackages} />
        <PackageGrid packages={packages} loading={loading} />
      </motion.div>
    </div>
  );
}

function buildQuery(filters) {
  const params = new URLSearchParams();
  if (filters.destination) params.append("destination", filters.destination);
  if (filters.maxPrice) params.append("maxPrice", filters.maxPrice);
  if (filters.minDuration) params.append("minDuration", filters.minDuration);
  if (filters.maxDuration) params.append("maxDuration", filters.maxDuration);
  if (filters.isBonusDeal) params.append("isBonusDeal", "true");
  const qs = params.toString();
  return qs ? `?${qs}` : "";
}
