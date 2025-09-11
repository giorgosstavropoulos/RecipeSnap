import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { FaHome } from 'react-icons/fa';
import { FaBookOpen } from 'react-icons/fa';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <nav className="navbar">
        <div className="navbar-logo">
          <span style={{ fontSize: '2rem', marginRight: '0.5rem', color: '#ffb347' }}> 9D1373 </span>
          RecipeSnap
        </div>
        <div className="navbar-links">
          <a href="/" className="navbar-link"><FaHome style={{marginRight: '0.3rem'}} /> Home</a>
          <a href="/my-recipes" className="navbar-link"><FaBookOpen style={{marginRight: '0.3rem'}} /> My Recipes</a>
        </div>
      </nav>
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
