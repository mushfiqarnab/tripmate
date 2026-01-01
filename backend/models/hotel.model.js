import mongoose from "mongoose";

const hotelSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    pricePerNight: {
      type: Number,
      required: true,
      min: 0,
    },
    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
    },
    amenities: {
      type: [String],
    },
    image: {
      type: String,
    },
    availableRooms: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const Hotel = mongoose.model("Hotel", hotelSchema);

export default Hotel;
