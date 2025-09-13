import React, { useState } from 'react';
import dishImages from './dishImages';

const getRandomDish = () => {
  const idx = Math.floor(Math.random() * dishImages.length);
  return dishImages[idx];
};

const DishSelector: React.FC = () => {
  const [selectedDish, setSelectedDish] = useState<string | null>(null);
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [recipe, setRecipe] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleRandomDish = () => {
    setSelectedDish(getRandomDish());
    setIngredients([]);
    setRecipe(null);
  };

  const handleIdentifyIngredients = async () => {
    if (!selectedDish) return;
    setLoading(true);
    // Call your API route for Genkit AI ingredient identification
    const res = await fetch('/api/identify-ingredients', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ imageUrl: selectedDish })
    });
    const data = await res.json();
    setIngredients(data.ingredients || []);
    setLoading(false);
  };

  const handleGenerateRecipe = async () => {
    if (ingredients.length === 0) return;
    setLoading(true);
    // Call your API route for Genkit AI recipe generation
    const res = await fetch('/api/generate-recipe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ingredients })
    });
    const data = await res.json();
    setRecipe(data.recipe || null);
    setLoading(false);
  };

  return (
    <div>
      <button onClick={handleRandomDish}>Choose Random Dish</button>
      {selectedDish && (
        <div>
          <img src={selectedDish} alt="Random Dish" style={{ maxWidth: 300 }} />
          <button onClick={handleIdentifyIngredients} disabled={loading}>
            Identify Ingredients
          </button>
        </div>
      )}
      {ingredients.length > 0 && (
        <div>
          <h3>Ingredients:</h3>
          <ul>
            {ingredients.map((ing, i) => (
              <li key={i}>{ing}</li>
            ))}
          </ul>
          <button onClick={handleGenerateRecipe} disabled={loading}>
            Generate Recipe
          </button>
        </div>
      )}
      {recipe && (
        <div>
          <h3>Recipe:</h3>
          <pre>{recipe}</pre>
        </div>
      )}
      {loading && <p>Loading...</p>}
    </div>
  );
};

export default DishSelector;
