// src/pages/LoginPage.js

import React, { useState } from 'react';
import axios from 'axios';
import './LoginPage.css'; // 2. 로그인 페이지 전용 CSS import
import { Link, useNavigate } from 'react-router-dom';

const LoginPage = () => {
    const [loginId, setLoginId] = useState('');
    const [password, setPassword] = useState('');
    const [keepLoggedIn, setKeepLoggedIn] = useState(false); // 3. '로그인 상태 유지' state
    const navigate = useNavigate(); // 2. (핵심) useNavigate hook을 호출하여 navigate 함수를 생성

    // (로그인 로직은 이전과 동일)
    const handleLogin = async (e) => {
        e.preventDefault(); 
        if (!loginId || !password) {
            alert('아이디와 비밀번호를 모두 입력해주세요.');
            return;
        }
        try {
            
            const response = await axios.post('http://localhost:8080/api/auth/login', {
                loginId: loginId,
                password: password
            });
            const { accessToken, nickname, userClass } = response.data;
            
            // 1. 토큰 저장
            localStorage.setItem('accessToken', accessToken);
            // 2. (필수) 닉네임도 저장
            localStorage.setItem('userNickname', nickname);
            localStorage.setItem('userClass', userClass);
            alert(`${nickname}님, 환영합니다!`);
            if (userClass === 1) {
                navigate('/admin');
            } else {
                navigate('/'); 
            }
        } catch (error) {
            console.error("로그인 실패:", error);
            if (error.response && (error.response.status === 401 || error.response.status === 403)) {
                alert('아이디 또는 비밀번호가 일치하지 않습니다.');
            } else {
                alert('로그인 중 오류가 발생했습니다.');
            }
        }
    };

    // 4. (수정) 화면에 보여질 JSX (네이버 레이아웃 참조)
    return (
        <div className="login-page-container">
            <div className="login-form-wrapper">
                
                {/* 1. 로고 */}
                <Link to="/" className="login-logo">
                    RE:BORN 🎀
                </Link>

                {/* 2. 로그인 폼 */}
                <form onSubmit={handleLogin} className="login-form">
                    
                    {/* ID 입력란 */}
                    <div className="input-group">
                        <label htmlFor="loginId">아이디</label>
                        <input 
                            type="text" 
                            id="loginId"
                            value={loginId}
                            onChange={(e) => setLoginId(e.target.value)}
                            autoComplete="username"
                        />
                    </div>

                    {/* 비밀번호 입력란 */}
                    <div className="input-group">
                        <label htmlFor="password">비밀번호</label>
                        <input 
                            type="password" 
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            autoComplete="current-password"
                        />
                    </div>

                    {/* 로그인 옵션 (로그인 상태 유지) */}
                    <div className="login-options">
                        <label>
                            <input 
                                type="checkbox" 
                                checked={keepLoggedIn}
                                onChange={(e) => setKeepLoggedIn(e.target.checked)}
                            />
                            로그인 상태 유지
                        </label>
                    </div>

                    {/* 로그인 버튼 */}
                    <button type="submit" className="login-button">
                        로그인
                    </button>
                    
                </form>

                {/* 3. 하단 링크 */}
                <div className="login-links">
                    <Link to="/find-id">아이디 찾기</Link>
                    <span className="divider">|</span>
                    <Link to="/find-password">비밀번호 찾기</Link>
                    <span className="divider">|</span>
                    <Link to="/signup">회원가입</Link>
                </div>
                
            </div>
        </div>
    );
};

export default LoginPage;