import Product from "../models/product.model";

class ProductService {
  async getAllProducts() {
    return Product.find();
  }

  async getProductById(id: string) {
    return Product.findById(id);
  }

  async createProduct(data: any) {
    return Product.create(data);
  }

  async updateProduct(id: string, data: any) {
    return Product.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
  }

  async deleteProduct(id: string) {
    return Product.findByIdAndDelete(id);
  }

  async getByCategory(category: string) {
    return Product.find({
      category: new RegExp(`^${category}$`, "i"),
    });
  }

  async searchProducts(query: string) {
    return Product.find({
      $or: [
        { name: { $regex: query, $options: "i" } },
        { brand: { $regex: query, $options: "i" } },
        { category: { $regex: query, $options: "i" } },
      ],
    });
  }
}

export default new ProductService();