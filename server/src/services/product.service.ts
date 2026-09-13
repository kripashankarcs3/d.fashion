import Product from "../models/product.model";
import type { CreateProductDto, UpdateProductDto } from "../types/dto";

/**
 * Neutralises regex metacharacters in a user-supplied term, and caps its
 * length to the longest value the schema stores. Both matter: an unescaped
 * term is a catastrophic-backtracking (ReDoS) vector on a public route.
 */
const escapeRegex = (value: string): string =>
  value.slice(0, 60).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

class ProductService {
  async getAllProducts(page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [products, total] = await Promise.all([
      Product.find().skip(skip).limit(limit).sort({ createdAt: -1 }),
      Product.countDocuments(),
    ]);
    return { products, total, page, totalPages: Math.ceil(total / limit) };
  }

  async getProductById(id: string) {
    return Product.findById(id);
  }

  async createProduct(data: CreateProductDto) {
    return Product.create(data);
  }

  async updateProduct(id: string, data: UpdateProductDto) {
    return Product.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
  }

  async deleteProduct(id: string) {
    return Product.findByIdAndDelete(id);
  }

  async getByCategory(category: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const filter = { category: new RegExp(`^${escapeRegex(category)}$`, "i") };
    const [products, total] = await Promise.all([
      Product.find(filter).skip(skip).limit(limit).sort({ createdAt: -1 }),
      Product.countDocuments(filter),
    ]);
    return { products, total, page, totalPages: Math.ceil(total / limit) };
  }

  async searchProducts(query: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const term = escapeRegex(query);
    const filter = {
      $or: [
        { name: { $regex: term, $options: "i" } },
        { brand: { $regex: term, $options: "i" } },
        { category: { $regex: term, $options: "i" } },
      ],
    };
    const [products, total] = await Promise.all([
      Product.find(filter).skip(skip).limit(limit).sort({ createdAt: -1 }),
      Product.countDocuments(filter),
    ]);
    return { products, total, page, totalPages: Math.ceil(total / limit) };
  }
}

export default new ProductService();
