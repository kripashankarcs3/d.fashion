import { Request, Response } from "express";
import ProductService from "../services/product.service";
import { asyncHandler } from "../utils/asyncHandler";

export const getProducts = asyncHandler(async (req: Request, res: Response) => {
  const page = Math.max(1, parseInt(req.query.page as string) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string) || 20));
  const result = await ProductService.getAllProducts(page, limit);

  res.status(200).json({ success: true, ...result });
});

export const getProduct = asyncHandler(async (req: Request<{ id: string }>, res: Response) => {
  const product = await ProductService.getProductById(req.params.id);

  if (!product) {
    res.status(404).json({ success: false, message: "Product not found" });
    return;
  }

  res.status(200).json({ success: true, product });
});

export const createProduct = asyncHandler(async (req: Request, res: Response) => {
  const product = await ProductService.createProduct(req.body);

  res.status(201).json({ success: true, message: "Product created successfully", product });
});

export const updateProduct = asyncHandler(async (req: Request<{ id: string }>, res: Response) => {
  const product = await ProductService.updateProduct(req.params.id, req.body);

  if (!product) {
    res.status(404).json({ success: false, message: "Product not found" });
    return;
  }

  res.status(200).json({ success: true, message: "Product updated successfully", product });
});

export const deleteProduct = asyncHandler(async (req: Request<{ id: string }>, res: Response) => {
  const product = await ProductService.deleteProduct(req.params.id);

  if (!product) {
    res.status(404).json({ success: false, message: "Product not found" });
    return;
  }

  res.status(200).json({ success: true, message: "Product deleted successfully" });
});

export const getProductsByCategory = asyncHandler(async (req: Request<{ category: string }>, res: Response) => {
  const page = Math.max(1, parseInt(req.query.page as string) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string) || 20));
  const result = await ProductService.getByCategory(req.params.category, page, limit);

  res.status(200).json({ success: true, ...result });
});

export const searchProducts = asyncHandler(async (req: Request, res: Response) => {
  const query = typeof req.query.q === "string" ? req.query.q : "";
  const page = Math.max(1, parseInt(req.query.page as string) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string) || 20));
  const result = await ProductService.searchProducts(query, page, limit);

  res.status(200).json({ success: true, ...result });
});
