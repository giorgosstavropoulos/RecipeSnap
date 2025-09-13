import React from 'react';
import Link from 'next/link';

const Navbar = () => (
  <nav className="navbar">
    <div className="navbar-logo">
      <span role="img" aria-label="chef">👨‍🍳</span> <b>RecipeSnap</b>
    </div>
    <div className="navbar-links">
      <Link href="/">Home</Link>
      <Link href="/my-recipes">My Recipes</Link>
    </div>
  </nav>
);

export default Navbar;
