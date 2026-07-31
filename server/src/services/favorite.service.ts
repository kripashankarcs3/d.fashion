import Favorite from "../models/favorite.model";
import type { AddFavoriteDto } from "../types/dto";

class FavoriteService {
  async addFavorite(data: AddFavoriteDto) {
    return Favorite.create(data);
  }

  async getFavorites(userId: string) {
    return Favorite.find({ userId })
      .populate("productId");
  }

  async deleteFavorite(id: string) {
    return Favorite.findByIdAndDelete(id);
  }
}

export default new FavoriteService();