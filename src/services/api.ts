import axios from 'axios';
import type { AnalysisResult, WardrobeItem } from '@/store/useStyleStore';
import { useAuthStore } from '@/store/useAuthStore';
import { firebaseAuth } from '@/lib/firebase';

/** Resolved API root. Defaults to the same-origin `/api` (the dev server proxies
 *  it to the backend), and can be overridden per environment with VITE_API_BASE_URL. */
const BASE = import.meta.env.VITE_API_BASE_URL ?? '/api';

/** Turns a server-relative /uploads path into a browser-loadable URL. */
export const assetUrl = (p?: string | null): string =>
  !p ? '' : /^https?:\/\//.test(p) ? p : new URL(p, BASE.replace(/\/api\/?$/, '/')).toString();

export const api = axios.create({ baseURL: BASE, timeout: 30000 });

api.interceptors.request.use(async (config) => {
  // Ask Firebase for the token rather than trusting the in-memory copy:
  // getIdToken() hands back the cached value and silently refreshes it when it
  // is close to its one-hour expiry, so the header is never a stale token.
  // The store is the fallback (Firebase unconfigured, or a local JWT session).
  let token = useAuthStore.getState().token;
  if (firebaseAuth?.currentUser) {
    try {
      token = await firebaseAuth.currentUser.getIdToken();
    } catch {
      // Offline or refresh failed — send the cached token and let the
      // server decide, rather than dropping the header entirely.
    }
  }
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const analyzeImage = (
  file: File,
  onUploadProgress?: (percent: number) => void,
) => {
  const form = new FormData();
  form.append('image', file);
  return api.post<{ data: AnalysisResult }>('/analyze/upload', form, {
    timeout: 300_000,          // the pipeline is a multi-minute AI job
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress: (event) => {
      if (onUploadProgress && event.total) {
        onUploadProgress(Math.round((event.loaded / event.total) * 100));
      }
    },
  });
};

export const tryOnClothes = (personImageUrl: string, garmentImageUrl: string, colourHex?: string) =>
  api.post<{ resultUrl: string; source: 'youcam' | 'fallback'; colourHex?: string }>(
    '/tryon/clothes',
    { personImageUrl, garmentImageUrl, colourHex },
    { timeout: 180_000 },
  );

export const tryOnMakeup = (personImageUrl: string, productId: string) =>
  api.post<{ resultUrl: string; source: 'youcam' | 'fallback' }>('/tryon/makeup', { personImageUrl, productId }, { timeout: 180_000 });

export const tryOnHair = (
  personImageUrl: string,
  styleId: string,
  options: { engine?: 'style' | 'transfer'; keepUsersColour?: boolean } = {},
) =>
  api.post<{ resultUrl: string; source: 'youcam' | 'fallback' }>(
    '/tryon/hair',
    { personImageUrl, styleId, ...options },
    { timeout: 180_000 },
  );

export const listTryOnTemplates = (feature: 'look-vto' | 'hair-style') =>
  api.get<{ items: { id: string; title: string; thumb: string }[] }>(
    `/tryon/templates/${feature}`,
  );

/** Lifetime AI try-on usage for the signed-in account: `used` of `limit`.
 *  `limit` is `null` on an unlimited (Atelier) account. */
export const getTryOnUsage = async () =>
  (
    await api.get<{ success: boolean; used: number; limit: number | null; plan: string; unlimited: boolean }>(
      '/tryon/usage',
    )
  ).data;

/** One prior turn replayed to the stylist so follow-up questions keep context. */
export interface ChatTurn {
  role: 'user' | 'assistant';
  content: string;
}

export const sendChatMessage = (
  message: string,
  context: { analysisResult: AnalysisResult | null; wardrobeItems: WardrobeItem[] },
  history: ChatTurn[] = [],
) =>
  api.post<{ reply: string; source: 'opencode' | 'rules' }>(
    '/chat',
    { message, context, history },
    // The server gives the model up to 25s before falling back to its rules
    // engine, so the client must wait longer than that.
    { timeout: 45_000 },
  );

/** One saved entry in a member's account history — an analysis or a try-on. */
export interface HistoryEntry {
  _id: string;
  type?: 'analysis' | 'tryon';
  /** Durable `/gallery/...` path of the picture to show. */
  resultImage?: string;
  image?: string;
  label?: string;
  tryonKind?: 'clothes' | 'makeup' | 'hair';
  colourHex?: string;
  source?: string;
  report: AnalysisResult | null;
  season?: string;
  createdAt: string;
}

export const fetchReports = () =>
  api.get<{ history: HistoryEntry[] }>('/history');

/** Every saved entry for the signed-in member, newest first. */
export const fetchHistory = (type?: 'analysis' | 'tryon', limit = 60) =>
  api.get<{ history: HistoryEntry[]; total: number }>('/history', {
    params: { limit, ...(type ? { type } : {}) },
  });

export const deleteHistoryEntry = (id: string) => api.delete(`/history/${id}`);

export const saveReportToCloud = (report: AnalysisResult, image?: string) =>
  api.post('/history', { type: 'analysis', report, resultImage: image, image });

export const saveTryOnToCloud = (entry: {
  resultImage: string;
  label: string;
  tryonKind: 'clothes' | 'makeup' | 'hair';
  colourHex?: string;
  source?: string;
}) => api.post<{ history: HistoryEntry }>('/history', { type: 'tryon', ...entry });

export const subscribeNewsletter = (email: string, source = 'footer') =>
  api.post('/newsletter', { email, source }, { timeout: 15000 });

/* ------------------------------------------------------------ garments */

export interface Garment {
  id: number;
  name: string;
  category: string;
  gender: 'Women' | 'Men';
  img: string;
  colourHex: string;
  colourName: string;
  buyUrl?: string;
}

/** Colour-matched garment recommendation (server computes OKLab distance
 *  against the user's season palette). */
export interface GarmentMatch extends Garment {
  externalId: string;
  matchScore: number;
}

/** The server wraps every payload as `{ success, message, data }`. */
interface ApiEnvelope<T> {
  success: boolean;
  message: string;
  data: T;
}

export const getGarments = async (params?: { gender?: string; category?: string }) =>
  (
    await api.get<ApiEnvelope<{ count: number; garments: Garment[] }>>('/garments', { params })
  ).data.data;

export const getGarmentRecommendations = async (params: {
  season: string;
  undertone: string;
  gender?: string;
  category?: string;
  limit?: number;
}) =>
  (
    await api.get<ApiEnvelope<{ count: number; garments: GarmentMatch[] }>>(
      '/garments/recommend',
      { params },
    )
  ).data.data;

/* ------------------------------------------------------------- payments */

export type PaymentKind = 'plan' | 'topup';
export type PaymentStatus = 'pending' | 'verified' | 'rejected';

export interface PaymentRecord {
  id: string;
  email: string;
  kind: PaymentKind;
  planId?: 'essentials' | 'atelier';
  topupQty?: number;
  amount: number;
  utr: string;
  status: PaymentStatus;
  rejectionReason?: string;
  verifiedBy?: string;
  verifiedAt?: string;
  createdAt: string;
}

export const submitPayment = (input: {
  kind: PaymentKind;
  planId?: 'essentials' | 'atelier';
  topupQty?: number;
  utr: string;
  email: string;
}) =>
  api.post<{ success: boolean; message: string; payment: PaymentRecord }>('/payments', input);

export const getMyPayments = () =>
  api.get<{ success: boolean; payments: PaymentRecord[] }>('/payments/mine');

export const getPayment = (id: string) =>
  api.get<{ success: boolean; payment: PaymentRecord }>(`/payments/${id}`);

export interface AdminPaymentsPage {
  payments: PaymentRecord[];
  total: number;
  page: number;
  pageSize: number;
  counts: { pending: number; verified: number; rejected: number };
}

export const listPayments = (params: { status?: PaymentStatus; q?: string; page?: number; pageSize?: number }) =>
  api.get<{ success: boolean } & AdminPaymentsPage>('/payments', { params });

export const approvePayment = (id: string) =>
  api.post<{ success: boolean; message: string; payment: PaymentRecord }>(`/payments/${id}/approve`);

export const rejectPayment = (id: string, reason?: string) =>
  api.post<{ success: boolean; message: string; payment: PaymentRecord }>(`/payments/${id}/reject`, { reason });

/* ---------------------------------------------------------- admin usage */

export type TryOnPlan = 'starter' | 'essentials' | 'atelier';

export interface UsageAccount {
  email: string;
  plan: TryOnPlan;
  used: number;
  /** null on an unlimited (Atelier) account. */
  limit: number | null;
  unlimited: boolean;
  updatedAt?: string;
}

export interface AdminUsagePage {
  accounts: UsageAccount[];
  total: number;
  page: number;
  pageSize: number;
  planCounts: Record<TryOnPlan, number>;
}

export const listTryOnUsageAdmin = (params: { plan?: TryOnPlan; q?: string; page?: number; pageSize?: number }) =>
  api.get<{ success: boolean } & AdminUsagePage>('/tryon/admin/usage', { params });

export interface EmailAlertStatus {
  configured: boolean;
  recipient: string | null;
  smtpUser: string | null;
  lastAlertOutcome: { at: string; ok: boolean; detail: string } | null;
}

export const getEmailAlertStatus = () =>
  api.get<{ success: boolean } & EmailAlertStatus>('/payments/email-status');