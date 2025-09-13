// Genkit AI: Identify ingredients from image (mock implementation)


import { identifyIngredientsGemini } from './geminiImageIngredients';

// Uses Gemini multimodal API to identify ingredients from a dish image (base64 string)
export async function identifyIngredientsFromImage(imageBase64OrUrl: string): Promise<string[]> {
  try {
    return await identifyIngredientsGemini(imageBase64OrUrl);
  } catch (err) {
    console.error('Gemini AI error:', err);
    return [];
  }
}
