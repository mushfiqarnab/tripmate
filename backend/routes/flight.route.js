import express from "express";
import {
  createFlight,
  getFlights,
  getFlight,
  updateFlight,
  deleteFlight,
} from "../controller/flight.controller.js";
import { authenticateToken, authorizeRoles } from "../midleware/auth.middleware.js";

const router = express.Router();

router.post("/", authenticateToken, authorizeRoles("admin"), createFlight);
router.get("/", getFlights);
router.get("/:id", getFlight);
router.put("/:id", authenticateToken, authorizeRoles("admin"), updateFlight);
router.delete("/:id", authenticateToken, authorizeRoles("admin"), deleteFlight);

export default router;
