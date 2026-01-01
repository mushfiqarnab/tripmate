import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import connectDB from "./db/connectDb.js";
import userRoutes from "./routes/user.route.js";
import travelPackageRoutes from "./routes/travelPackage.route.js";
import flightRoutes from "./routes/flight.route.js";
import carRoutes from "./routes/car.route.js";
import hotelRoutes from "./routes/hotel.route.js";
import bookingRoutes from "./routes/booking.route.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, ".env") });
connectDB();

const app = express();


app.use(cors());
app.use(express.json());

app.use("/api/users", userRoutes);
app.use("/api/travelpackages", travelPackageRoutes);
app.use("/api/flights", flightRoutes);
app.use("/api/cars", carRoutes);
app.use("/api/hotels", hotelRoutes);
app.use("/api/bookings", bookingRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
