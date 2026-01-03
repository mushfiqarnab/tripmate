import Booking from "../models/booking.model.js";

export const createBooking = async (req, res) => {
  try {
    const {
      type,
      flight,
      hotel,
      car,
      travelPackage,
      startDate,
      endDate,
      totalPrice,
      user,
    } = req.body;

    
    if (type === "flight" && !flight) {
      return res
        .status(400)
        .json({ message: "Flight ID is required for flight booking" });
    }
    if (type === "hotel" && !hotel) {
      return res
        .status(400)
        .json({ message: "Hotel ID is required for hotel booking" });
    }
    if (type === "car" && !car) {
      return res
        .status(400)
        .json({ message: "Car ID is required for car booking" });
    }
    if (type === "package" && !travelPackage) {
      return res
        .status(400)
        .json({ message: "Travel Package ID is required for package booking" });
    }
    if (type === "custom") {
      if (!flight && !car) {
        return res.status(400).json({
          message: "For custom bookings, you must choose at least one transportation method (Flight or Car)",
        });
      }
    }

    const booking = new Booking({
      user, 
      type,
      flight,
      hotel,
      car,
      travelPackage,
      startDate,
      endDate,
      totalPrice,
    });

    await booking.save();
    res.status(201).json(booking);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("user", "name email")
      .populate("flight")
      .populate("hotel")
      .populate("car")
      .populate("travelPackage");
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.params.userId })
      .populate("flight")
      .populate("hotel")
      .populate("car")
      .populate("travelPackage");
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status: "cancelled" },
      { new: true }
    );
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    res.status(200).json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
