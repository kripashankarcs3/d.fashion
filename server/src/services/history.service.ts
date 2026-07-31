import History from "../models/history.model";
import type { SaveHistoryDto } from "../types/dto";

class HistoryService {
  async saveHistory(data: SaveHistoryDto) {
    return History.create(data);
  }

  async getUserHistory(userId: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const filter = { userId };
    const [history, total] = await Promise.all([
      History.find(filter).populate("recommendedProducts").skip(skip).limit(limit).sort({ createdAt: -1 }),
      History.countDocuments(filter),
    ]);
    return { history, total, page, totalPages: Math.ceil(total / limit) };
  }

  async deleteHistory(id: string) {
    return History.findByIdAndDelete(id);
  }
}

export default new HistoryService();
