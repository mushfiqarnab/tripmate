import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "../api";
import { PackageFilters } from "../components/PackageFilters";
import { PackageGrid } from "../components/PackageGrid";
import { Hero } from "../components/Hero";
import { InventoryQuickLook } from "../components/InventoryQuickLook";

export function Home() {
  const [packages, setPackages] = useState([]);
  const [flights, setFlights] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({ destination: "", maxPrice: "", minDuration: "", maxDuration: "", isBonusDeal: false });

  const fetchData = async () => {
    setLoading(true);
    setError("");
    try {
      const query = buildQuery(filters);
      const [pkgData, flightData, hotelData, carData] = await Promise.all([
        api.getPackages(query),
        api.getFlights(),
        api.getHotels(),
        api.getCars(),
      ]);
      setPackages(pkgData || []);
      setFlights(flightData || []);
      setHotels(hotelData || []);
      setCars(carData || []);
    } catch (err) {
      setError(err.message || "Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="min-h-screen">
      <Hero onRefresh={fetchData} loading={loading} />

      <section className="max-w-6xl mx-auto px-4 pb-12">
        <PackageFilters filters={filters} setFilters={setFilters} onApply={() => fetchData()} />
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-4 text-sm text-red-300 bg-red-900/40 px-4 py-3 rounded-lg border border-red-500/30"
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>
        <PackageGrid packages={packages} loading={loading} />
      </section>

      <section className="max-w-6xl mx-auto px-4 pb-16">
        <InventoryQuickLook flights={flights} hotels={hotels} cars={cars} />
      </section>
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
