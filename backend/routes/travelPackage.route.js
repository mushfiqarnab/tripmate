import express from "express";
import {
  getTravelPackageById,
  createTravelPackage,
  updateTravelPackage,
  deleteTravelPackage,
  getAllTravelPackages,
} from "../controller/travelPackage.controller.js";
import { authenticateToken, authorizeRoles } from "../midleware/auth.middleware.js";

const router = express.Router();

router.get("/", getAllTravelPackages);
router.get("/:id", getTravelPackageById);
router.post("/", authenticateToken, authorizeRoles("admin"), createTravelPackage);
router.put("/:id", authenticateToken, authorizeRoles("admin"), updateTravelPackage);
router.delete("/:id", authenticateToken, authorizeRoles("admin"), deleteTravelPackage);

export default router;

