import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useAuthStore } from '@/store/useAuthStore';
import { saveReportToCloud } from '@/services/api';

export interface SkinConcerns {
  acne: number;
  darkSpots: number;
  wrinkles: number;
  pores: number;
  oiliness: number;
  dryness: number;
  redness: number;
  eyeBags: number;
  darkCircles: number;
  uneven: number;
  sensitivity: number;
  texture: number;
  firmness: number;
  radiance: number;
}

export interface ColorProfile {
  undertone: 'warm' | 'cool' | 'neutral';
  skinToneHex: string;
  eyeColor: string;
  lipColor: string;
  hairColor: string;
}

export interface Recommendations {
  outfitPalette: string[];
  avoidColors: string[];
  makeupShades: {
    foundation: string;
    blush: string;
    lip: string;
  };
  hairColorOptions: string[];
  skincareRoutine: Array<{
    step: number;
    product: string;
    reason: string;
  }>;
  styleInsight: string;
}

export interface StyleArchetype {
  title: string;
  description: string;
}

export interface AnalysisResult {
  enhancedImageUrl: string;
  skinConcerns: SkinConcerns;
  colorProfile: ColorProfile;
  recommendations: Recommendations;
  analyzedAt: string;
  colourSeason?: string;
  seasonConfidence?: number;
  bestNeutrals?: string[];
  styleArchetypes?: StyleArchetype[];
}

export interface WardrobeItem {
  id: string;
  imageUrl: string;
  name: string;
  category: string;
  palette: string[];
  styleTags: string[];
  addedAt: string;
}

export interface TryOnHistoryEntry {
  id: string;
  resultUrl: string;
  garmentName: string;
  garmentImg: string;
  kind: 'outfit' | 'look' | 'hair' | 'analysis';
  colourHex?: string;
  timestamp: string;
}

export interface ActivityEvent {
  id: string;
  action: 'upload' | 'tryon' | 'chat' | 'report';
  label: string;
  timestamp: string;
  color?: string;
}

export interface UserPreferences {
  displayName: string;
  theme: 'light' | 'dark' | 'system';
}

interface StyleStore {
  analysisResult: AnalysisResult | null;
  analysisHistory: AnalysisResult[];
  savedReports: AnalysisResult[];
  wardrobeItems: WardrobeItem[];
  tryOnHistory: TryOnHistoryEntry[];
  activityLog: ActivityEvent[];
  userPreferences: UserPreferences;
  referenceImageUrl: string | null;

  recordAnalysis: (result: AnalysisResult) => void;
  saveReport: (result: AnalysisResult) => boolean;
  setAnalysisResult: (result: AnalysisResult) => void;
  addWardrobeItem: (item: WardrobeItem) => void;
  renameWardrobeItem: (id: string, name: string) => void;
  removeWardrobeItem: (id: string) => void;
  addTryOnHistory: (entry: Omit<TryOnHistoryEntry, 'id'>) => void;
  removeTryOnHistory: (id: string) => void;
  addActivityEvent: (event: Omit<ActivityEvent, 'id'>) => void;
  setUserPreferences: (prefs: Partial<UserPreferences>) => void;
  setReferenceImageUrl: (url: string | null) => void;
  resetLocalData: () => void;
}

function readCachedAnalysis(): AnalysisResult | null {
  try {
    const raw = localStorage.getItem('dfashion_analysis_result');
    if (!raw) return null;
    return JSON.parse(raw)?.state?.analysisResult ?? null;
  } catch {
    return null;
  }
}

const cachedAnalysis = readCachedAnalysis();

export const useStyleStore = create<StyleStore>()(
  persist(
    (set) => ({
      analysisResult: cachedAnalysis,
      analysisHistory: [],
      savedReports: [],
      wardrobeItems: [],
      tryOnHistory: [],
      activityLog: [],
      userPreferences: { displayName: '', theme: 'system' },
      referenceImageUrl: cachedAnalysis?.enhancedImageUrl ?? null,

      recordAnalysis: (result) =>
        set((state) => ({
          analysisResult: result,
          analysisHistory: state.analysisResult
            ? [
                ...state.analysisHistory.filter(
                  (a) => a.analyzedAt !== state.analysisResult?.analyzedAt,
                ),
                state.analysisResult,
              ].slice(0, 5)
            : state.analysisHistory,
        })),
      saveReport: (result) => {
        let saved = false;
        set((state) => {
          if (state.savedReports.some((a) => a.analyzedAt === result.analyzedAt)) {
            return state;
          }
          saved = true;
          return {
            savedReports: [result, ...state.savedReports].slice(0, 10),
          };
        });
        if (saved && useAuthStore.getState().token) {
          void saveReportToCloud(result).catch(() => {
            // Best-effort sync — the report stays in the local store.
          });
        }
        return saved;
      },
      setAnalysisResult: (result) => set({ analysisResult: result }),
      addWardrobeItem: (item) =>
        set((state) => ({ wardrobeItems: [...state.wardrobeItems, item] })),
      renameWardrobeItem: (id, name) =>
        set((state) => ({
          wardrobeItems: state.wardrobeItems.map((item) =>
            item.id === id ? { ...item, name } : item,
          ),
        })),
      removeWardrobeItem: (id) =>
        set((state) => ({
          wardrobeItems: state.wardrobeItems.filter((item) => item.id !== id),
        })),
      addTryOnHistory: (entry) =>
        set((state) => ({
          tryOnHistory: [
            { ...entry, id: crypto.randomUUID() },
            ...state.tryOnHistory,
          ].slice(0, 50),
        })),
      removeTryOnHistory: (id) =>
        set((state) => ({
          tryOnHistory: state.tryOnHistory.filter((e) => e.id !== id),
        })),
      addActivityEvent: (event) =>
        set((state) => ({
          activityLog: [
            { ...event, id: crypto.randomUUID() },
            ...state.activityLog,
          ].slice(0, 50),
        })),
      setUserPreferences: (prefs) =>
        set((state) => ({
          userPreferences: { ...state.userPreferences, ...prefs },
        })),
      setReferenceImageUrl: (url) => set({ referenceImageUrl: url }),
      resetLocalData: () =>
        set({
          analysisResult: null,
          analysisHistory: [],
          savedReports: [],
          wardrobeItems: [],
          tryOnHistory: [],
          activityLog: [],
          referenceImageUrl: null,
        }),
    }),
    {
      name: 'dfashion_analysis_result',
      partialize: (state) => ({
        analysisResult: state.analysisResult,
        analysisHistory: state.analysisHistory,
        savedReports: state.savedReports,
        wardrobeItems: state.wardrobeItems,
        tryOnHistory: state.tryOnHistory,
        activityLog: state.activityLog,
        referenceImageUrl: state.referenceImageUrl,
      }),
    },
  ),
);

const USER_SCOPE_KEY = 'dfashion_last_user';

/**
 * Keeps the on-device store tied to one account. Signing in as somebody else,
 * or signing out, wipes the previous member's photos, looks and activity so a
 * shared device never shows one person's analysis to the next.
 *
 * A first-ever sign-in keeps whatever was analysed as a guest — that work
 * belongs to the person who just claimed the account.
 */
export function scopeStoreToUser(uid: string | null) {
  let previous: string | null = null;
  try {
    previous = localStorage.getItem(USER_SCOPE_KEY);
  } catch {
    return;
  }

  if (previous === uid) return;

  try {
    if (uid) localStorage.setItem(USER_SCOPE_KEY, uid);
    else localStorage.removeItem(USER_SCOPE_KEY);
  } catch {
    // Storage unavailable — scoping is best-effort.
  }

  if (previous !== null && previous !== uid) {
    useStyleStore.getState().resetLocalData();
  }
}
