import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: ["flight", "hotel", "car", "package", "custom"],
      required: true,
    },
    flight: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Flight",
    },
    hotel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hotel",
    },
    car: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Car",
    },
    travelPackage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TravelPackage",
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
    },
    totalPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled"],
      default: "confirmed",
    },
  },
  { timestamps: true }
);

const Booking = mongoose.model("Booking", bookingSchema);

export default Booking;
