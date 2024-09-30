'use client'

import { useState } from 'react';

export default function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    return (
        <div className="login-container">
            <h1>로그인</h1>
            <form>
                <div className="login-input-group">
                    <lable htmlFor="username">유저네임</lable>
                    <input
                    type="text"
                    id="username"
                    value={username}
                    onChange={(e)=>setUsername(e.target.value)}
                    placeholder='유저네임을 입력하시오'
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
                    />
                </div>

                <button type="submit" className="login-button">
                    로그인
                </button>
            </form>
        </div>
    )
}