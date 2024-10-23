'use client';

import './globals.css';
import { useState, useEffect } from 'react';
import Link from 'next/link';

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
    event.preventDefault();
    try {
      const response = await fetch('http://localhost:4000/users/logout', {
        method: 'POST', // 로그아웃 요청은 POST 방식으로 보내야 합니다
        credentials: 'include', // 세션 쿠키를 포함하여 요청
      });

      // 응답 상태 코드 확인
      if (response.ok) {
        console.log('Hi');
        setIsLoggedIn(false); // 로그인 상태 업데이트
        window.location.href = '/'; // 로그아웃 후 루트 페이지로 이동
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
                <Link href="/profile">Profile</Link>
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
