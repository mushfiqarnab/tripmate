import mongoose from "mongoose";

const flightSchema = new mongoose.Schema(
  {
    flightNumber: {
      type: String,
      required: true,
      trim: true,
    },
    airline: {
      type: String,
      required: true,
      trim: true,
    },
    origin: {
      type: String,
      required: true,
      trim: true,
    },
    destination: {
      type: String,
      required: true,
      trim: true,
    },
    departureTime: {
      type: Date,
      required: true,
    },
    arrivalTime: {
      type: Date,
      required: true,
    },

    duration: {
      type: String,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    image: {
      type: String,
    },
    seatsAvailable: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const Flight = mongoose.model("Flight", flightSchema);

export default Flight;
