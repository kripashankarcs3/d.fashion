import axios from 'axios';
import type { AnalysisResult, WardrobeItem } from '@/store/useStyleStore';

const BASE = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3001/api';

export const api = axios.create({ baseURL: BASE, timeout: 30000 });

api.interceptors.request.use((config) => {
  const raw = localStorage.getItem('dfashion_auth');
  if (raw) {
    try {
      const token = JSON.parse(raw)?.state?.token as string | undefined;
      if (token) config.headers.Authorization = `Bearer ${token}`;
    } catch {
      // Corrupt persisted session — proceed without a token.
    }
  }
  return config;
});

export const analyzeImage = (
  file: File,
  onUploadProgress?: (percent: number) => void,
) => {
  const form = new FormData();
  form.append('image', file);
  return api.post<{ data: AnalysisResult }>('/analyze/upload', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress: (event) => {
      if (onUploadProgress && event.total) {
        onUploadProgress(Math.round((event.loaded / event.total) * 100));
      }
    },
  });
};

export const tryOnClothes = (personImageUrl: string, garmentImageUrl: string) =>
  api.post<{ resultUrl: string }>('/tryon/clothes', { personImageUrl, garmentImageUrl });

export const tryOnMakeup = (personImageUrl: string, productId: string) =>
  api.post<{ resultUrl: string }>('/tryon/makeup', { personImageUrl, productId });

export const tryOnHair = (personImageUrl: string, styleId: string) =>
  api.post<{ resultUrl: string }>('/tryon/hair', { personImageUrl, styleId });

export const listTryOnTemplates = (feature: 'look-vto' | 'hair-style') =>
  api.get<{ items: { id: string; title: string; thumb: string }[] }>(
    `/tryon/templates/${feature}`,
  );

export const sendChatMessage = (
  message: string,
  context: { analysisResult: AnalysisResult | null; wardrobeItems: WardrobeItem[] }
) => api.post<{ reply: string }>('/chat', { message, context });

export const fetchReports = () =>
  api.get<{
    history: { _id: string; report: AnalysisResult | null; season?: string; createdAt: string }[];
  }>('/history');

export const saveReportToCloud = (report: AnalysisResult) =>
  api.post('/history', { report });