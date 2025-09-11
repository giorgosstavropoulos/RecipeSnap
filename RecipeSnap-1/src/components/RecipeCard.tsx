import React from 'react';

interface RecipeCardProps {
    title: string;
    description: string;
    imageUrl: string;
    ingredients: string[];
}

const RecipeCard: React.FC<RecipeCardProps> = ({ title, description, imageUrl, ingredients }) => {
    return (
        <div className="recipe-card">
            <img src={imageUrl} alt={title} className="recipe-image" />
            <h2 className="recipe-title">{title}</h2>
            <p className="recipe-description">{description}</p>
            <h3>Ingredients:</h3>
            <ul className="recipe-ingredients">
                {ingredients.map((ingredient, index) => (
                    <li key={index}>{ingredient}</li>
                ))}
            </ul>
        </div>
    );
};

export default RecipeCard;