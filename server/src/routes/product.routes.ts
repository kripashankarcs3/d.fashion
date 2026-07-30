import { Router } from "express";

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

router.post("/", createProduct);

router.put("/:id", updateProduct);

router.delete("/:id", deleteProduct);

export default router;