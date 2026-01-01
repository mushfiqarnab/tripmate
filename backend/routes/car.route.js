import express from "express";
import {
  createCar,
  getCars,
  getCar,
  updateCar,
  deleteCar,
} from "../controller/car.controller.js";
import { authenticateToken, authorizeRoles } from "../midleware/auth.middleware.js";

const router = express.Router();

router.post("/", authenticateToken, authorizeRoles("admin"), createCar);
router.get("/", getCars);
router.get("/:id", getCar);
router.put("/:id", authenticateToken, authorizeRoles("admin"), updateCar);
router.delete("/:id", authenticateToken, authorizeRoles("admin"), deleteCar);

export default router;
