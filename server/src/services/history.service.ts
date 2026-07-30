import History from "../models/history.model";

class HistoryService {
  async saveHistory(data: any) {
    return History.create(data);
  }

  async getUserHistory(userId: string) {
    return History.find({ userId })
      .populate("recommendedProducts")
      .sort({ createdAt: -1 });
  }

  async deleteHistory(id: string) {
    return History.findByIdAndDelete(id);
  }
}

export default new HistoryService();