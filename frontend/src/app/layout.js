'use client';

import './globals.css';
import { useState, useEffect } from 'react';

export default function RootLayout({ children }) {
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');

  useEffect(() => {
    // 페이지가 로드될 때 세션을 확인하여 로그인 상태 업데이트
    const checkSession = async () => {
      try {
        const response = await fetch('http://localhost:4000/session', {
          method: 'GET',
          credentials: 'include', // 세션 쿠키를 포함하여 요청
        });
        const data = await response.json();

        if (data.loggedIn) {
          setIsLoggedIn(true); // 로그인 상태로 업데이트
        }
      } catch (err) {
        console.error('세션 확인 오류:', err);
      }
    };

    checkSession();
  }, []);

  const toggleMenu = () => {
    setMenuOpen(!isMenuOpen);
  };

  const handleLogout = async () => {
    try {
      // 로그아웃 처리
      await fetch('http://localhost:4000/logout', {
        method: 'POST',
        credentials: 'include',
      });

      setIsLoggedIn(false);
      window.location.href = '/'; // 로그아웃 후 루트 페이지로 이동
    } catch (err) {
      console.error('로그아웃 오류:', err);
    }
  };

  const handleSearch = () => {
    if (searchKeyword.trim()) {
      window.location.href = `/search?keyword=${encodeURIComponent(searchKeyword)}`;
    } else {
      alert('검색어를 입력하세요.');
    }
  };

  return (
    <html lang="en">
      <body>
        <nav className={`nav ${isMenuOpen ? 'open' : ''}`}>
          <div className="logo">
            <a href="/">ESCtube</a>
          </div>

          <div className="search-container">
            <input
              type="text"
              placeholder="검색어 입력..."
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
            />
            <button onClick={handleSearch}>검색</button>
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
