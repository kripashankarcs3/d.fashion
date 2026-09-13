export interface SkinAnalysis {
  skinTone: string;
  skinType: string;
  acne: number;
  wrinkles: number;
  darkSpots: number;
}

export interface ColorAnalysis {
  season: string;
  undertone: string;
  recommendedColors: string[];
}

export interface RecommendationResult {
  outfitPalette: string[];
  avoidColors: string[];
  makeupShades: {
    foundation: string;
    blush: string;
    lip: string;
  };
  makeupShadeNames?: {
    foundation: string;
    blush: string;
    lip: string;
  };
  hairColorOptions: string[];
  skincareRoutine: Array<{ step: number; product: string; reason: string }>;
  styleInsight: string;
}

export interface AnalysisResult {
  enhancedImage: string;
  skinAnalysis: SkinAnalysis;
  colorAnalysis: ColorAnalysis;
  recommendations: RecommendationResult;
}