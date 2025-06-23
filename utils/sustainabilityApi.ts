import { SustainabilityAnalysis } from '@/types/sustainability';

// New sustainability API configuration
const SUSTAINABILITY_API_URL = 'https://sustainability-scanner.onrender.com/predict';

export interface SustainabilityAPIResponse {
  prediction: 'sustainable' | 'unsustainable';
  confidence?: number;
  details?: string;
  error?: string;
}

export async function analyzeSustainabilityWithAPI(base64Image: string): Promise<SustainabilityAPIResponse | null> {
  try {
    const response = await fetch(SUSTAINABILITY_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        image: base64Image,
        username: 'ecoscan_user' // Adding required username field
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Sustainability API Error:', response.status, errorText);
      
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch {
        errorData = { error: `HTTP ${response.status}: ${response.statusText}` };
      }
      
      return {
        prediction: 'sustainable', // Default fallback
        confidence: 0,
        error: errorData.error || `API Error: ${response.status}`
      };
    }

    const data = await response.json();
    return {
      prediction: data.prediction || 'sustainable',
      confidence: data.confidence || 0,
      details: data.details
    };
  } catch (error) {
    console.error('Sustainability API Request Failed:', error);
    return {
      prediction: 'sustainable',
      confidence: 0,
      error: 'Network error - Unable to connect to ML model'
    };
  }
}