import { Request, Response } from "express";
import ProductService from "../services/product.service";

// ================= GET ALL PRODUCTS =================

export const getProducts = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const products = await ProductService.getAllProducts();

    res.status(200).json({
      success: true,
      products,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch products",
    });
  }
};

// ================= GET PRODUCT BY ID =================

export const getProduct = async (
  req: Request<{ id: string }>,
  res: Response
): Promise<void> => {
  try {
    const product = await ProductService.getProductById(req.params.id);

    if (!product) {
      res.status(404).json({
        success: false,
        message: "Product not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch product",
    });
  }
};

// ================= CREATE PRODUCT =================

export const createProduct = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const product = await ProductService.createProduct(req.body);

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to create product",
    });
  }
};

// ================= UPDATE PRODUCT =================

export const updateProduct = async (
  req: Request<{ id: string }>,
  res: Response
): Promise<void> => {
  try {
    const product = await ProductService.updateProduct(
      req.params.id,
      req.body
    );

    if (!product) {
      res.status(404).json({
        success: false,
        message: "Product not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to update product",
    });
  }
};

// ================= DELETE PRODUCT =================

export const deleteProduct = async (
  req: Request<{ id: string }>,
  res: Response
): Promise<void> => {
  try {
    const product = await ProductService.deleteProduct(req.params.id);

    if (!product) {
      res.status(404).json({
        success: false,
        message: "Product not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to delete product",
    });
  }
};

// ================= GET PRODUCTS BY CATEGORY =================

export const getProductsByCategory = async (
  req: Request<{ category: string }>,
  res: Response
): Promise<void> => {
  try {
    const products = await ProductService.getByCategory(
      req.params.category
    );

    res.status(200).json({
      success: true,
      products,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch category products",
    });
  }
};

// ================= SEARCH PRODUCTS =================

export const searchProducts = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const query =
      typeof req.query.q === "string" ? req.query.q : "";

    const products = await ProductService.searchProducts(query);

    res.status(200).json({
      success: true,
      products,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to search products",
    });
  }
};