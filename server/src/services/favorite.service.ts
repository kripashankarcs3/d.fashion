
import Favorite from "../models/favorite.model";

class FavoriteService {
  async addFavorite(data: any) {
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