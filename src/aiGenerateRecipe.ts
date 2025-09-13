import { genkit } from 'genkit';
import { googleAI, gemini } from '@genkit-ai/googleai';

const ai = genkit({
  plugins: [googleAI()],
  model: gemini('gemini-1.5-flash'),
});

export type GeneratedRecipe = {
  id: string;
  title: string;
  description?: string;
  ingredients: { amount?: string; name: string }[];
  instructions: string[];
  nutrition: { calories?: number; protein?: string; carbs?: string; fat?: string } | null;
};

// Generate 6 structured recipes using Genkit/Gemini
export async function generateRecipeFromIngredients(ingredients: string[]): Promise<GeneratedRecipe[]> {
  const prompt = `You are an expert chef. Given a list of ingredients, generate exactly 6 unique recipes that use those ingredients. Be creative and diverse. --- IGNORE ---
Return ONLY a JSON array (no commentary, no markdown, no extra text). Each recipe object must contain the following keys exactly: \n- id (string, short, url-safe)\n- title (string)\n- description (string)\n- ingredients (array of strings)\n- instructions (array of strings)\n- nutrition (object with keys: calories, protein, fat, carbs as strings)\n
Example output:\n[\n  {\n    "id": "spaghetti-pomodoro-1",\n    "title": "Classic Spaghetti Pomodoro",\n    "description": "A simple Italian pasta with fresh tomatoes and basil.",\n    "ingredients": ["spaghetti", "tomatoes", "basil", "garlic", "olive oil", "salt", "pepper"],\n    "instructions": ["Boil spaghetti until al dente.", "Sauté garlic in olive oil.", "Add tomatoes and simmer.", "Stir in basil and combine with pasta."],\n    "nutrition": {"calories":"420","protein":"12g","fat":"8g","carbs":"75g"}\n  }\n]\n
Now produce the JSON array using these ingredients: ${ingredients.join(', ')}`;
  try {
    const resp = await ai.generate(prompt);
    // genkit's generate may return an object; try to extract text safely
    let text = (resp && (resp as any).text) || (typeof resp === 'string' ? resp : '');
    // Strip common markdown code fences (```json ... ``` or ``` ... ```)
    if (text) {
      text = text.replace(/```(?:json)?\s*/gi, '');
      text = text.replace(/```/g, '');
      text = text.trim();
    }
    console.log('Raw recipe generator output:', text);
    // Attempt to find JSON array in the text
    let jsonMatch: string | null = null;
    if (text) {
      const start = text.indexOf('[');
      if (start !== -1) {
        // find matching closing bracket for the array
        let depth = 0;
        for (let i = start; i < text.length; i++) {
          if (text[i] === '[') depth++;
          else if (text[i] === ']') depth--;
          if (depth === 0) {
            jsonMatch = text.slice(start, i + 1);
            break;
          }
        }
      }
    }
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch);
      if (Array.isArray(parsed)) {
        let mapped: GeneratedRecipe[] = parsed.map((r: any, idx: number) => ({
          id: r.id || `ai-${Date.now().toString(36)}-${idx}`,
          title: r.title || '',
          description: r.description || '',
          ingredients: (r.ingredients || []).map((ing: any) => (typeof ing === 'string' ? { name: ing } : ing)),
          instructions: r.instructions || [],
          nutrition: r.nutrition || null,
        }));
        // Ensure each recipe has meaningful content; fill sparse fields
        mapped = (mapped as GeneratedRecipe[]).map((r, idx) => fillRecipeFallback(r as GeneratedRecipe, ingredients, idx));
        // If the model returned fewer than 6 recipes, pad with fallback recipes
        if (mapped.length < 6) {
          const needed = 6 - mapped.length;
          for (let i = 0; i < needed; i++) {
            const idx = mapped.length + i;
            mapped.push({
              id: `ai-fallback-${Date.now().toString(36)}-${i}`,
              title: `Extra Recipe ${idx + 1}`,
              description: `Another recipe using ${ingredients.join(', ')}`,
              ingredients: ingredients.map(i => ({ name: i })),
              instructions: ['Combine ingredients', 'Cook to taste'],
              nutrition: null,
            });
          }
        }
        // If the model returned more than 6, trim to 6
        if (mapped.length > 6) mapped = mapped.slice(0, 6);
        return mapped;
      }
    }
  } catch (err) {
    console.error('Generate recipe error:', err);
  }
  // Fallback single recipe
  return [{
    id: 'ai-' + Date.now().toString(36),
    title: `Recipe using ${ingredients.join(', ')}`,
    description: `Simple recipe using ${ingredients.join(', ')}`,
    ingredients: ingredients.map(i => ({ name: i })),
    instructions: ['Mix all ingredients.', 'Cook and enjoy.'],
    nutrition: null,
  }];
}

// Helper: fill missing fields for a generated recipe using detected ingredients
function fillRecipeFallback(recipe: GeneratedRecipe, detectedIngredients: string[], idx: number): GeneratedRecipe {
  const title = recipe.title && recipe.title.trim() ? recipe.title : generateTitle(detectedIngredients, idx);
  const instructions = (recipe.instructions && recipe.instructions.length > 0) ? recipe.instructions : generateInstructions(detectedIngredients);
  const ingredients = (recipe.ingredients && recipe.ingredients.length > 0) ? recipe.ingredients : detectedIngredients.map(i => ({ name: i }));
  const description = recipe.description && recipe.description.trim() ? recipe.description : `A tasty ${title.toLowerCase()} using ${detectedIngredients.join(', ')}.`;
  return {
    ...recipe,
    id: recipe.id || `ai-${Date.now().toString(36)}-${idx}`,
    title,
    description,
    instructions,
    ingredients,
    nutrition: recipe.nutrition || null,
  };
}

function generateTitle(ings: string[], idx: number) {
  if (!ings || ings.length === 0) return `Delicious Recipe ${idx + 1}`;
  const main = ings[0].split(' ')[0];
  return `${capitalize(main)} & ${ongsSummary(ings.slice(1))}`;
}

function ongsSummary(rest: string[]) {
  if (!rest || rest.length === 0) return 'Style';
  if (rest.length === 1) return rest[0];
  return `${rest[0]} and ${rest[1]}`;
}

function capitalize(s: string) { return s.charAt(0).toUpperCase() + s.slice(1); }

function generateInstructions(ings: string[]) {
  const lines = [] as string[];
  lines.push(`Prepare the following ingredients: ${ings.join(', ')}.`);
  lines.push('Combine the ingredients in a pan or bowl as appropriate.');
  lines.push('Cook over medium heat until done, seasoning to taste.');
  lines.push('Serve warm and enjoy.');
  return lines;
}
