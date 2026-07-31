import axios from "axios";
import fs from "fs";
import path from "path";
import { env } from "../config/env";

const YOUCAM_BASE = "https://yce-api-01.perfectcorp.com";

class YouCamService {
  private client;

  constructor() {
    this.client = axios.create({
      baseURL: YOUCAM_BASE,
      headers: {
        Authorization: `Bearer ${env.YOUCAM_API_KEY}`,
        "Content-Type": "application/json",
      },
      timeout: 120000,
    });
  }

  private isAvailable(): boolean {
    return !!env.YOUCAM_API_KEY;
  }

  // ── File Upload API (for local files) ──

  async getFileUploadUrl(feature: string, contentType: string, filePath: string) {
    const stats = fs.statSync(filePath);
    const fileName = path.basename(filePath);
    const { data } = await this.client.post(`/s2s/v2.0/file/${feature}`, {
      files: [{ content_type: contentType, file_name: fileName, file_size: stats.size }],
    });
    return data;
  }

  async uploadFileToUrl(uploadUrl: string, filePath: string, contentType: string) {
    const stats = fs.statSync(filePath);
    await axios.put(uploadUrl, fs.createReadStream(filePath), {
      headers: {
        "Content-Type": contentType,
        "Content-Length": String(stats.size),
      },
      timeout: 120000,
      maxContentLength: Infinity,
      maxBodyLength: Infinity,
    });
  }

  async uploadAndGetFileId(feature: string, filePath: string): Promise<string> {
    const ext = filePath.split(".").pop()?.toLowerCase();
    const contentType = ext === "png" ? "image/png" : ext === "heic" ? "image/heic" : "image/jpeg";

    const uploadRes = await this.getFileUploadUrl(feature, contentType, filePath);
    const uploadUrl = uploadRes?.data?.files?.[0]?.requests?.[0]?.url;
    const fileId = uploadRes?.data?.files?.[0]?.file_id;

    if (!uploadUrl || !fileId) {
      throw new Error("Failed to get upload URL from YouCam File API");
    }

    await this.uploadFileToUrl(uploadUrl, filePath, contentType);
    return fileId;
  }

  // ── Task API ──

  async startTask(feature: string, payload: Record<string, unknown>) {
    if (!this.isAvailable()) return null;

    const { data } = await this.client.post(`/s2s/v2.0/task/${feature}`, payload);
    return data;
  }

  async getTaskResult(feature: string, taskId: string) {
    if (!this.isAvailable()) return null;

    const { data } = await this.client.get(`/s2s/v2.0/task/${feature}/${taskId}`);
    return data;
  }

  async pollTaskResult(feature: string, taskId: string, maxRetries = 30, intervalMs = 2000) {
    if (!this.isAvailable()) return null;

    for (let i = 0; i < maxRetries; i++) {
      const result = await this.getTaskResult(feature, taskId);

      if (result?.data?.task_status === "success") {
        return result;
      }

      if (result?.data?.task_status === "error") {
        const msg = typeof result.data.error === "string" ? result.data.error : result.data.error_message || "YouCam task failed";
        throw new Error(msg);
      }

      await new Promise((r) => setTimeout(r, intervalMs));
    }

    throw new Error("YouCam task timed out");
  }

  // ── Template Listing (makeup looks, hairstyles) ──

  async listTemplates(feature: string) {
    if (!this.isAvailable()) return null;

    const { data } = await this.client.get(`/s2s/v2.0/task/template/${feature}`, {
      params: { page_size: 20 },
    });
    return data;
  }

  // ── Skin Analysis ──

  async analyzeSkin(filePath: string) {
    const fileId = await this.uploadAndGetFileId("skin-analysis", filePath);

    const task = await this.startTask("skin-analysis", {
      src_file_id: fileId,
      dst_actions: [
        "acne", "wrinkle", "pore",
        "redness", "eye_bag", "texture",
      ],
      format: "json",
    });

    const taskId = task?.data?.task_id;
    if (!taskId) throw new Error("Failed to start skin-analysis task");

    return this.pollTaskResult("skin-analysis", taskId, 60, 3000);
  }

  // ── Try-On methods (URL-based — works with public image URLs) ──

  async tryOnClothes(personImageUrl: string, garmentImageUrl: string) {
    const task = await this.startTask("cloth", {
      src_file_url: personImageUrl,
      ref_file_url: garmentImageUrl,
      garment_category: "full_body",
      change_shoes: false,
    });

    const taskId = task?.data?.task_id;
    if (!taskId) throw new Error("Failed to start clothes try-on task");

    return this.pollTaskResult("cloth", taskId);
  }

  async tryOnMakeup(personImageUrl: string, lookId?: string) {
    const payload: Record<string, unknown> = { src_file_url: personImageUrl };
    if (lookId) payload.template_id = lookId;

    const task = await this.startTask("look-vto", payload);
    const taskId = task?.data?.task_id;
    if (!taskId) throw new Error("Failed to start makeup try-on task");

    return this.pollTaskResult("look-vto", taskId);
  }

  async tryOnHair(personImageUrl: string, templateId: string) {
    const task = await this.startTask("hair-style", {
      src_file_url: personImageUrl,
      template_id: templateId,
    });

    const taskId = task?.data?.task_id;
    if (!taskId) throw new Error("Failed to start hair try-on task");

    return this.pollTaskResult("hair-style", taskId);
  }

  // ── Try-On methods (file-based — the selfie is uploaded to YouCam directly) ──

  async tryOnClothesWithFile(personImageFilePath: string, garmentImageUrl: string) {
    const fileId = await this.uploadAndGetFileId("cloth", personImageFilePath);

    const task = await this.startTask("cloth", {
      src_file_id: fileId,
      ref_file_url: garmentImageUrl,
      garment_category: "full_body",
      change_shoes: false,
    });

    const taskId = task?.data?.task_id;
    if (!taskId) throw new Error("Failed to start clothes try-on task");

    return this.pollTaskResult("cloth", taskId);
  }

  async tryOnMakeupWithFile(personImageFilePath: string, lookId?: string) {
    const fileId = await this.uploadAndGetFileId("look-vto", personImageFilePath);

    const payload: Record<string, unknown> = { src_file_id: fileId };
    if (lookId) payload.template_id = lookId;

    const task = await this.startTask("look-vto", payload);
    const taskId = task?.data?.task_id;
    if (!taskId) throw new Error("Failed to start makeup try-on task");

    return this.pollTaskResult("look-vto", taskId);
  }

  async tryOnHairWithFile(personImageFilePath: string, templateId: string) {
    const fileId = await this.uploadAndGetFileId("hair-style", personImageFilePath);

    const task = await this.startTask("hair-style", {
      src_file_id: fileId,
      template_id: templateId,
    });

    const taskId = task?.data?.task_id;
    if (!taskId) throw new Error("Failed to start hair try-on task");

    return this.pollTaskResult("hair-style", taskId);
  }
}

export default new YouCamService();
