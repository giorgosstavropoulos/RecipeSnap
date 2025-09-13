import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Navbar from '../../components/Navbar';

const recipes = [
  {
    id: '1',
    title: 'Creamy Lemon Herb Salmon',
    description: 'Succulent salmon fillets pan-seared to perfection and bathed in a rich, velvety lemon-herb cream sauce. This dish is elegantly simple yet bursting with bright, aromatic flavors.',
    ingredients: [
      { amount: '2 (6 oz)', name: 'salmon fillets, skin on or off' },
      { amount: '1 tbsp', name: 'olive oil' },
      { amount: '1/2 tsp', name: 'salt, or to taste' },
      { amount: '1/4 tsp', name: 'black pepper, or to taste' },
      { amount: '2 cloves', name: 'garlic, minced' },
      { amount: '1/2 cup', name: 'heavy cream' },
      { amount: '2 tbsp', name: 'fresh lemon juice' },
      { amount: '1 tsp', name: 'dried oregano' },
      { amount: '1/2 tsp', name: 'lemon zest (from 1/2 a lemon)' },
    ],
    instructions: [
      'Pat salmon fillets dry with paper towels and season generously with salt and black pepper on both sides.',
      'Heat olive oil in a large skillet over medium-high heat. Once hot, add the salmon fillets skin-side down (if applicable) and sear for 4-5 minutes until golden brown and crispy.',
      'Flip the salmon and cook for another 2-3 minutes, or until cooked to your desired doneness. Remove the salmon from the skillet and set aside on a plate.',
      'Reduce heat to medium. Add minced garlic to the skillet and sauté for 30 seconds until fragrant.',
      'Pour in the heavy cream, fresh lemon juice, dried oregano, and lemon zest. Stir well, scraping up any browned bits from the bottom of the pan. Bring the sauce to a gentle simmer.',
      'Return the cooked salmon fillets to the skillet, spooning the creamy lemon herb sauce over them. Let simmer for 1-2 minutes to allow the flavors to meld and the salmon to warm through.',
      'Serve immediately, garnished with fresh herbs if desired.'
    ],
    nutrition: {
      calories: 1260,
      protein: '71g',
      carbs: '9g',
      fat: '101g',
    }
  },
  {
    id: '2',
    title: 'Baked Salmon with Lemon-Oregano Cream Sauce',
    description: 'Tender baked salmon fillets topped with a luscious lemon-oregano cream sauce. A perfect blend of citrus and herbs for a light, flavorful meal.',
    ingredients: [
      { amount: '2 (6 oz)', name: 'salmon fillets' },
      { amount: '1 tbsp', name: 'olive oil' },
      { amount: '1/2 tsp', name: 'salt' },
      { amount: '1/4 tsp', name: 'black pepper' },
      { amount: '1 cup', name: 'heavy cream' },
      { amount: '1 tbsp', name: 'lemon juice' },
      { amount: '1 tsp', name: 'dried oregano' },
      { amount: '1/2 tsp', name: 'lemon zest' },
    ],
    instructions: [
      'Preheat oven to 400°F (200°C). Place salmon fillets in a baking dish and drizzle with olive oil. Season with salt and pepper.',
      'Bake for 12-15 minutes, or until salmon is cooked through and flakes easily with a fork.',
      'Meanwhile, in a saucepan, combine heavy cream, lemon juice, oregano, and lemon zest. Simmer for 3-4 minutes until slightly thickened.',
      'Spoon the sauce over the baked salmon and serve immediately.'
    ],
    nutrition: {
      calories: 980,
      protein: '60g',
      carbs: '6g',
      fat: '80g',
    }
  },
  {
    id: '3',
    title: 'Pan-Seared Salmon with Creamy Lemon Pepper Sauce',
    description: 'Crispy pan-seared salmon fillets served with a tangy, peppery lemon cream sauce. A quick and delicious dinner option.',
    ingredients: [
      { amount: '2 (6 oz)', name: 'salmon fillets' },
      { amount: '1 tbsp', name: 'olive oil' },
      { amount: '1/2 tsp', name: 'salt' },
      { amount: '1/2 tsp', name: 'black pepper' },
      { amount: '1 cup', name: 'heavy cream' },
      { amount: '1 tbsp', name: 'lemon juice' },
      { amount: '1/2 tsp', name: 'lemon zest' },
    ],
    instructions: [
      'Season salmon fillets with salt and pepper. Heat olive oil in a skillet over medium-high heat.',
      'Sear salmon fillets for 4-5 minutes per side until golden and cooked through.',
      'In a small saucepan, combine heavy cream, lemon juice, and lemon zest. Simmer for 2-3 minutes.',
      'Serve salmon topped with the creamy lemon pepper sauce.'
    ],
    nutrition: {
      calories: 900,
      protein: '58g',
      carbs: '5g',
      fat: '75g',
    }
  },
  {
    id: '4',
    title: 'Salmon Pasta with Lemon-Oregano Cream Sauce',
    description: 'Flaky salmon tossed with pasta and a creamy lemon-oregano sauce. Comforting, zesty, and perfect for a weeknight dinner.',
    ingredients: [
      { amount: '2 (6 oz)', name: 'salmon fillets' },
      { amount: '8 oz', name: 'pasta' },
      { amount: '1 tbsp', name: 'olive oil' },
      { amount: '1/2 tsp', name: 'salt' },
      { amount: '1/4 tsp', name: 'black pepper' },
      { amount: '1 cup', name: 'heavy cream' },
      { amount: '1 tbsp', name: 'lemon juice' },
      { amount: '1 tsp', name: 'dried oregano' },
      { amount: '1/2 tsp', name: 'lemon zest' },
    ],
    instructions: [
      'Cook pasta according to package instructions. Drain and set aside.',
      'Season salmon fillets with salt and pepper. Heat olive oil in a skillet and cook salmon until done. Flake into pieces.',
      'In a saucepan, combine heavy cream, lemon juice, oregano, and lemon zest. Simmer for 3-4 minutes.',
      'Toss pasta, salmon, and sauce together. Serve warm.'
    ],
    nutrition: {
      calories: 1100,
      protein: '55g',
      carbs: '60g',
      fat: '65g',
    }
  }
];

const RecipeDetail = () => {
  const router = useRouter();
  const { id } = router.query;
  const [saved, setSaved] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [recipe, setRecipe] = useState<any>(null);

  useEffect(() => {
    if (id) {
      const found = recipes.find(r => r.id === id);
      if (found) {
        setRecipe(found);
        return;
      }
      // try to read generated recipes from localStorage (client-only)
      try {
        const gen = localStorage.getItem('generatedRecipes');
        if (gen) {
          const parsed = JSON.parse(gen);
          if (parsed[id as string]) setRecipe(parsed[id as string]);
        }
      } catch (e) {
        // ignore
      }
    }
  }, [id]);

  const saveRecipe = () => {
    setSaved(true);
    setShowToast(true);
    if (!recipe) return;
    // Save title and description to localStorage
    const data = localStorage.getItem('savedRecipes');
    let savedArr = data ? JSON.parse(data) : [];
    if (!savedArr.find((r: any) => r.title === recipe.title)) {
      // Save the full recipe object so the saved list can open full details
      savedArr.push({
        id: recipe.id,
        title: recipe.title,
        description: recipe.description,
        ingredients: recipe.ingredients,
        instructions: recipe.instructions,
        nutrition: recipe.nutrition,
      });
      localStorage.setItem('savedRecipes', JSON.stringify(savedArr));
    }
    setTimeout(() => setShowToast(false), 3000);
  };

  if (!recipe) return null;


  return (
    <>
      <div style={{ minHeight: '100vh', background: '#000' }}>
        <Navbar />
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', minHeight: '90vh', marginTop: '2.5rem' }}>
          <div style={{ background: '#181512', border: '1px solid #222', borderRadius: '16px', padding: '2.5rem 2.5rem 2rem 2.5rem', maxWidth: 900, width: '100%' }}>
            <h1 style={{ color: '#ffb347', fontSize: '2.3rem', fontWeight: 'bold', textAlign: 'center', marginBottom: '0.7rem' }}>{recipe.title}</h1>
            <p style={{ color: '#bdbdbd', fontSize: '1.15rem', textAlign: 'center', marginBottom: '1.5rem', marginTop: 0 }}>{recipe.description}</p>
            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              <button
                onClick={saveRecipe}
                disabled={saved}
                style={{
                  background: saved ? '#222' : '#ffb347',
                  color: saved ? '#fff' : '#181512',
                  border: 'none',
                  borderRadius: 8,
                  padding: '0.7rem 2.2rem',
                  fontWeight: 'bold',
                  fontSize: '1.1rem',
                  cursor: saved ? 'default' : 'pointer',
                  marginBottom: '1.5rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                }}
              >
                {saved ? (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#fff" viewBox="0 0 24 24"><path d="M17 3H7a2 2 0 0 0-2 2v16l7-3 7 3V5a2 2 0 0 0-2-2Z"/></svg>
                    Saved
                  </>
                ) : (
                  'Save'
                )}
              </button>
            </div>
            <div style={{ display: 'flex', gap: '2.5rem', flexWrap: 'wrap', justifyContent: 'space-between' }}>
              {/* Ingredients */}
              <div style={{ flex: 1, minWidth: 220 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.7rem' }}>
                  <span style={{ color: '#ffb347', fontSize: '1.2rem' }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 24 24"><path fill="#ffb347" d="M7.5 2A2.5 2.5 0 0 0 5 4.5V6a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4.5A2.5 2.5 0 0 0 16.5 2h-9ZM4 8v11.5A2.5 2.5 0 0 0 6.5 22h11a2.5 2.5 0 0 0 2.5-2.5V8H4Zm2.5 2h11a.5.5 0 0 1 .5.5v9a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5Z"/></svg>
                  </span>
                  <span style={{ fontWeight: 'bold', fontSize: '1.15rem', color: '#fff' }}>Ingredients</span>
                </div>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                  {recipe.ingredients.map((ing: any, i: number) => (
                    <li key={i} style={{ marginBottom: '0.5rem', color: '#fff' }}>
                      <span style={{ color: '#ffb347', fontWeight: 'bold' }}>{ing.amount}</span> <span style={{ color: '#fff' }}>{ing.name}</span>
                    </li>
                  ))}
                </ul>
              </div>
              {/* Instructions */}
              <div style={{ flex: 2, minWidth: 320 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.7rem' }}>
                  <span style={{ color: '#ffb347', fontSize: '1.2rem' }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 24 24"><path fill="#ffb347" d="M7.5 2A2.5 2.5 0 0 0 5 4.5V6a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4.5A2.5 2.5 0 0 0 16.5 2h-9ZM4 8v11.5A2.5 2.5 0 0 0 6.5 22h11a2.5 2.5 0 0 0 2.5-2.5V8H4Zm2.5 2h11a.5.5 0 0 1 .5.5v9a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5Z"/></svg>
                  </span>
                  <span style={{ fontWeight: 'bold', fontSize: '1.15rem', color: '#fff' }}>Instructions</span>
                </div>
                <ol style={{ paddingLeft: '1.2rem', color: '#fff', margin: 0 }}>
                  {recipe.instructions.map((step: string, i: number) => (
                    <li key={i} style={{ marginBottom: '1rem', display: 'flex', alignItems: 'flex-start', gap: '0.7rem' }}>
                      <span style={{ background: '#ffb347', color: '#181512', borderRadius: '50%', width: 28, height: 28, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '1.1rem', marginTop: 2 }}>{i + 1}</span>
                      <span style={{ color: '#fff', fontSize: '1.05rem' }}>{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
              {/* Nutrition */}
              <div style={{ flex: 1, minWidth: 180 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.7rem' }}>
                  <span style={{ color: '#ffb347', fontSize: '1.2rem' }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 24 24"><path fill="#ffb347" d="M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7Zm0 9.5A2.5 2.5 0 1 1 12 6a2.5 2.5 0 0 1 0 5.5Z"/></svg>
                  </span>
                  <span style={{ fontWeight: 'bold', fontSize: '1.15rem', color: '#fff' }}>Nutrition</span>
                </div>
                <div style={{ color: '#fff', fontSize: '1.05rem', marginTop: '0.7rem' }}>
                  Calories: {recipe.nutrition.calories}<br />
                  Protein: {recipe.nutrition.protein}<br />
                  Carbohydrates: {recipe.nutrition.carbs}<br />
                  Fat: {recipe.nutrition.fat}
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Toast notification */}
        {showToast && (
          <div style={{
            position: 'fixed',
            bottom: 32,
            right: 32,
            background: '#181512',
            border: '1px solid #222',
            borderRadius: 12,
            padding: '1.2rem 2rem',
            color: '#fff',
            fontSize: '1.1rem',
            boxShadow: '0 2px 12px rgba(0,0,0,0.18)',
            zIndex: 9999,
            minWidth: 320,
            maxWidth: 400,
            textAlign: 'left',
            fontFamily: 'Georgia, serif',
          }}>
            <div style={{ fontWeight: 'bold', marginBottom: 6 }}>Recipe Saved!</div>
            <div>"{recipe.title}" has been added to your saved recipes.</div>
          </div>
        )}
      </div>
    </>
  );
}

export default RecipeDetail;
