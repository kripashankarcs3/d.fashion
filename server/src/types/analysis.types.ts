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
  makeupShades: string[];
  hairOptions: string[];
  skincareRoutine: string[];
}

export interface AnalysisResult {
  enhancedImage: string;
  skinAnalysis: SkinAnalysis;
  colorAnalysis: ColorAnalysis;
  recommendations: RecommendationResult;
}