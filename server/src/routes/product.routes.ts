import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import { requireAdmin } from "../middleware/requireAdmin";

import {
  createProduct,
  deleteProduct,
  getProduct,
  getProducts,
  getProductsByCategory,
  searchProducts,
  updateProduct,
} from "../controllers/product.controller";

const router = Router();

router.get("/", getProducts);

router.get("/search", searchProducts);

router.get("/category/:category", getProductsByCategory);

router.get("/:id", getProduct);

router.post("/", authenticate, requireAdmin, createProduct);

router.put("/:id", authenticate, requireAdmin, updateProduct);

router.delete("/:id", authenticate, requireAdmin, deleteProduct);

export default router;