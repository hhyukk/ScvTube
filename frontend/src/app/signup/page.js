'use client';

import { useState } from 'react';
import { CSSTransition } from 'react-transition-group';

export default function SignupPage() {
    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [password2, setPassword2] = useState('');
    const [location, setLocation] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [isRedirecting, setIsRedirecting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccessMessage('');

        if (password !== password2) {
            setError('비밀번호가 일치하지 않습니다.');
            setLoading(false);
            return;
        }

        try {
            const response = await fetch('http://localhost:4000/join', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, username, email, password, location }),
            });

            const data = await response.json();

            if (response.ok) {
                console.log('회원가입 성공:', data);
                setSuccessMessage('회원가입 성공! 로그인 페이지로 이동합니다.');
                setIsRedirecting(true);
                // 잠시 후 로그인 페이지로 리다이렉트
                setTimeout(() => {
                    window.location.href = '/login';
                }, 2000);
            } else {
                throw new Error(data.message || '회원가입 실패');
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="signup-container">
            <h1>회원가입</h1>
            <CSSTransition
                in={isRedirecting}
                timeout={300}
                classNames="fade"
                unmountOnExit
            >
                <div className="redirecting-message">
                    회원가입 성공! 로그인 페이지로 이동 중입니다...
                </div>
            </CSSTransition>
            <form onSubmit={handleSubmit}>
                <div className="signup-input-group">
                    <label htmlFor="name">이름</label>
                    <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="이름을 입력하시오"
                        required
                    />
                </div>

                <div className="signup-input-group">
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

                <div className="signup-input-group">
                    <label htmlFor="email">이메일</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="이메일을 입력하시오"
                        required
                    />
                </div>

                <div className="signup-input-group">
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

                <div className="signup-input-group">
                    <label htmlFor="password2">비밀번호 확인</label>
                    <input
                        type="password"
                        id="password2"
                        value={password2}
                        onChange={(e) => setPassword2(e.target.value)}
                        placeholder="비밀번호를 다시 입력하시오"
                        required
                    />
                </div>

                <div className="signup-input-group">
                    <label htmlFor="location">지역</label>
                    <input
                        type="text"
                        id="location"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="지역을 입력하시오"
                        required
                    />
                </div>

                {error && <p className="error-message">{error}</p>}
                {successMessage && <p className="success-message">{successMessage}</p>}
                <button type="submit" className="signup-button" disabled={loading}>
                    {loading ? '가입 중...' : '회원가입'}
                </button>
            </form>
        </div>
    );
}