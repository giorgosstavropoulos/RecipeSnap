import React, { useEffect, useState } from 'react';

const MyRecipes = () => {
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    // Load saved recipes from localStorage or Firestore
    // Example: setRecipes(JSON.parse(localStorage.getItem('myRecipes') || '[]'));
  }, []);

  return (
    <div style={{ maxWidth: 900, margin: '2rem auto', background: '#181312', padding: '2rem', borderRadius: '1rem' }}>
      <h1 style={{ color: '#ffb347', textAlign: 'center', fontSize: '2.5rem', marginBottom: '2rem' }}>My Recipes</h1>
      {recipes.length === 0 ? (
        <p style={{ color: '#e0e0e0', textAlign: 'center' }}>No saved recipes yet.</p>
      ) : (
        recipes.map((recipe, idx) => (
          <div key={idx} style={{ background: '#231a16', border: '2px dashed #ffb347', borderRadius: '1rem', padding: '1.5rem', marginBottom: '1.5rem' }}>
            <h2 style={{ color: '#ffb347', marginBottom: '0.5rem' }}>{recipe.title}</h2>
            <p style={{ color: '#e0e0e0', marginBottom: '1rem' }}>{recipe.description}</p>
            <h3 style={{ color: '#fff', fontWeight: 700 }}>Ingredients</h3>
            <ul style={{ color: '#fff', fontSize: '1.1rem', lineHeight: 2 }}>
              {recipe.ingredients.map((ing, i) => (
                <li key={i}>
                  <span style={{ color: '#ffb347', fontWeight: 700 }}>{ing.amount}</span> {ing.name}
                </li>
              ))}
            </ul>
          </div>
        ))
      )}
    </div>
  );
};

export default MyRecipes;
