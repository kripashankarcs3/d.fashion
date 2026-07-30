import { Router } from "express";

import {
  addFavorite,
  getFavorites,
  deleteFavorite,
} from "../controllers/favorite.controller";

import { authenticate } from "../middleware/auth.middleware";

const router = Router();

// Add Favorite
router.post("/", authenticate, addFavorite);

// Get Logged-in User Favorites
router.get("/", authenticate, getFavorites);

// Delete Favorite
router.delete("/:id", authenticate, deleteFavorite);

export default router;