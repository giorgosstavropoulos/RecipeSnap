import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

const mockRecipe = {
  title: 'Lemon-Oregano Sauce',
  description:
    'Indulge in perfectly seared salmon fillets, crispy on the outside and flaky within, complemented by a luxurious, vibrant creamy sauce infused with fresh lemon and aromatic oregano.',
  ingredients: [
    { amount: '2 (6 oz)', name: 'salmon fillets, skin on or off' },
    { amount: '1 tbsp', name: 'olive oil' },
    { amount: '1/2 tsp', name: 'salt' },
    { amount: '1/4 tsp', name: 'black pepper' },
    { amount: '1/2 cup', name: 'heavy cream' },
    { amount: '2 tbsp', name: 'fresh lemon juice' },
    { amount: '1 tbsp', name: 'fresh oregano, chopped' },
    { amount: '1 tbsp', name: 'unsalted butter (optional, for richness)' },
    { amount: 'Pinch', name: 'salt (for sauce)' },
    { amount: 'Pinch', name: 'black pepper (for sauce)' },
  ],
};

const RecipeDetail = () => {
  const router = useRouter();
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    // Optionally, fetch recipe by ID from backend or Firestore
  }, [router.query]);

  const handleSave = () => {
    // Save to localStorage or Firestore
    setSaved(true);
    // Example: localStorage.setItem('myRecipes', JSON.stringify([mockRecipe]));
  };

  return (
    <div style={{ maxWidth: 800, margin: '2rem auto', background: '#181312', padding: '2rem', borderRadius: '1rem' }}>
      <h1 style={{ color: '#ffb347', textAlign: 'center', fontSize: '2.5rem', marginBottom: '1rem' }}>{mockRecipe.title}</h1>
      <p style={{ color: '#e0e0e0', textAlign: 'center', fontSize: '1.2rem', marginBottom: '2rem' }}>{mockRecipe.description}</p>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem' }}>
        <button onClick={handleSave} style={{ background: '#ffb347', color: '#181312', border: 'none', borderRadius: '0.5rem', padding: '0.75rem 2rem', fontWeight: 600, fontSize: '1.1rem', cursor: 'pointer' }}>
          {saved ? 'Saved!' : 'Save Recipe'}
        </button>
      </div>
      <h2 style={{ color: '#fff', fontWeight: 700, marginBottom: '1rem' }}>Ingredients</h2>
      <ul style={{ color: '#fff', fontSize: '1.1rem', lineHeight: 2 }}>
        {mockRecipe.ingredients.map((ing, idx) => (
          <li key={idx}>
            <span style={{ color: '#ffb347', fontWeight: 700 }}>{ing.amount}</span> {ing.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RecipeDetail;
