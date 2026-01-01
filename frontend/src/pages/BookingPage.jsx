import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { api, getUserId } from "../api";
import { useAuth } from "../context/AuthContext";

export function BookingPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [flights, setFlights] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [cars, setCars] = useState([]);
  const [packages, setPackages] = useState([]);
  const [type, setType] = useState("package");
  const [selection, setSelection] = useState({ flight: "", hotel: "", car: "", travelPackage: "" });
  const [dates, setDates] = useState({ startDate: "", endDate: "" });
  const [price, setPrice] = useState("");
  const [message, setMessage] = useState("");
  const [pending, setPending] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [f, h, c, p] = await Promise.all([
          api.getFlights(),
          api.getHotels(),
          api.getCars(),
          api.getPackages(),
        ]);
        setFlights(f || []);
        setHotels(h || []);
        setCars(c || []);
        setPackages(p || []);

        const urlType = searchParams.get("type");
        const flightId = searchParams.get("flightId");
        const hotelId = searchParams.get("hotelId");
        const carId = searchParams.get("carId");
        const packageId = searchParams.get("packageId");

        if (packageId) {
          setType("package");
          setSelection({ ...selection, travelPackage: packageId });
          const pkg = p.find(pkg => pkg._id === packageId);
          if (pkg) {
            setPrice(pkg.discountedPrice || pkg.price);
          }
        } else if (urlType === "flight" && flightId) {
          setType("flight");
          setSelection({ ...selection, flight: flightId });
          const flight = f.find(fl => fl._id === flightId);
          if (flight) setPrice(flight.price);
        } else if (urlType === "hotel" && hotelId) {
          setType("hotel");
          setSelection({ ...selection, hotel: hotelId });
          const hotel = h.find(ht => ht._id === hotelId);
          if (hotel) setPrice(hotel.pricePerNight);
        } else if (urlType === "car" && carId) {
          setType("car");
          setSelection({ ...selection, car: carId });
          const car = c.find(cr => cr._id === carId);
          if (car) setPrice(car.pricePerDay);
        }
      } catch (err) {
      }
    };
    fetchData();
  }, [searchParams]);

  const options = useMemo(() => ({
    flight: flights.map((f) => ({ id: f._id, label: `${f.airline} ${f.flightNumber} (${f.origin} → ${f.destination})`, price: f.price })),
    hotel: hotels.map((h) => ({ id: h._id, label: `${h.name} · ${h.location}`, price: h.pricePerNight })),
    car: cars.map((c) => ({ id: c._id, label: `${c.make} ${c.model} · ${c.location}`, price: c.pricePerDay })),
    package: packages.map((p) => ({ id: p._id, label: `${p.title} · ${p.destination}`, price: p.price })),
  }), [flights, hotels, cars, packages]);

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
        user: getUserId(),
      };

      if (type === "package") {
        if (!selection.travelPackage) {
          setMessage("Please select a package");
          setPending(false);
          return;
        }
        payload.travelPackage = selection.travelPackage;
      } else if (type === "custom") {
        if (!selection.flight && !selection.car) {
          setMessage("For custom bookings, select at least one transportation (flight or car)");
          setPending(false);
          return;
        }
        payload.flight = selection.flight || undefined;
        payload.hotel = selection.hotel || undefined;
        payload.car = selection.car || undefined;
      } else {
        if (!selection[type]) {
          setMessage(`Please select a ${type}`);
          setPending(false);
          return;
        }
        payload[type] = selection[type];
      }

      const res = await api.createBooking(payload);
      setMessage(`Booking created successfully! ID: ${res._id}`);
      setTimeout(() => navigate("/my-bookings"), 2000);
      setSelection({ flight: "", hotel: "", car: "", travelPackage: "" });
      setDates({ startDate: "", endDate: "" });
      setPrice("");
    } catch (err) {
      setMessage(err.message || "Failed to create booking");
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-4xl font-display font-semibold text-white mb-2">Create Booking</h1>
        <p className="text-sand/70 mb-8">Book a full package or choose individual services</p>

        <div className="glass rounded-2xl border border-white/10 p-8">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm text-sand/70 mb-3">What would you like to book?</label>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                {["package", "flight", "hotel", "car", "custom"].map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setType(t)}
                    className={`px-4 py-3 rounded-lg border text-sm font-medium transition ${
                      type === t
                        ? "bg-sky text-midnight border-sky"
                        : "bg-white/5 border-white/15 text-sand/80 hover:bg-white/10"
                    }`}
                  >
                    {t === "custom" ? "Custom Trip" : t.charAt(0).toUpperCase() + t.slice(1)}
                  </button>
                ))}
              </div>
              <p className="text-xs text-sand/50 mt-2">
                {type === "package" && "✨ Complete travel packages with everything included"}
                {type === "flight" && "✈️ Book flights only"}
                {type === "hotel" && "🏨 Book hotels only"}
                {type === "car" && "🚗 Book rental cars only"}
                {type === "custom" && "🎯 Create your own trip by combining flight/car + hotel"}
              </p>
            </div>

            {type === "package" ? (
              <Select
                label="Select Package"
                value={selection.travelPackage}
                onChange={(e) => setSelection({ ...selection, travelPackage: e.target.value })}
                options={options.package}
                required
              />
            ) : type === "custom" ? (
              <>
                <div className="bg-sky/10 border border-sky/30 rounded-lg p-4 mb-4">
                  <p className="text-sm text-sky font-medium">💡 Custom Trip Builder</p>
                  <p className="text-xs text-sand/70 mt-1">
                    Choose your transportation (flight or car) and optionally add a hotel
                  </p>
                </div>
                <Select
                  label="Flight (optional)"
                  value={selection.flight}
                  onChange={(e) => setSelection({ ...selection, flight: e.target.value })}
                  options={options.flight}
                />
                <Select
                  label="Hotel (optional)"
                  value={selection.hotel}
                  onChange={(e) => setSelection({ ...selection, hotel: e.target.value })}
                  options={options.hotel}
                />
                <Select
                  label="Car (optional)"
                  value={selection.car}
                  onChange={(e) => setSelection({ ...selection, car: e.target.value })}
                  options={options.car}
                />
                <p className="text-sm text-sand/60 bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
                  ⚠️ At least one of Flight or Car must be selected
                </p>
              </>
            ) : (
              <Select
                label={`Select ${type.charAt(0).toUpperCase() + type.slice(1)}`}
                value={selection[type]}
                onChange={(e) => setSelection({ ...selection, [type]: e.target.value })}
                options={options[type]}
                required
              />
            )}

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Start Date"
                type="date"
                value={dates.startDate}
                onChange={(e) => setDates({ ...dates, startDate: e.target.value })}
                required
              />
              <Input
                label="End Date"
                type="date"
                value={dates.endDate}
                onChange={(e) => setDates({ ...dates, endDate: e.target.value })}
              />
            </div>

            <Input
              label="Total Price (৳)"
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />

            <button
              type="submit"
              disabled={pending}
              className="w-full py-3 rounded-lg bg-sky text-midnight font-semibold hover:opacity-90 transition disabled:opacity-50"
            >
              {pending ? "Booking..." : "Confirm Booking"}
            </button>
          </form>

          {message && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`mt-4 text-sm px-4 py-3 rounded-lg ${
                message.includes("success")
                  ? "bg-green-900/40 text-green-300 border border-green-500/30"
                  : "bg-red-900/40 text-red-300 border border-red-500/30"
              }`}
            >
              {message}
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

function Input({ label, ...props }) {
  return (
    <label className="flex flex-col gap-1 text-sm text-sand/70">
      <span>{label}</span>
      <input
        {...props}
        className="bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sand focus:outline-none focus:ring-2 focus:ring-sky/50"
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
        className="bg-midnight border border-white/20 rounded-lg px-4 py-3 text-sand focus:outline-none focus:ring-2 focus:ring-sky/50 cursor-pointer hover:border-sky/50 transition [&>option]:bg-midnight [&>option]:text-sand [&>option]:py-2"
      >
        <option value="" className="bg-midnight text-sand/60">Select {label}</option>
        {options.map((opt) => (
          <option key={opt.id} value={opt.id} className="bg-midnight text-sand hover:bg-sky/10">
            {opt.label} {opt.price ? `- ৳${opt.price}` : ""}
          </option>
        ))}
      </select>
    </label>
  );
}
