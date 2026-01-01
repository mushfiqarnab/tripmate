import express from "express";
import {
  createBooking,
  getAllBookings,
  getUserBookings,
  cancelBooking,
} from "../controller/booking.controller.js";
import { authenticateToken, authorizeRoles } from "../midleware/auth.middleware.js";

const router = express.Router();

router.post("/", authenticateToken, createBooking);
router.get("/", authenticateToken, authorizeRoles("admin"), getAllBookings);
router.get("/user/:userId", authenticateToken, getUserBookings);
router.put("/:id/cancel", authenticateToken, cancelBooking);

export default router;
