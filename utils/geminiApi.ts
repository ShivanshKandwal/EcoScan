import { SustainabilityAnalysis } from '@/types/sustainability';

// Gemini API configuration
const GEMINI_API_KEY = 'Private Gemini Key , not revealing due to security reason';
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;

export async function analyzeImageWithGemini(base64Image: string): Promise<SustainabilityAnalysis> {
  try {
    const response = await fetch(GEMINI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `Analyze this image for a sustainability app. You are an environmental expert analyzing objects for their sustainability impact. Provide a JSON response with the following exact structure:

                {
                  "objectName": "specific name of the main object in the image",
                  "category": "category (electronics, clothing, food, household, furniture, transportation, etc.)",
                  "sustainabilityScore": number from 1-10 (10 being most sustainable),
                  "environmentalImpact": "detailed description of environmental impact including manufacturing, usage, and disposal phases",
                  "ecoFriendlyAlternatives": ["specific alternative 1", "specific alternative 2", "specific alternative 3"],
                  "facts": ["interesting environmental fact 1", "interesting environmental fact 2", "interesting environmental fact 3"],
                  "keyPoints": ["key sustainability point 1", "key sustainability point 2", "key sustainability point 3"],
                  "materials": ["primary material 1", "primary material 2"],
                  "carbonFootprint": "estimated carbon footprint description",
                  "recyclability": "recyclability assessment"
                }
                
                Guidelines for scoring:
                - 9-10: Highly sustainable (renewable materials, minimal processing, biodegradable)
                - 7-8: Good sustainability (some eco-friendly aspects, recyclable)
                - 5-6: Moderate sustainability (mixed environmental impact)
                - 3-4: Poor sustainability (resource-intensive, limited recyclability)
                - 1-2: Very poor sustainability (highly polluting, non-recyclable)
                
                Focus on:
                - Material composition and sourcing
                - Manufacturing process and energy consumption
                - Transportation and packaging impact
                - Product lifespan and durability
                - End-of-life disposal and recyclability
                - Carbon footprint throughout lifecycle
                
                Provide specific, actionable eco-friendly alternatives and educational facts with real statistics when possible.`
              },
              {
                inline_data: {
                  mime_type: "image/jpeg",
                  data: base64Image
                }
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.4,
          topK: 32,
          topP: 1,
          maxOutputTokens: 1024,
        }
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Gemini API Error Response:', errorData);
      throw new Error(`API request failed with status ${response.status}: ${errorData}`);
    }

    const data = await response.json();
    
    if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
      throw new Error('Invalid response structure from Gemini API');
    }

    const generatedText = data.candidates[0].content.parts[0].text;
    
    // Extract JSON from the response - handle potential markdown formatting
    let jsonText = generatedText;
    
    // Remove markdown code blocks if present
    if (jsonText.includes('```json')) {
      const jsonMatch = jsonText.match(/```json\s*([\s\S]*?)\s*```/);
      if (jsonMatch) {
        jsonText = jsonMatch[1];
      }
    } else if (jsonText.includes('```')) {
      const jsonMatch = jsonText.match(/```\s*([\s\S]*?)\s*```/);
      if (jsonMatch) {
        jsonText = jsonMatch[1];
      }
    }
    
    // Find JSON object in the text
    const jsonMatch = jsonText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error('No JSON found in response:', generatedText);
      throw new Error('No valid JSON found in API response');
    }

    let analysisResult;
    try {
      analysisResult = JSON.parse(jsonMatch[0]);
    } catch (parseError) {
      console.error('JSON Parse Error:', parseError);
      console.error('Raw JSON text:', jsonMatch[0]);
      throw new Error('Failed to parse JSON response from API');
    }

    // Validate required fields
    const requiredFields = ['objectName', 'category', 'sustainabilityScore', 'environmentalImpact', 'ecoFriendlyAlternatives', 'facts'];
    for (const field of requiredFields) {
      if (!analysisResult[field]) {
        throw new Error(`Missing required field: ${field}`);
      }
    }

    // Ensure arrays are properly formatted
    if (!Array.isArray(analysisResult.ecoFriendlyAlternatives)) {
      analysisResult.ecoFriendlyAlternatives = [];
    }
    if (!Array.isArray(analysisResult.facts)) {
      analysisResult.facts = [];
    }
    if (!Array.isArray(analysisResult.keyPoints)) {
      analysisResult.keyPoints = [];
    }
    if (!Array.isArray(analysisResult.materials)) {
      analysisResult.materials = [];
    }

    // Ensure sustainability score is within valid range
    analysisResult.sustainabilityScore = Math.max(1, Math.min(10, Math.round(analysisResult.sustainabilityScore)));

    return analysisResult;
  } catch (error) {
    console.error('Gemini API Error:', error);
    
    // Re-throw the error so the UI can handle it appropriately
    if (error instanceof Error) {
      throw error;
    } else {
      throw new Error('Unknown error occurred while analyzing image');
    }
  }
}
