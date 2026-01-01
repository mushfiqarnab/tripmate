import { motion } from "framer-motion";

export function InventoryQuickLook({ flights = [], hotels = [], cars = [] }) {
  const items = [
    { label: "Flights", count: flights.length, accent: "from-sky/30" },
    { label: "Hotels", count: hotels.length, accent: "from-blush/30" },
    { label: "Cars", count: cars.length, accent: "from-sand/30" },
  ];

  return (
    <div className="glass rounded-2xl border border-white/10 p-5">
      <h3 className="text-lg font-semibold text-white mb-4">Live Inventory</h3>
      <div className="grid sm:grid-cols-3 gap-4">
        {items.map((item, idx) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="rounded-xl p-4 border border-white/10 bg-gradient-to-br from-white/5 to-white/0"
          >
            <p className="text-sm text-sand/70">{item.label}</p>
            <p className="text-2xl font-semibold text-white">{item.count}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
