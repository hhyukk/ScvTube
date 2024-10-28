'use client';

import './globals.css';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function RootLayout({ children }) {
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [username, setUsername] = useState('');

  useEffect(() => {
    // 페이지가 로드될 때 세션을 확인하여 로그인 상태 업데이트
    const checkSession = async () => {
      try {
        const response = await fetch('http://localhost:4000/session', {
          method: 'GET',
          credentials: 'include',
        });
        const data = await response.json();

        if (data.loggedIn) {
          setIsLoggedIn(true);
          setUsername(data.user.username);
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

  const handleLogout = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch('http://localhost:4000/users/logout', {
        method: 'POST',
        credentials: 'include',
      });

      if (response.ok) {
        setIsLoggedIn(false);
        setUsername('');
        window.location.href = '/';
      } else {
        console.error('로그아웃 실패:', response.statusText);
      }
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
              className="search-input"
              placeholder="검색어를 입력하세요"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
            />
            <button className="search-button" onClick={handleSearch}>
              검색
            </button>
          </div>

          <div className="hamburger" onClick={toggleMenu}>
            &#9776;
          </div>
          <div className={`menu ${isMenuOpen ? 'open' : ''}`}>
            <Link href="/">Home</Link>
            {!isLoggedIn && <Link href="/signup">Sign up</Link>}
            {!isLoggedIn ? (
              <Link href="/login">Login</Link>
            ) : (
              <>
                <Link href="/upload">Upload Video</Link>
                <Link href="/profile">{username}</Link>
                <a href="/logout" onClick={handleLogout}>Logout</a>
              </>
            )}
          </div>
        </nav>
        {children}
      </body>
    </html>
  );
}
