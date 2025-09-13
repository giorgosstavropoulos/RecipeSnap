import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Navbar from '../components/Navbar';

const MyRecipes: React.FC = () => {
  const [savedRecipes, setSavedRecipes] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [openRecipe, setOpenRecipe] = useState<any | null>(null);
  const router = useRouter();

  useEffect(() => {
    try {
      const data = localStorage.getItem('savedRecipes');
      if (data) setSavedRecipes(JSON.parse(data));
    } catch (e) {
      console.error('Failed to load savedRecipes', e);
    }
  }, []);

  const filteredRecipes = savedRecipes.filter((r: any) =>
    r.title?.toLowerCase().includes(search.toLowerCase())
  );

  const deleteRecipe = (idOrIndex: string | number) => {
    // Remove by id if possible, otherwise by index
    let updated: any[] = [];
    if (typeof idOrIndex === 'string') {
      updated = savedRecipes.filter(r => r.id !== idOrIndex);
    } else {
      updated = savedRecipes.slice();
      updated.splice(idOrIndex, 1);
    }
    setSavedRecipes(updated);
    try {
      localStorage.setItem('savedRecipes', JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to persist savedRecipes', e);
    }
    // if the open recipe was deleted, close the modal
    if (openRecipe && (typeof idOrIndex === 'number' ? savedRecipes[idOrIndex]?.id === openRecipe.id : idOrIndex === openRecipe.id)) {
      setOpenRecipe(null);
    }
  };

  return (
    <div>
      <Navbar />
      <div style={{ padding: '2.4rem', maxWidth: 1100, margin: '0 auto' }}>
        <h1 style={{ color: '#fff' }}>Saved Recipes</h1>

        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2.5rem' }}>
          <input
            type="text"
            placeholder="Search your recipes..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              width: 350,
              padding: '0.7rem 1.2rem',
              borderRadius: 8,
              border: '1px solid #222',
              background: '#181512',
              color: '#fff',
              fontSize: '1.1rem',
              outline: 'none',
            }}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '1.5rem' }}>
          {filteredRecipes.length === 0 ? (
            <p style={{ color: '#bdbdbd', fontSize: '1.1rem' }}>No recipes saved yet.</p>
          ) : (
            filteredRecipes.map((recipe, i) => (
              <div
                key={i}
                onClick={() => setOpenRecipe(recipe)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === 'Enter') setOpenRecipe(recipe); }}
                style={{ background: '#181512', border: '1px solid #222', borderRadius: '12px', padding: '1.5rem 2rem', minWidth: 350, maxWidth: 700, textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '0.7rem', cursor: 'pointer' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem' }}>
                  <span style={{ color: '#ffb347', fontSize: '1.3rem' }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 24 24"><path fill="#ffb347" d="M7.5 2A2.5 2.5 0 0 0 5 4.5V6a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4.5A2.5 2.5 0 0 0 16.5 2h-9ZM4 8v11.5A2.5 2.5 0 0 0 6.5 22h11a2.5 2.5 0 0 0 2.5-2.5V8H4Zm2.5 2h11a.5.5 0 0 1 .5.5v9a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5Z"/></svg>
                  </span>
                  <span style={{ color: '#fff', fontWeight: 'bold', fontSize: '1.2rem' }}>{recipe.title}</span>
                </div>
                <div style={{ color: '#bdbdbd', fontSize: '1.05rem', marginTop: '0.3rem' }}>{recipe.description}</div>
              </div>
            ))
          )}
        </div>

        {openRecipe && (
          <div style={{ position: 'fixed', left: 0, top: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }} onClick={() => setOpenRecipe(null)}>
            <div style={{ background: '#181512', padding: 24, borderRadius: 12, maxWidth: 900, width: '90%', color: '#fff' }} onClick={e => e.stopPropagation()}>
              <h2 style={{ color: '#ffb347' }}>{openRecipe.title}</h2>
              <p style={{ color: '#bdbdbd' }}>{openRecipe.description}</p>
              <h3 style={{ color: '#fff' }}>Ingredients</h3>
              <ul>
                {openRecipe.ingredients && openRecipe.ingredients.map((ing: any, idx: number) => (
                  <li key={idx} style={{ color: '#fff' }}>{typeof ing === 'string' ? ing : ing.name}</li>
                ))}
              </ul>
              <h3 style={{ color: '#fff' }}>Instructions</h3>
              <ol>
                {openRecipe.instructions && openRecipe.instructions.map((step: string, idx: number) => (
                  <li key={idx} style={{ color: '#fff', marginBottom: 8 }}>{step}</li>
                ))}
              </ol>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12 }}>
                <div>
                  <button onClick={() => setOpenRecipe(null)} style={{ background: '#ffb347', border: 'none', padding: '0.6rem 1rem', borderRadius: 8, cursor: 'pointer' }}>Close</button>
                </div>
                <div>
                  <button onClick={() => {
                    if (openRecipe?.id) deleteRecipe(openRecipe.id);
                    else {
                      // find index and delete
                      const idx = savedRecipes.findIndex(r => r === openRecipe);
                      if (idx !== -1) deleteRecipe(idx);
                    }
                  }} style={{ background: '#ff5c5c', border: 'none', padding: '0.6rem 1rem', borderRadius: 8, cursor: 'pointer', color: '#fff' }}>Delete</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyRecipes;
