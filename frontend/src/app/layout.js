'use client';

import './globals.css';
import { useState, useEffect } from 'react';

export default function RootLayout({ children }) {
    const [isMenuOpen, setMenuOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const loggedIn = localStorage.getItem('isLoggedIn');
        if (loggedIn === 'true') {
            setIsLoggedIn(true);
        }
    }, []);

    const toggleMenu = () => {
        setMenuOpen(!isMenuOpen);
    };

    const handleLogout = () => {
        setIsLoggedIn(false);
        localStorage.removeItem('isLoggedIn');
        window.location.href = '/login';
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
                        {!isLoggedIn && <a href="/signup">Sign up</a>}
                        {!isLoggedIn ? (
                            <a href="/login">Login</a>
                        ) : (
                            <>
                                <a href="/profile">Profile</a>
                                <button onClick={handleLogout}>Logout</button>
                            </>
                        )}
                        <a href="/search">Search</a>
                        <a href="/upload">Upload Video</a>
                    </div>
                </nav>
                {children}
            </body>
        </html>
    );
}