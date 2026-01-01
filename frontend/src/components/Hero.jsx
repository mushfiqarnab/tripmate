import { motion } from "framer-motion";
import { RocketLaunchIcon } from "@heroicons/react/24/solid";

export function Hero({ onRefresh, loading }) {
  return (
    <div className="relative overflow-hidden py-14 sm:py-20 mb-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="max-w-6xl mx-auto px-4"
      >
        <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-10 items-center">
          <div>
            <p className="text-sky text-sm uppercase tracking-[0.3em] mb-3">TripMate</p>
            <h1 className="text-4xl sm:text-5xl font-display font-semibold text-white leading-tight">
              Build bold itineraries with flights, stays, and rides in one flow.
            </h1>
            <p className="mt-4 text-sand/80 max-w-xl">
              Curated packages, smooth booking, and real-time availability. Designed for explorers who want clarity and speed.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <button
                onClick={onRefresh}
                disabled={loading}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-sky/20 text-sky border border-sky/40 hover:bg-sky/30 transition"
              >
                <RocketLaunchIcon className="h-5 w-5" />
                {loading ? "Refreshing..." : "Refresh Data"}
              </button>
              <span className="px-4 py-2 rounded-full border border-white/10 text-sm text-sand/70">Live API-backed UI</span>
            </div>
          </div>
          <div className="glass rounded-2xl p-6 border border-white/10 shadow-glow">
            <div className="grid grid-cols-2 gap-4 text-sm text-sand/80">
              <Stat label="Flights curated" value="500+" />
              <Stat label="Hotels rated" value="1.2k" />
              <Stat label="Cars ready" value="850" />
              <Stat label="Avg. save" value="18%" />
            </div>
            <div className="mt-6 h-40 rounded-xl bg-gradient-to-br from-sky/15 via-white/5 to-blush/10" />
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div className="card-hover glass rounded-xl px-4 py-3 border border-white/5">
      <p className="text-xs uppercase tracking-wide text-sand/60">{label}</p>
      <p className="text-xl font-semibold text-white">{value}</p>
    </div>
  );
}
