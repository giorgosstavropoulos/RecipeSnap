// Utility to call Gemini multimodal API for image ingredient recognition
import { GoogleGenerativeAI } from "@google/generative-ai";

const MODEL_NAME = "gemini-1.5-flash";
const API_KEY = process.env.GOOGLE_GENAI_API_KEY || ""; // Set your API key in .env

const genAI = new GoogleGenerativeAI(API_KEY);

export async function identifyIngredientsGemini(imageBase64: string): Promise<string[]> {
  // Convert base64 to Google Generative AI's image format
  const imagePart = {
    inlineData: {
      data: imageBase64,
      mimeType: "image/jpeg", // or detect from input
    },
  };
  // Ask the model to return exactly 5 likely ingredients in a comma-separated list.
  const prompt = "Identify the 5 most likely food ingredients visible in this dish image. Return exactly 5 items as a comma-separated list, ordered from most to least prominent.";
  const model = genAI.getGenerativeModel({ model: MODEL_NAME });
  const result = await model.generateContent([
    { text: prompt },
    { inlineData: imagePart.inlineData },
  ]);
  const text = result.response.candidates?.[0]?.content?.parts?.[0]?.text || "";
  let items = text.split(',').map(s => s.trim()).filter(Boolean);
  // If model returned more than 5, trim; if fewer, pad with sensible placeholders from the most common pantry items
  if (items.length > 5) items = items.slice(0, 5);
  if (items.length < 5) {
    const pantry = ['salt', 'pepper', 'olive oil', 'water', 'lemon'];
    for (let i = items.length; i < 5; i++) {
      // pick pantry items not already included
      const pick = pantry.find(p => !items.includes(p));
      if (pick) items.push(pick);
    }
  }
  return items;
}
