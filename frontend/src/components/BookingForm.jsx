import { useMemo, useState } from "react";
import { api } from "../api";
import { motion } from "framer-motion";

export function BookingForm({ flights, hotels, cars }) {
  const [type, setType] = useState("flight");
  const [selection, setSelection] = useState({ flight: "", hotel: "", car: "" });
  const [dates, setDates] = useState({ startDate: "", endDate: "" });
  const [price, setPrice] = useState("");
  const [message, setMessage] = useState("");
  const [pending, setPending] = useState(false);

  const options = useMemo(() => ({
    flight: flights.map((f) => ({ id: f._id, label: `${f.airline} ${f.flightNumber} (${f.origin} → ${f.destination})` })),
    hotel: hotels.map((h) => ({ id: h._id, label: `${h.name} · ${h.location}` })),
    car: cars.map((c) => ({ id: c._id, label: `${c.make} ${c.model} · ${c.location}` })),
  }), [flights, hotels, cars]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setPending(true);
    setMessage("");
    try {
      const payload = {
        type,
        startDate: dates.startDate,
        endDate: dates.endDate,
        totalPrice: Number(price) || 0,
        flight: selection.flight || undefined,
        hotel: selection.hotel || undefined,
        car: selection.car || undefined,
        user: "demo-user", // replace with logged-in user id in real app
      };
      const res = await api.createBooking(payload);
      setMessage(`Booking created: ${res._id}`);
      setSelection({ flight: "", hotel: "", car: "" });
      setDates({ startDate: "", endDate: "" });
      setPrice("");
    } catch (err) {
      setMessage(err.message || "Failed to create booking");
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="glass rounded-2xl border border-white/10 p-5">
      <h3 className="text-lg font-semibold text-white mb-3">Quick Booking</h3>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 gap-2">
          <button type="button" onClick={() => setType("flight")} className={btn(type === "flight")}>Flight</button>
          <button type="button" onClick={() => setType("hotel")} className={btn(type === "hotel")}>Hotel</button>
          <button type="button" onClick={() => setType("car")} className={btn(type === "car")}>Car</button>
          <button type="button" onClick={() => setType("package")} className={btn(type === "package")}>Package</button>
        </div>

        <Select
          label={`${cap(type)} Choice`}
          value={selection[type] || ""}
          onChange={(e) => setSelection({ ...selection, [type]: e.target.value })}
          options={options[type] || []}
        />

        <div className="grid grid-cols-2 gap-3">
          <Input label="Start" type="date" value={dates.startDate} onChange={(e) => setDates({ ...dates, startDate: e.target.value })} />
          <Input label="End" type="date" value={dates.endDate} onChange={(e) => setDates({ ...dates, endDate: e.target.value })} />
        </div>

        <Input label="Total Price ($)" type="number" value={price} onChange={(e) => setPrice(e.target.value)} />

        <button type="submit" disabled={pending} className="w-full py-3 rounded-lg bg-sky text-midnight font-semibold hover:opacity-90 transition">
          {pending ? "Booking..." : "Book Now"}
        </button>
      </form>
      {message && (
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-3 text-sm text-sand/80">
          {message}
        </motion.p>
      )}
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

function Select({ label, options, ...props }) {
  return (
    <label className="flex flex-col gap-1 text-sm text-sand/70">
      <span>{label}</span>
      <select
        {...props}
        className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sand focus:outline-none focus:ring-2 focus:ring-sky/50"
      >
        <option value="">Select</option>
        {options.map((opt) => (
          <option key={opt.id} value={opt.id}>{opt.label}</option>
        ))}
      </select>
    </label>
  );
}

function btn(active) {
  return `px-3 py-2 rounded-lg border text-sm ${active ? "bg-sky text-midnight border-sky" : "bg-white/5 border-white/15 text-sand/80"}`;
}

function cap(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
