'use client';

import { useState } from 'react';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:4000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log('로그인 성공:', data);
        // localStorage.setItem('isLoggedIn', 'true');
        // window.location.href = '/';
      } else {
        throw new Error(data.message || '로그인 실패');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <h1>로그인</h1>
      <form onSubmit={handleSubmit}>
        <div className="login-input-group">
          <label htmlFor="username">유저네임</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="유저네임을 입력하시오"
            required
          />
        </div>

        <div className="login-input-group">
          <label htmlFor="password">비밀번호</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="비밀번호를 입력하시오"
            required
          />
        </div>

        {error && <p className="error-message">{error}</p>}
        <button type="submit" className="login-button" disabled={loading}>
          {loading ? '로딩 중...' : '로그인'}
        </button>
      </form>
    </div>
  );
}