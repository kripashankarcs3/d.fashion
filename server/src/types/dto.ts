import { IProduct } from "../models/product.model";

export interface CreateProductDto {
  name: string;
  category: string;
  brand: string;
  price: number;
  image?: string;
  description?: string;
  skinType?: string[];
  skinTone?: string[];
}

export interface UpdateProductDto extends Partial<CreateProductDto> {}

export interface AddFavoriteDto {
  userId: string;
  productId: string;
}

export interface SaveHistoryDto {
  userId: string;
  image?: string;
  skinType?: string;
  skinTone?: string;
  concerns?: string[];
  recommendedProducts?: string[];
  report?: unknown;
  season?: string;
}

export interface RegisterDto {
  name: string;
  email: string;
  password: string;
}

export interface LoginDto {
  email: string;
  password: string;
}
