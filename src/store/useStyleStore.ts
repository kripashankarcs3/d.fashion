import { create } from 'zustand';
import { persist } from 'zustand/middleware';

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
  activityLog: ActivityEvent[];
  userPreferences: UserPreferences;
  referenceImageUrl: string | null;

  recordAnalysis: (result: AnalysisResult) => void;
  saveReport: (result: AnalysisResult) => boolean;
  setAnalysisResult: (result: AnalysisResult) => void;
  addWardrobeItem: (item: WardrobeItem) => void;
  addActivityEvent: (event: Omit<ActivityEvent, 'id'>) => void;
  setUserPreferences: (prefs: Partial<UserPreferences>) => void;
  setReferenceImageUrl: (url: string | null) => void;
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
        return saved;
      },
      setAnalysisResult: (result) => set({ analysisResult: result }),
      addWardrobeItem: (item) =>
        set((state) => ({ wardrobeItems: [...state.wardrobeItems, item] })),
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
    }),
    {
      name: 'dfashion_analysis_result',
      partialize: (state) => ({
        analysisResult: state.analysisResult,
        analysisHistory: state.analysisHistory,
        savedReports: state.savedReports,
        wardrobeItems: state.wardrobeItems,
        activityLog: state.activityLog,
        referenceImageUrl: state.referenceImageUrl,
      }),
    },
  ),
);