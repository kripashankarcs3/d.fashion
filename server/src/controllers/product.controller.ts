import { Request, Response } from "express";
import { z } from "zod";
import ProductService from "../services/product.service";
import { asyncHandler } from "../utils/asyncHandler";

const productSchema = z.object({
  name: z.string().trim().min(1).max(200),
  category: z.string().trim().min(1).max(60),
  brand: z.string().trim().min(1).max(120),
  price: z.coerce.number().positive().max(10_000_000),
  image: z.string().trim().max(2000).optional().default(""),
  description: z.string().trim().max(5000).optional().default(""),
  skinType: z.array(z.string().trim().max(40)).max(20).optional().default([]),
  skinTone: z.array(z.string().trim().max(40)).max(20).optional().default([]),
});

const productUpdateSchema = productSchema.partial();

const parseProductBody = <T>(body: unknown, schema: z.ZodSchema<T>) => {
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    const message = parsed.error.issues[0]?.message ?? "Invalid product data";
    return { error: message };
  }
  return { data: parsed.data };
};

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
  const { error, data } = parseProductBody(req.body, productSchema);
  if (error) {
    res.status(400).json({ success: false, message: error });
    return;
  }

  const product = await ProductService.createProduct(data as Parameters<typeof ProductService.createProduct>[0]);

  res.status(201).json({ success: true, message: "Product created successfully", product });
});

export const updateProduct = asyncHandler(async (req: Request<{ id: string }>, res: Response) => {
  const { error, data } = parseProductBody(req.body, productUpdateSchema);
  if (error) {
    res.status(400).json({ success: false, message: error });
    return;
  }

  const product = await ProductService.updateProduct(req.params.id, data as Parameters<typeof ProductService.updateProduct>[1]);

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
