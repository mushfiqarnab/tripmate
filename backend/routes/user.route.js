import { Router } from "express";
import {
  signup,
  login,
  logout,
  getUserProfile,
  updateUserProfile,
  deleteUserProfile,
  addToWishlist,
  removeFromWishlist,
  updateUserPreferences,
} from "../controller/user.controller.js";
import { authenticateToken } from "../midleware/auth.middleware.js";

const router = Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.get("/:id", authenticateToken, getUserProfile);
router.put("/:id", authenticateToken, updateUserProfile);
router.delete("/:id", authenticateToken, deleteUserProfile);
router.post("/:id/wishlist", authenticateToken, addToWishlist);
router.delete("/:id/wishlist", authenticateToken, removeFromWishlist);
router.put("/:id/preferences", authenticateToken, updateUserPreferences);

export default router;