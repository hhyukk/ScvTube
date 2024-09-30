'use client';

import { useState } from 'react';

export default function SignupPage() {
    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [password2, setPassword2] = useState('');
    const [location, setLocation] = useState('');

    return(
        <div className="signup-container">
            <h1>회원가입</h1>
            <form>
                <div className="signup-input-group">
                    <label htmlFor="name">이름</label>
                    <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e)=>setName(e.target.value)}
                    placeholder="이름을 입력하시오"
                    />
                </div>

                <div className="signup-input-group">
                    <label htmlFor="username">유저네임</label>
                    <input
                    type="text"
                    id="username"
                    value={username}
                    onChange={(e)=>setUsername(e.target.value)}
                    placeholder="유저네임을 입력하시오"
                    />
                </div>

                <div className="signup-input-group">
                    <label htmlFor="email">이메일</label>
                    <input
                    type="text"
                    id="email"
                    value={email}
                    onChange={(e)=>setEmail(e.target.value)}
                    placeholder="이메일을 입력하시오"
                    />
                </div>

                <div className="signup-input-group">
                    <label htmlFor="password">비밀번호</label>
                    <input
                    type="text"
                    id="password"
                    value={password}
                    onChange={(e)=>setPassword(e.target.value)}
                    placeholder="비밀번호를 입력하시오"
                    />
                </div>

                <div className="signup-input-group">
                    <label htmlFor="password2">비밀번호 확인</label>
                    <input
                    type="text"
                    id="password2"
                    value={password2}
                    onChange={(e)=>setPassword2(e.target.value)}
                    placeholder="비밀번호를 다시 입력하시오"
                    />
                </div>

                <div className="signup-input-group">
                    <label htmlFor="location">지역</label>
                    <input
                    type="text"
                    id="location"
                    value={location}
                    onChange={(e)=>setLocation(e.target.value)}
                    placeholder="지역을 입력하시오"
                    />
                </div>

                <button type="submit" className="signup-button">
                    회원가입
                </button>
            </form>
        </div>
    )
}