import axios from "axios";
import env from "../config/env";

class YouCamService {
  private apiKey = env.YOUCAM_API_KEY;
  private apiSecret = env.YOUCAM_API_SECRET;

  constructor() {
    if (!this.apiKey || !this.apiSecret) {
      throw new Error("YouCam API credentials are missing.");
    }
  }
}

export default new YouCamService();