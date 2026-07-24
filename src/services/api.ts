import axios from 'axios';
import type { AnalysisResult, WardrobeItem } from '@/store/useStyleStore';

const BASE = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3001/api';

export const api = axios.create({ baseURL: BASE });

export const analyzeImage = (file: File) => {
  const form = new FormData();
  form.append('image', file);
  return api.post<AnalysisResult>('/analyze/upload', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

export const tryOnClothes = (personImageUrl: string, garmentImageUrl: string) =>
  api.post<{ resultUrl: string }>('/tryon/clothes', { personImageUrl, garmentImageUrl });

export const tryOnMakeup = (personImageUrl: string, productId: string) =>
  api.post<{ resultUrl: string }>('/tryon/makeup', { personImageUrl, productId });

export const tryOnHair = (personImageUrl: string, colorHex: string) =>
  api.post<{ resultUrl: string }>('/tryon/hair', { personImageUrl, colorHex });

export const sendChatMessage = (
  message: string,
  context: { analysisResult: AnalysisResult | null; wardrobeItems: WardrobeItem[] }
) => api.post<{ reply: string }>('/chat', { message, context });