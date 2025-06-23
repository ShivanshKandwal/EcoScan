export interface ScannedItem {
  id: string;
  imageUri: string;
  objectName: string;
  category: string;
  sustainabilityScore: number;
  environmentalImpact: string;
  ecoFriendlyAlternatives: string[];
  facts: string[];
  keyPoints?: string[];
  materials?: string[];
  carbonFootprint?: string;
  recyclability?: string;
  scannedAt: string;
  sustainabilityPrediction?: 'sustainable' | 'unsustainable';
  predictionConfidence?: number;
  apiError?: string;
}

export interface SustainabilityAnalysis {
  objectName: string;
  category: string;
  sustainabilityScore: number;
  environmentalImpact: string;
  ecoFriendlyAlternatives: string[];
  facts: string[];
  keyPoints?: string[];
  materials?: string[];
  carbonFootprint?: string;
  recyclability?: string;
}