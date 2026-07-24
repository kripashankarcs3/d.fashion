import { create } from 'zustand';

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

export interface AnalysisResult {
  enhancedImageUrl: string;
  skinConcerns: SkinConcerns;
  colorProfile: ColorProfile;
  recommendations: Recommendations;
  analyzedAt: string;
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
  wardrobeItems: WardrobeItem[];
  activityLog: ActivityEvent[];
  userPreferences: UserPreferences;
  referenceImageUrl: string | null;

  setAnalysisResult: (result: AnalysisResult) => void;
  addWardrobeItem: (item: WardrobeItem) => void;
  addActivityEvent: (event: Omit<ActivityEvent, 'id'>) => void;
  setUserPreferences: (prefs: Partial<UserPreferences>) => void;
  setReferenceImageUrl: (url: string | null) => void;
}

export const useStyleStore = create<StyleStore>((set) => ({
  analysisResult: null,
  wardrobeItems: [],
  activityLog: [],
  userPreferences: { displayName: '', theme: 'system' },
  referenceImageUrl: null,

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
}));