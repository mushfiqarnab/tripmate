import express from "express";
import {
  createHotel,
  getHotels,
  getHotel,
  updateHotel,
  deleteHotel,
} from "../controller/hotel.controller.js";
import { authenticateToken, authorizeRoles } from "../midleware/auth.middleware.js";

const router = express.Router();

router.post("/", authenticateToken, authorizeRoles("admin"), createHotel);
router.get("/", getHotels);
router.get("/:id", getHotel);
router.put("/:id", authenticateToken, authorizeRoles("admin"), updateHotel);
router.delete("/:id", authenticateToken, authorizeRoles("admin"), deleteHotel);

export default router;
