import type { NextApiRequest, NextApiResponse } from 'next';
import { generateRecipeFromIngredients } from '../../aiGenerateRecipe';

// Simple in-memory cache: Map<cacheKey, { timestamp, data }>
const cache = new Map<string, { ts: number; data: any }>();
const CACHE_TTL_MS = 1000 * 60 * 60; // 1 hour

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  const { ingredients } = req.body;
  if (!ingredients || !Array.isArray(ingredients)) {
    return res.status(400).json({ error: 'Missing or invalid ingredients' });
  }
  const cacheKey = ingredients.slice().sort().join(',').toLowerCase();
  const cached = cache.get(cacheKey);
  if (cached && (Date.now() - cached.ts) < CACHE_TTL_MS) {
    return res.status(200).json({ recipes: cached.data });
  }
  try {
    const recipeList = await generateRecipeFromIngredients(ingredients);
    cache.set(cacheKey, { ts: Date.now(), data: recipeList });
    res.status(200).json({ recipes: recipeList });
  } catch (error) {
    console.error('Generate recipe error:', error);
    res.status(500).json({ error: 'Failed to generate recipe' });
  }
}
