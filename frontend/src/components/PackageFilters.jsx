import { Switch } from "@headlessui/react";
import clsx from "clsx";

export function PackageFilters({ filters, setFilters, onApply }) {
  return (
    <div className="glass rounded-2xl p-4 sm:p-6 border border-white/10 shadow-glow mb-6">
      <div className="flex flex-wrap gap-4 items-end">
        <Input
          label="Destination"
          placeholder="e.g. Bali"
          value={filters.destination}
          onChange={(e) => setFilters({ ...filters, destination: e.target.value })}
        />
        <Input
          label="Max Budget ($)"
          type="number"
          placeholder="1200"
          value={filters.maxPrice}
          onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
        />
        <Input
          label="Min Days"
          type="number"
          placeholder="3"
          value={filters.minDuration}
          onChange={(e) => setFilters({ ...filters, minDuration: e.target.value })}
        />
        <Input
          label="Max Days"
          type="number"
          placeholder="10"
          value={filters.maxDuration}
          onChange={(e) => setFilters({ ...filters, maxDuration: e.target.value })}
        />
        <div className="flex items-center gap-3 ml-auto">
          <label className="text-sm text-sand/70">Bonus Deals</label>
          <Switch
            checked={filters.isBonusDeal}
            onChange={(v) => setFilters({ ...filters, isBonusDeal: v })}
            className={clsx(
              filters.isBonusDeal ? "bg-sky" : "bg-white/10",
              "relative inline-flex h-6 w-11 items-center rounded-full transition"
            )}
          >
            <span
              className={clsx(
                filters.isBonusDeal ? "translate-x-6" : "translate-x-1",
                "inline-block h-4 w-4 transform rounded-full bg-white transition"
              )}
            />
          </Switch>
          <button
            onClick={onApply}
            className="px-4 py-2 rounded-lg bg-sky/20 text-sky border border-sky/40 hover:bg-sky/30 text-sm"
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
}

function Input({ label, ...props }) {
  return (
    <label className="flex flex-col gap-1 text-sm text-sand/70">
      <span>{label}</span>
      <input
        {...props}
        className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sand focus:outline-none focus:ring-2 focus:ring-sky/50"
      />
    </label>
  );
}
