import TravelPackage from "../models/travelPackage.model.js";

export const createTravelPackage = async (req, res) => {
  try {
    const { title, destination, price, duration, category } = req.body;
    if (!title || !destination || !price || !duration || !category) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const travelPackage = new TravelPackage(req.body);
    await travelPackage.save();
    res.status(201).json(travelPackage);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getAllTravelPackages = async (req, res) => {
  try {
    const travelPackages = await TravelPackage.find();
    res.status(200).json(travelPackages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getTravelPackageById = async (req, res) => {
  try {
    const travelPackage = await TravelPackage.findById(req.params.id);
    if (!travelPackage) {
      return res.status(404).json({ message: "Travel package not found" });
    }
    res.status(200).json(travelPackage);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateTravelPackage = async (req, res) => {
  try {
    const travelPackage = await TravelPackage.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!travelPackage) {
      return res.status(404).json({ message: "Travel package not found" });
    }
    res.status(200).json(travelPackage);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteTravelPackage = async (req, res) => {
  try {
    const travelPackage = await TravelPackage.findByIdAndDelete(req.params.id);
    if (!travelPackage) {
      return res.status(404).json({ message: "Travel package not found" });
    }
    res.status(200).json({ message: "Travel package deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
