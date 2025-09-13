import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import DishSelector from '../components/DishSelector';
import Link from 'next/link';
import Head from 'next/head';

const Home = () => {
  const [image, setImage] = useState<File | null>(null);
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [recipes, setRecipes] = useState<{id: string, title: string, ingredients: string[], nutrition: string}[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(false);

  // Placeholder for image upload and ingredient/recipe detection
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      // Only set the image preview when uploading. Do NOT run detection until user clicks the button.
      setImage(e.target.files[0]);
      setShowResults(false);
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
    setIngredients([]);
    setRecipes([]);
    setShowResults(false);
  };

  const handleFindIngredients = () => {
    // Run the actual image processing: convert image to base64, call identify endpoint and generate recipes.
    if (!image) return;
    const process = async () => {
      setLoading(true);
      try {
        const file = image as File;
        const reader = new FileReader();
        const base64: string | null = await new Promise((resolve, reject) => {
          reader.onerror = () => reject(new Error('Failed to read file'));
          reader.onloadend = () => {
            const result = reader.result as string | null;
            if (!result) return resolve(null);
            const parts = result.split(',');
            resolve(parts[1] || null);
          };
          reader.readAsDataURL(file);
        });

        if (!base64) {
          setLoading(false);
          return;
        }

        const res = await fetch('/api/identify-ingredients', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ imageBase64: base64 })
        });
        const data = await res.json();
        const aiIngredients = data.ingredients || [];
        setIngredients(aiIngredients);

        let aiRecipes: any[] = [];
        if (aiIngredients.length > 0) {
          const recipeRes = await fetch('/api/generate-recipe', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ingredients: aiIngredients })
          });
          const recipeData = await recipeRes.json();
          aiRecipes = recipeData.recipes || [];
        }

        if (aiRecipes.length === 0 && aiIngredients.length > 0) {
          aiRecipes = [{
            id: 'fallback-' + Date.now().toString(36),
            title: `Recipe using ${aiIngredients.join(', ')}`,
            description: '',
            ingredients: aiIngredients.map(i => ({ name: i })),
            instructions: ['Combine ingredients', 'Cook to taste'],
            nutrition: null,
          }];
        }

        setRecipes(aiRecipes);
        try {
          const existing = localStorage.getItem('generatedRecipes');
          const map = existing ? JSON.parse(existing) : {};
          aiRecipes.forEach(r => { map[r.id] = r; });
          localStorage.setItem('generatedRecipes', JSON.stringify(map));
        } catch (e) {
          // ignore localStorage errors
        }

        if (aiIngredients.length > 0) setShowResults(true);
      } catch (err) {
        console.error('Failed to process image', err);
      } finally {
        setLoading(false);
      }
    };
    process();
  };

  return (
    <>
      <Head>
        <title>RecipeSnap</title>
        <meta name="description" content="RecipeSnap - Your AI-powered recipe assistant" />
      </Head>
      <div>
        <Navbar />
  <main className="main-content home-centered">
          {!showResults && (
            <>
              <h1>
                <span role="img" aria-label="chef" style={{ color: '#ffb347', fontSize: '2.5rem' }}>🍳</span>
                RecipeSnap
              </h1>
              <p>Got ingredients but no ideas? Snap a photo, and let our AI chef whip up delicious recipes for you in seconds.</p>
            </>
          )}
          {!showResults && (
            <div className="create-frame">
              <div className="create-frame-title">Create a New Recipe</div>
              <div className="upload-section" style={{ border: 'none', boxShadow: 'none', background: 'none', padding: 0 }}>
                {/* Outer create-frame contains the upload section and button while no results are shown */}
                {image ? (
                  <div style={{ position: 'relative', textAlign: 'center' }}>
                    <img
                      src={URL.createObjectURL(image)}
                      alt="Uploaded dish"
                      style={{
                        width: '100%',
                        maxWidth: '400px',
                        borderRadius: '12px',
                        margin: '0 auto',
                        display: 'block',
                      }}
                    />
                    <button
                      onClick={handleRemoveImage}
                      style={{
                        position: 'absolute',
                        top: 10,
                        right: 10,
                        background: '#a05a06',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '50%',
                        width: 28,
                        height: 28,
                        cursor: 'pointer',
                        fontWeight: 'bold',
                        fontSize: 18,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                      aria-label="Remove image"
                    >
                      ×
                    </button>
                  </div>
                ) : (
                  <label className="upload-label">
                    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="none" viewBox="0 0 24 24"><path fill="#ffb347" d="M12 16a1 1 0 0 1-1-1V7.83l-2.59 2.58A1 1 0 0 1 7 9.41a1 1 0 0 1 0-1.41l4-4a1 1 0 0 1 1.41 0l4 4a1 1 0 0 1-1.41 1.41L13 7.83V15a1 1 0 0 1-1 1Zm-7 4a1 1 0 0 1 0-2h14a1 1 0 1 1 0 2H5Z"/></svg>
                    <input type="file" accept="image/*" onChange={handleImageUpload} />
                    <span>Drag & drop an image, or click to select</span>
                  </label>
                )}

                <button
                  className="find-ingredients-btn"
                  onClick={handleFindIngredients}
                  disabled={loading || !image}
                  style={loading ? { opacity: 0.7, cursor: 'not-allowed', position: 'relative' } : {}}
                >
                  {loading ? (
                    <>
                      <span className="spinner" style={{ marginRight: 10, verticalAlign: 'middle', display: 'inline-block' }}>
                        <svg width="18" height="18" viewBox="0 0 50 50">
                          <circle cx="25" cy="25" r="20" fill="none" stroke="#181512" strokeWidth="5" strokeDasharray="31.4 31.4" strokeLinecap="round">
                            <animateTransform attributeName="transform" type="rotate" from="0 25 25" to="360 25 25" dur="0.8s" repeatCount="indefinite" />
                          </circle>
                        </svg>
                      </span>
                      Finding Ingredients...
                    </>
                  ) : (
                    'Find Ingredients'
                  )}
                </button>
              </div>
            </div>
          )}
          {showResults && (
              <div className="results-container">
                {/* Ingredients row - now above recipes, outside dotted frame */}
                <div className="ingredients-box" style={{margin: '2rem 0 2rem 0', border:'none', textAlign: 'left'}}>
                  <div style={{display:'flex',alignItems:'center',gap:'0.5rem',marginBottom:'0.5rem'}}>
                    <span style={{color:'#ffb347',fontSize:'1.2rem'}}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 24 24"><path fill="#ffb347" d="M7.5 2A2.5 2.5 0 0 0 5 4.5V6a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4.5A2.5 2.5 0 0 0 16.5 2h-9ZM4 8v11.5A2.5 2.5 0 0 0 6.5 22h11a2.5 2.5 0 0 0 2.5-2.5V8H4Zm2.5 2h11a.5.5 0 0 1 .5.5v9a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5Z"/></svg>
                    </span>
                    <span style={{fontWeight:'bold',fontSize:'1.2rem',color:'#fff'}}>We found these ingredients:</span>
                  </div>
                  <div style={{display:'flex',gap:'0.5rem',flexWrap:'wrap'}}>
                    {ingredients.map((ing, i) => (
                      <span key={i} className="ingredient-pill">{ing}</span>
                    ))}
                  </div>
                </div>
                {/* Recipes row - now below ingredients, outside dotted frame */}
                <div className="recipes-section">
                  <h2 style={{color:'#fff',marginTop:'2rem',marginBottom:'1.5rem', textAlign: 'left'}}>Here are some recipe ideas...</h2>
                  <div className="recipe-cards">
                    {recipes.map(recipe => (
                      <div className="recipe-card" key={recipe.id}>
                        <div style={{display:'flex',alignItems:'center',gap:'0.5rem',marginBottom:'0.5rem'}}>
                          <span style={{color:'#ffb347',fontSize:'1.2rem'}}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 24 24"><path fill="#ffb347" d="M7.5 2A2.5 2.5 0 0 0 5 4.5V6a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4.5A2.5 2.5 0 0 0 16.5 2h-9ZM4 8v11.5A2.5 2.5 0 0 0 6.5 22h11a2.5 2.5 0 0 0 2.5-2.5V8H4Zm2.5 2h11a.5.5 0 0 1 .5.5v9a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5Z"/></svg>
                          </span>
                          <span style={{fontWeight:'bold',fontSize:'1.1rem',color:'#fff'}}>{recipe.title}</span>
                        </div>
                        <Link href={`/recipe/${recipe.id}`} className="view-recipe-link">View Recipe <span style={{marginLeft:'0.3rem'}}>&rarr;</span></Link>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              )}
          {/* Removed Try Random Dish AI section as requested */}
        </main>
      </div>
    </>
  );
};

export default Home;
