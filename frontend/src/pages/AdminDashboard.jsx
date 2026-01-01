import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "../api";
import { Tab } from "@headlessui/react";
import { PlusIcon, TrashIcon, PencilIcon, XMarkIcon, ExclamationTriangleIcon, CheckCircleIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState(0);
  const [confirmDialog, setConfirmDialog] = useState(null);
  const [notification, setNotification] = useState(null);
  const tabs = ["Packages", "Flights", "Hotels", "Cars", "Bookings"];

  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <AnimatePresence>
        {confirmDialog && (
          <ConfirmDialog
            message={confirmDialog.message}
            onConfirm={() => {
              confirmDialog.onConfirm();
              setConfirmDialog(null);
            }}
            onCancel={() => setConfirmDialog(null)}
          />
        )}
        {notification && (
          <Notification message={notification.message} type={notification.type} />
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-4xl font-display font-semibold text-white mb-2">Admin Dashboard</h1>
        <p className="text-sand/70 mb-8">Manage all travel resources</p>

        <Tab.Group selectedIndex={activeTab} onChange={setActiveTab}>
          <Tab.List className="flex gap-2 glass rounded-2xl p-2 border border-white/10 mb-6 overflow-x-auto">
            {tabs.map((tab) => (
              <Tab
                key={tab}
                className={({ selected }) =>
                  clsx(
                    "flex-1 px-4 py-3 rounded-lg text-sm font-medium transition whitespace-nowrap",
                    selected
                      ? "bg-sky text-midnight"
                      : "text-sand/80 hover:bg-white/5"
                  )
                }
              >
                {tab}
              </Tab>
            ))}
          </Tab.List>

          <Tab.Panels>
            <Tab.Panel><PackagesPanel setConfirmDialog={setConfirmDialog} showNotification={showNotification} /></Tab.Panel>
            <Tab.Panel><FlightsPanel setConfirmDialog={setConfirmDialog} showNotification={showNotification} /></Tab.Panel>
            <Tab.Panel><HotelsPanel setConfirmDialog={setConfirmDialog} showNotification={showNotification} /></Tab.Panel>
            <Tab.Panel><CarsPanel setConfirmDialog={setConfirmDialog} showNotification={showNotification} /></Tab.Panel>
            <Tab.Panel><BookingsPanel /></Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </motion.div>
    </div>
  );
}

function PackagesPanel({ setConfirmDialog, showNotification }) {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await api.getPackages();
      setPackages(data || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleDelete = async (id) => {
    setConfirmDialog({
      message: "Are you sure you want to delete this package? This action cannot be undone.",
      onConfirm: async () => {
        try {
          await api.deletePackage(id);
          fetchData();
          showNotification("Package deleted successfully");
        } catch (err) {
          showNotification(err.message || "Failed to delete package", "error");
        }
      }
    });
  };

  const handleEdit = (item) => {
    setEditItem(item);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditItem(null);
    fetchData();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-white">Travel Packages</h2>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-sky text-midnight font-semibold hover:opacity-90 transition"
        >
          <PlusIcon className="h-5 w-5" />
          Add Package
        </button>
      </div>

      <AnimatePresence>
        {showForm && (
          <PackageForm item={editItem} onClose={handleFormClose} />
        )}
      </AnimatePresence>

      <ResourceTable
        items={packages}
        loading={loading}
        onDelete={handleDelete}
        onEdit={handleEdit}
        columns={["Title", "Destination", "Price", "Duration", "Category"]}
        renderRow={(pkg) => (
          <>
            <td className="px-4 py-3 text-white">{pkg.title}</td>
            <td className="px-4 py-3 text-sand/80">{pkg.destination}</td>
            <td className="px-4 py-3 text-white">৳{pkg.price.toLocaleString()}</td>
            <td className="px-4 py-3 text-sand/80">{pkg.duration} days</td>
            <td className="px-4 py-3 text-sand/80">{pkg.category}</td>
          </>
        )}
      />
    </div>
  );
}

function FlightsPanel({ setConfirmDialog, showNotification }) {
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await api.getFlights();
      setFlights(data || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleDelete = async (id) => {
    setConfirmDialog({
      message: "Are you sure you want to delete this flight? This action cannot be undone.",
      onConfirm: async () => {
        try {
          await api.deleteFlight(id);
          fetchData();
          showNotification("Flight deleted successfully");
        } catch (err) {
          showNotification(err.message || "Failed to delete flight", "error");
        }
      }
    });
  };

  const handleEdit = (item) => {
    setEditItem(item);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditItem(null);
    fetchData();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-white">Flights</h2>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-sky text-midnight font-semibold hover:opacity-90 transition"
        >
          <PlusIcon className="h-5 w-5" />
          Add Flight
        </button>
      </div>

      <AnimatePresence>
        {showForm && (
          <FlightForm item={editItem} onClose={handleFormClose} />
        )}
      </AnimatePresence>

      <ResourceTable
        items={flights}
        loading={loading}
        onDelete={handleDelete}
        onEdit={handleEdit}
        columns={["Flight", "Airline", "Route", "Price"]}
        renderRow={(flight) => (
          <>
            <td className="px-4 py-3 text-white">{flight.flightNumber}</td>
            <td className="px-4 py-3 text-sand/80">{flight.airline}</td>
            <td className="px-4 py-3 text-sand/80">{flight.origin} → {flight.destination}</td>
            <td className="px-4 py-3 text-white">৳{flight.price.toLocaleString()}</td>
          </>
        )}
      />
    </div>
  );
}

function HotelsPanel({ setConfirmDialog, showNotification }) {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await api.getHotels();
      setHotels(data || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleDelete = async (id) => {
    setConfirmDialog({
      message: "Are you sure you want to delete this hotel? This action cannot be undone.",
      onConfirm: async () => {
        try {
          await api.deleteHotel(id);
          fetchData();
          showNotification("Hotel deleted successfully");
        } catch (err) {
          showNotification(err.message || "Failed to delete hotel", "error");
        }
      }
    });
  };

  const handleEdit = (item) => {
    setEditItem(item);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditItem(null);
    fetchData();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-white">Hotels</h2>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-sky text-midnight font-semibold hover:opacity-90 transition"
        >
          <PlusIcon className="h-5 w-5" />
          Add Hotel
        </button>
      </div>

      <AnimatePresence>
        {showForm && (
          <HotelForm item={editItem} onClose={handleFormClose} />
        )}
      </AnimatePresence>

      <ResourceTable
        items={hotels}
        loading={loading}
        onDelete={handleDelete}
        onEdit={handleEdit}
        columns={["Name", "Location", "Price/Night", "Rating"]}
        renderRow={(hotel) => (
          <>
            <td className="px-4 py-3 text-white">{hotel.name}</td>
            <td className="px-4 py-3 text-sand/80">{hotel.location}</td>
            <td className="px-4 py-3 text-white">৳{hotel.pricePerNight.toLocaleString()}</td>
            <td className="px-4 py-3 text-sand/80">{hotel.rating || "N/A"}</td>
          </>
        )}
      />
    </div>
  );
}

function CarsPanel({ setConfirmDialog, showNotification }) {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await api.getCars();
      setCars(data || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleDelete = async (id) => {
    setConfirmDialog({
      message: "Are you sure you want to delete this car? This action cannot be undone.",
      onConfirm: async () => {
        try {
          await api.deleteCar(id);
          fetchData();
          showNotification("Car deleted successfully");
        } catch (err) {
          showNotification(err.message || "Failed to delete car", "error");
        }
      }
    });
  };

  const handleEdit = (item) => {
    setEditItem(item);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditItem(null);
    fetchData();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-white">Cars</h2>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-sky text-midnight font-semibold hover:opacity-90 transition"
        >
          <PlusIcon className="h-5 w-5" />
          Add Car
        </button>
      </div>

      <AnimatePresence>
        {showForm && (
          <CarForm item={editItem} onClose={handleFormClose} />
        )}
      </AnimatePresence>

      <ResourceTable
        items={cars}
        loading={loading}
        onDelete={handleDelete}
        onEdit={handleEdit}
        columns={["Model", "Year", "Location", "Price/Day"]}
        renderRow={(car) => (
          <>
            <td className="px-4 py-3 text-white">{car.make} {car.model}</td>
            <td className="px-4 py-3 text-sand/80">{car.year}</td>
            <td className="px-4 py-3 text-sand/80">{car.location}</td>
            <td className="px-4 py-3 text-white">৳{car.pricePerDay.toLocaleString()}</td>
          </>
        )}
      />
    </div>
  );
}

function BookingsPanel() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await api.getAllBookings();
        setBookings(data || []);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return <div className="text-center py-12 text-sand/60">Loading...</div>;
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold text-white mb-6">All Bookings</h2>
      <div className="glass rounded-2xl border border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/5">
              <tr>
                <th className="px-4 py-3 text-left text-sm text-sand/70">User</th>
                <th className="px-4 py-3 text-left text-sm text-sand/70">Type</th>
                <th className="px-4 py-3 text-left text-sm text-sand/70">Date</th>
                <th className="px-4 py-3 text-left text-sm text-sand/70">Price</th>
                <th className="px-4 py-3 text-left text-sm text-sand/70">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {bookings.map((booking) => (
                <tr key={booking._id} className="hover:bg-white/5">
                  <td className="px-4 py-3 text-white">{booking.user?.name || "N/A"}</td>
                  <td className="px-4 py-3 text-sand/80">{booking.type}</td>
                  <td className="px-4 py-3 text-sand/80">{new Date(booking.startDate).toLocaleDateString()}</td>
                  <td className="px-4 py-3 text-white">৳{booking.totalPrice.toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      booking.status === "confirmed" ? "bg-green-500/20 text-green-300" :
                      booking.status === "cancelled" ? "bg-red-500/20 text-red-300" :
                      "bg-yellow-500/20 text-yellow-300"
                    }`}>
                      {booking.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {bookings.length === 0 && (
          <div className="text-center py-12 text-sand/60">No bookings found</div>
        )}
      </div>
    </div>
  );
}

function ResourceTable({ items, loading, onDelete, onEdit, columns, renderRow }) {
  if (loading) {
    return <div className="text-center py-12 text-sand/60">Loading...</div>;
  }

  return (
    <div className="glass rounded-2xl border border-white/10 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-white/5">
            <tr>
              {columns.map((col) => (
                <th key={col} className="px-4 py-3 text-left text-sm text-sand/70">{col}</th>
              ))}
              <th className="px-4 py-3 text-right text-sm text-sand/70">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {items.map((item) => (
              <tr key={item._id} className="hover:bg-white/5">
                {renderRow(item)}
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => onEdit(item)}
                      className="p-2 rounded-lg bg-sky/20 text-sky hover:bg-sky/30 transition"
                      title="Edit"
                    >
                      <PencilIcon className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => onDelete(item._id)}
                      className="p-2 rounded-lg bg-red-500/20 text-red-300 hover:bg-red-500/30 transition"
                      title="Delete"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {items.length === 0 && (
        <div className="text-center py-12 text-sand/60">No items found</div>
      )}
    </div>
  );
}

function PackageForm({ item, onClose }) {
  const [formData, setFormData] = useState(item || {
    title: "",
    destination: "",
    description: "",
    price: "",
    discountedPrice: "",
    duration: "",
    category: "Family",
    activities: "",
    itinerary: "",
    inclusions: "",
    isBonusDeal: false
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const payload = {
        ...formData,
        price: Number(formData.price),
        discountedPrice: formData.discountedPrice ? Number(formData.discountedPrice) : undefined,
        duration: Number(formData.duration),
        activities: formData.activities ? formData.activities.split(",").map(a => a.trim()) : [],
        inclusions: formData.inclusions ? formData.inclusions.split(",").map(i => i.trim()) : []
      };

      if (item?._id) {
        await api.updatePackage(item._id, payload);
      } else {
        await api.createPackage(payload);
      }
      onClose();
    } catch (err) {
      setError(err.message || "Failed to save package");
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormModal title={item ? "Edit Package" : "Add Package"} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input label="Title" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} required />
        <Input label="Destination" value={formData.destination} onChange={(e) => setFormData({...formData, destination: e.target.value})} required />
        <Textarea label="Description" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} />
        
        <div className="grid grid-cols-2 gap-4">
          <Input label="Price (৳)" type="number" value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} required />
          <Input label="Discounted Price (৳)" type="number" value={formData.discountedPrice} onChange={(e) => setFormData({...formData, discountedPrice: e.target.value})} />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <Input label="Duration (days)" type="number" value={formData.duration} onChange={(e) => setFormData({...formData, duration: e.target.value})} required />
          <SelectInput label="Category" value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} options={["Adventure", "Family", "Cultural", "Honeymoon", "Friendship", "educational", "Wellness"]} />
        </div>

        <Input label="Activities (comma-separated)" value={formData.activities} onChange={(e) => setFormData({...formData, activities: e.target.value})} />
        <Textarea label="Itinerary" value={formData.itinerary} onChange={(e) => setFormData({...formData, itinerary: e.target.value})} />
        <Input label="Inclusions (comma-separated)" value={formData.inclusions} onChange={(e) => setFormData({...formData, inclusions: e.target.value})} />
        
        <label className="flex items-center gap-2 text-sand/80">
          <input type="checkbox" checked={formData.isBonusDeal} onChange={(e) => setFormData({...formData, isBonusDeal: e.target.checked})} className="rounded" />
          <span>Bonus Deal</span>
        </label>

        {error && <div className="text-red-400 text-sm">{error}</div>}
        
        <div className="flex gap-3 pt-4">
          <button type="submit" disabled={loading} className="flex-1 py-3 rounded-lg bg-sky text-midnight font-semibold hover:opacity-90 transition disabled:opacity-50">
            {loading ? "Saving..." : item ? "Update Package" : "Create Package"}
          </button>
          <button type="button" onClick={onClose} className="px-6 py-3 rounded-lg bg-white/5 text-sand hover:bg-white/10 transition">
            Cancel
          </button>
        </div>
      </form>
    </FormModal>
  );
}

function FlightForm({ item, onClose }) {
  const [formData, setFormData] = useState(item || {
    flightNumber: "",
    airline: "",
    origin: "",
    destination: "",
    departureTime: "",
    arrivalTime: "",
    price: "",
    duration: "",
    seatsAvailable: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const payload = {
        ...formData,
        price: Number(formData.price),
        seatsAvailable: Number(formData.seatsAvailable),
        departureTime: new Date(formData.departureTime),
        arrivalTime: new Date(formData.arrivalTime)
      };

      if (item?._id) {
        await api.updateFlight(item._id, payload);
      } else {
        await api.createFlight(payload);
      }
      onClose();
    } catch (err) {
      setError(err.message || "Failed to save flight");
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormModal title={item ? "Edit Flight" : "Add Flight"} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Input label="Flight Number" value={formData.flightNumber} onChange={(e) => setFormData({...formData, flightNumber: e.target.value})} required />
          <Input label="Airline" value={formData.airline} onChange={(e) => setFormData({...formData, airline: e.target.value})} required />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <Input label="Origin" value={formData.origin} onChange={(e) => setFormData({...formData, origin: e.target.value})} required />
          <Input label="Destination" value={formData.destination} onChange={(e) => setFormData({...formData, destination: e.target.value})} required />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input label="Departure Time" type="datetime-local" value={formData.departureTime ? new Date(formData.departureTime).toISOString().slice(0, 16) : ""} onChange={(e) => setFormData({...formData, departureTime: e.target.value})} required />
          <Input label="Arrival Time" type="datetime-local" value={formData.arrivalTime ? new Date(formData.arrivalTime).toISOString().slice(0, 16) : ""} onChange={(e) => setFormData({...formData, arrivalTime: e.target.value})} required />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <Input label="Price (৳)" type="number" value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} required />
          <Input label="Duration" value={formData.duration} onChange={(e) => setFormData({...formData, duration: e.target.value})} placeholder="e.g., 1h 15m" />
          <Input label="Seats Available" type="number" value={formData.seatsAvailable} onChange={(e) => setFormData({...formData, seatsAvailable: e.target.value})} required />
        </div>

        {error && <div className="text-red-400 text-sm">{error}</div>}
        
        <div className="flex gap-3 pt-4">
          <button type="submit" disabled={loading} className="flex-1 py-3 rounded-lg bg-sky text-midnight font-semibold hover:opacity-90 transition disabled:opacity-50">
            {loading ? "Saving..." : item ? "Update Flight" : "Create Flight"}
          </button>
          <button type="button" onClick={onClose} className="px-6 py-3 rounded-lg bg-white/5 text-sand hover:bg-white/10 transition">
            Cancel
          </button>
        </div>
      </form>
    </FormModal>
  );
}

function HotelForm({ item, onClose }) {
  const [formData, setFormData] = useState(item || {
    name: "",
    location: "",
    pricePerNight: "",
    rating: "",
    amenities: "",
    availableRooms: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const payload = {
        ...formData,
        pricePerNight: Number(formData.pricePerNight),
        rating: formData.rating ? Number(formData.rating) : undefined,
        availableRooms: Number(formData.availableRooms),
        amenities: formData.amenities ? formData.amenities.split(",").map(a => a.trim()) : []
      };

      if (item?._id) {
        await api.updateHotel(item._id, payload);
      } else {
        await api.createHotel(payload);
      }
      onClose();
    } catch (err) {
      setError(err.message || "Failed to save hotel");
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormModal title={item ? "Edit Hotel" : "Add Hotel"} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input label="Hotel Name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
        <Input label="Location" value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} required />
        
        <div className="grid grid-cols-3 gap-4">
          <Input label="Price/Night (৳)" type="number" value={formData.pricePerNight} onChange={(e) => setFormData({...formData, pricePerNight: e.target.value})} required />
          <Input label="Rating (1-5)" type="number" min="1" max="5" step="0.1" value={formData.rating} onChange={(e) => setFormData({...formData, rating: e.target.value})} />
          <Input label="Available Rooms" type="number" value={formData.availableRooms} onChange={(e) => setFormData({...formData, availableRooms: e.target.value})} required />
        </div>

        <Input label="Amenities (comma-separated)" value={formData.amenities} onChange={(e) => setFormData({...formData, amenities: e.target.value})} placeholder="Free WiFi, Pool, Spa" />

        {error && <div className="text-red-400 text-sm">{error}</div>}
        
        <div className="flex gap-3 pt-4">
          <button type="submit" disabled={loading} className="flex-1 py-3 rounded-lg bg-sky text-midnight font-semibold hover:opacity-90 transition disabled:opacity-50">
            {loading ? "Saving..." : item ? "Update Hotel" : "Create Hotel"}
          </button>
          <button type="button" onClick={onClose} className="px-6 py-3 rounded-lg bg-white/5 text-sand hover:bg-white/10 transition">
            Cancel
          </button>
        </div>
      </form>
    </FormModal>
  );
}

function CarForm({ item, onClose }) {
  const [formData, setFormData] = useState(item || {
    make: "",
    model: "",
    year: "",
    pricePerDay: "",
    location: "",
    isAvailable: true
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const payload = {
        ...formData,
        year: Number(formData.year),
        pricePerDay: Number(formData.pricePerDay)
      };

      if (item?._id) {
        await api.updateCar(item._id, payload);
      } else {
        await api.createCar(payload);
      }
      onClose();
    } catch (err) {
      setError(err.message || "Failed to save car");
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormModal title={item ? "Edit Car" : "Add Car"} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Input label="Make" value={formData.make} onChange={(e) => setFormData({...formData, make: e.target.value})} required placeholder="Toyota" />
          <Input label="Model" value={formData.model} onChange={(e) => setFormData({...formData, model: e.target.value})} required placeholder="Allion" />
        </div>
        
        <div className="grid grid-cols-3 gap-4">
          <Input label="Year" type="number" value={formData.year} onChange={(e) => setFormData({...formData, year: e.target.value})} required />
          <Input label="Price/Day (৳)" type="number" value={formData.pricePerDay} onChange={(e) => setFormData({...formData, pricePerDay: e.target.value})} required />
          <Input label="Location" value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} required />
        </div>

        <label className="flex items-center gap-2 text-sand/80">
          <input type="checkbox" checked={formData.isAvailable} onChange={(e) => setFormData({...formData, isAvailable: e.target.checked})} className="rounded" />
          <span>Available for Rent</span>
        </label>

        {error && <div className="text-red-400 text-sm">{error}</div>}
        
        <div className="flex gap-3 pt-4">
          <button type="submit" disabled={loading} className="flex-1 py-3 rounded-lg bg-sky text-midnight font-semibold hover:opacity-90 transition disabled:opacity-50">
            {loading ? "Saving..." : item ? "Update Car" : "Create Car"}
          </button>
          <button type="button" onClick={onClose} className="px-6 py-3 rounded-lg bg-white/5 text-sand hover:bg-white/10 transition">
            Cancel
          </button>
        </div>
      </form>
    </FormModal>
  );
}

function FormModal({ title, children, onClose }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        className="glass rounded-2xl border border-white/20 p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-semibold text-white">{title}</h3>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-white/5 transition">
            <XMarkIcon className="h-6 w-6 text-sand/70" />
          </button>
        </div>
        {children}
      </motion.div>
    </motion.div>
  );
}

function Input({ label, ...props }) {
  return (
    <label className="flex flex-col gap-1 text-sm text-sand/70">
      <span>{label}</span>
      <input {...props} className="bg-midnight border border-white/20 rounded-lg px-4 py-2 text-sand focus:outline-none focus:ring-2 focus:ring-sky/50" />
    </label>
  );
}

function Textarea({ label, ...props }) {
  return (
    <label className="flex flex-col gap-1 text-sm text-sand/70">
      <span>{label}</span>
      <textarea {...props} rows={3} className="bg-midnight border border-white/20 rounded-lg px-4 py-2 text-sand focus:outline-none focus:ring-2 focus:ring-sky/50" />
    </label>
  );
}

function SelectInput({ label, options, ...props }) {
  return (
    <label className="flex flex-col gap-1 text-sm text-sand/70">
      <span>{label}</span>
      <select {...props} className="bg-midnight border border-white/20 rounded-lg px-4 py-2 text-sand focus:outline-none focus:ring-2 focus:ring-sky/50">
        {options.map((opt) => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
    </label>
  );
}

function ConfirmDialog({ message, onConfirm, onCancel }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onCancel}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        className="glass rounded-2xl border border-red-500/30 p-6 w-full max-w-md"
      >
        <div className="flex items-start gap-4 mb-6">
          <div className="p-3 rounded-full bg-red-500/20">
            <ExclamationTriangleIcon className="h-6 w-6 text-red-400" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-white mb-2">Confirm Deletion</h3>
            <p className="text-sand/80">{message}</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button
            onClick={onConfirm}
            className="flex-1 py-3 rounded-lg bg-red-500 text-white font-semibold hover:bg-red-600 transition"
          >
            Delete
          </button>
          <button
            onClick={onCancel}
            className="flex-1 py-3 rounded-lg bg-white/10 text-sand hover:bg-white/20 transition"
          >
            Cancel
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

function Notification({ message, type }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -50, x: "-50%" }}
      animate={{ opacity: 1, y: 0, x: "-50%" }}
      exit={{ opacity: 0, y: -50, x: "-50%" }}
      className="fixed top-6 left-1/2 z-50 glass rounded-xl border border-white/20 px-6 py-4 shadow-2xl max-w-md"
    >
      <div className="flex items-center gap-3">
        {type === "success" ? (
          <CheckCircleIcon className="h-6 w-6 text-green-400 flex-shrink-0" />
        ) : (
          <ExclamationTriangleIcon className="h-6 w-6 text-red-400 flex-shrink-0" />
        )}
        <p className={`font-medium ${type === "success" ? "text-green-300" : "text-red-300"}`}>
          {message}
        </p>
      </div>
    </motion.div>
  );
}
