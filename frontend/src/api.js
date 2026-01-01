const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

function getToken() {
  return localStorage.getItem("token");
}

function getUserId() {
  return localStorage.getItem("userId");
}

async function request(path, options = {}) {
  const token = getToken();
  const res = await fetch(`${API_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || res.statusText);
  }
  return res.json();
}

export const api = {
  signup: (payload) => request(`/users/signup`, { method: "POST", body: JSON.stringify(payload) }),
  login: (payload) => request(`/users/login`, { method: "POST", body: JSON.stringify(payload) }),
  
  getPackages: (params = "") => request(`/travelpackages${params}`),
  getPackage: (id) => request(`/travelpackages/${id}`),
  createPackage: (payload) => request(`/travelpackages`, { method: "POST", body: JSON.stringify(payload) }),
  updatePackage: (id, payload) => request(`/travelpackages/${id}`, { method: "PUT", body: JSON.stringify(payload) }),
  deletePackage: (id) => request(`/travelpackages/${id}`, { method: "DELETE" }),
  
  getFlights: () => request(`/flights`),
  getFlight: (id) => request(`/flights/${id}`),
  createFlight: (payload) => request(`/flights`, { method: "POST", body: JSON.stringify(payload) }),
  updateFlight: (id, payload) => request(`/flights/${id}`, { method: "PUT", body: JSON.stringify(payload) }),
  deleteFlight: (id) => request(`/flights/${id}`, { method: "DELETE" }),
  
  getHotels: () => request(`/hotels`),
  getHotel: (id) => request(`/hotels/${id}`),
  createHotel: (payload) => request(`/hotels`, { method: "POST", body: JSON.stringify(payload) }),
  updateHotel: (id, payload) => request(`/hotels/${id}`, { method: "PUT", body: JSON.stringify(payload) }),
  deleteHotel: (id) => request(`/hotels/${id}`, { method: "DELETE" }),
  
  getCars: () => request(`/cars`),
  getCar: (id) => request(`/cars/${id}`),
  createCar: (payload) => request(`/cars`, { method: "POST", body: JSON.stringify(payload) }),
  updateCar: (id, payload) => request(`/cars/${id}`, { method: "PUT", body: JSON.stringify(payload) }),
  deleteCar: (id) => request(`/cars/${id}`, { method: "DELETE" }),
  
  createBooking: (payload) => request(`/bookings`, { method: "POST", body: JSON.stringify(payload) }),
  getUserBookings: (userId) => request(`/bookings/user/${userId}`),
  getAllBookings: () => request(`/bookings`),
  cancelBooking: (id) => request(`/bookings/${id}/cancel`, { method: "PUT" }),
};

export { getToken, getUserId };
