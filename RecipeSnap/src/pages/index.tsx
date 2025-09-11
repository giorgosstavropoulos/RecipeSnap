import React from 'react';
import RecipeCard from '../components/RecipeCard';

const Home = () => {
  const recipes = [
    {
      id: 1,
      title: 'Spaghetti Carbonara',
      description: 'A classic Italian pasta dish made with eggs, cheese, pancetta, and pepper.',
      image: '/images/spaghetti-carbonara.jpg',
    },
    {
      id: 2,
      title: 'Chicken Tikka Masala',
      description: 'A popular Indian dish made with marinated chicken in a spiced curry sauce.',
      image: '/images/chicken-tikka-masala.jpg',
    },
    // Add more recipes as needed
  ];

  return (
    <div>
      <h1>Welcome to RecipeSnap</h1>
      <div className="recipe-list">
        {recipes.map(recipe => (
          <RecipeCard key={recipe.id} recipe={recipe} />
        ))}
      </div>
    </div>
  );
};

export default Home;