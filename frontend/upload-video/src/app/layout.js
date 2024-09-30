'use client';

import './globals.css';
import { useState } from 'react';

export default function RootLayout({ children }) {
  const [isMenuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!isMenuOpen);
  };

  return (
    <html lang="en">
      <body>
        <nav className={`nav ${isMenuOpen ? 'open' : ''}`}>
          <div className="logo">
            <a href="/">Wetube</a>
          </div>

          <div className="search-container">
            <input
              type="text"
              placeholder="Search videos..."
              className="search-input"
            />
            <button className="search-button">Search</button>
          </div>

          <div className="hamburger" onClick={toggleMenu}>
            &#9776;
          </div>
          <div className={`menu ${isMenuOpen ? 'open' : ''}`}>
            <a href="/">Home</a>
            <a href="/signup">Sign up</a>
            <a href="/login">Login</a>
            <a href="/search">Search</a>
            <a href="/upload">Upload Video</a>
          </div>
        </nav>
        {children}
      </body>
    </html>
  );
}
