import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";

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

router.post("/", authenticate, createProduct);

router.put("/:id", authenticate, updateProduct);

router.delete("/:id", authenticate, deleteProduct);

export default router;