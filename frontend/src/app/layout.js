'use client';

import './globals.css';
import { useState, useEffect } from 'react';

export default function RootLayout({ children }) {
    const [isMenuOpen, setMenuOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [searchKeyword, setSearchKeyword] = useState(''); // 검색어 상태 추가

    useEffect(() => {
        // const loggedIn = localStorage.getItem('isLoggedIn');
        // if (loggedIn === 'true') {
        //     setIsLoggedIn(true);
        // }
    }, []);

    const toggleMenu = () => {
        setMenuOpen(!isMenuOpen);
    };

    const handleLogout = () => {
        setIsLoggedIn(false);
        localStorage.removeItem('isLoggedIn');
        window.location.href = '/login';
    };

    const handleSearch = () => {
        if (searchKeyword.trim()) {
            window.location.href = `/search?keyword=${encodeURIComponent(searchKeyword)}`; // 검색 페이지로 이동
        } else {
            alert('검색어를 입력하세요.');
        }
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
                            placeholder="검색어 입력..."
                            value={searchKeyword}
                            onChange={(e) => setSearchKeyword(e.target.value)} // 검색어 상태 업데이트
                        />
                        <button onClick={handleSearch}>검색</button> {/* 검색 버튼 추가 */}
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
                        <a href="/upload">Upload Video</a>
                    </div>
                </nav>
                {children}
            </body>
        </html>
    );
}
