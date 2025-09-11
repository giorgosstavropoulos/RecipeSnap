import React, { useState } from 'react';
import { FaUtensils, FaArrowRight } from 'react-icons/fa';

const mockRecipes = [
  {
    title: 'Pan-Seared Salmon with Creamy Lemon-Oregano Sauce',
    link: '#',
  },
  {
    title: 'Baked Salmon with Zesty Cream Sauce and Fresh Herbs',
    link: '#',
  },
  {
    title: 'Grilled Salmon with Lemon-Oregano Cream Drizzle',
    link: '#',
  },
  {
    title: 'Poached Salmon with Creamy Lemon-Oregano Dressing',
    link: '#',
  },
];

export default function Home() {
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [recipes, setRecipes] = useState([]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(URL.createObjectURL(e.target.files[0]));
      setLoading(true);
      setTimeout(() => {
        setRecipes(mockRecipes);
        setLoading(false);
      }, 2000); // Simulate API call
    }
  };

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '2rem 1rem' }}>
      <h1>RecipeSnap</h1>
      <p style={{ textAlign: 'center', color: '#bdbdbd', fontSize: '1.2rem', marginBottom: '2rem' }}>
        Got ingredients but no ideas? Snap a photo, and let our AI chef whip up delicious recipes for you in seconds.
      </p>
      <div style={{ background: '#231a16', border: '2px dashed #ffb347', borderRadius: '1rem', padding: '2rem', marginBottom: '2rem' }}>
        <h2 style={{ textAlign: 'center', color: '#fff', marginBottom: '1rem' }}>Create a New Recipe</h2>
        <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'block', margin: '1rem auto' }} />
        {image && <img src={image} alt="Uploaded dish" style={{ display: 'block', margin: '1rem auto', maxWidth: 300, borderRadius: 8, border: '2px solid #ffb347' }} />}
        <button style={{ display: 'block', margin: '1rem auto 0 auto' }}>Find Ingredients</button>
      </div>
      {loading && <p style={{ textAlign: 'center', color: '#ffb347', fontSize: '1.3rem' }}>Analyzing your dish...</p>}
      {recipes.length > 0 && (
        <>
          <h2 style={{ textAlign: 'center', color: '#ffb347', margin: '2rem 0 1rem 0' }}>Here are some recipe ideas...</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {recipes.map((recipe, idx) => (
              <div key={idx} style={{ background: '#181312', border: '1px solid #333', borderRadius: '1rem', padding: '1.5rem 2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <FaUtensils style={{ color: '#ffb347', fontSize: '2rem' }} />
                  <span style={{ color: '#fff', fontWeight: 600, fontSize: '1.3rem' }}>{recipe.title}</span>
                </div>
                <a href={recipe.link} style={{ color: '#ffb347', fontWeight: 600, fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  View Recipe <FaArrowRight />
                </a>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}