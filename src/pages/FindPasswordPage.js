// src/pages/FindPasswordPage.js

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './FindPage.css'; // 1. 공통 CSS 사용

const FindPasswordPage = () => {
    const [loginId, setLoginId] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!loginId) {
            alert('아이디를 입력해주세요.');
            return;
        }

        // (추후) 백엔드 API 호출 (POST /api/users/find-password { loginId: ... })
        console.log('비밀번호 찾기 시도:', { loginId });
        
        // (임시) 성공 시
        alert('가입 시 등록한 이메일로 비밀번호 재설정 링크를 발송했습니다.');
        // (임시) 실패 시
        // alert('일치하는 회원 정보가 없습니다.');
    };

    return (
        <div className="find-page-container">
            <div className="find-form-wrapper">
                
                <Link to="/" className="find-logo">
                    RE:BORN 🎀
                </Link>

                <h2 className="find-title">비밀번호 찾기</h2>

                <form onSubmit={handleSubmit} className="find-form">
                    
                    <div className="input-group">
                        <label htmlFor="loginId">아이디</label>
                        <input 
                            type="text" 
                            id="loginId"
                            value={loginId}
                            onChange={(e) => setLoginId(e.target.value)}
                        />
                    </div>

                    <button type="submit" className="find-button">
                        확인
                    </button>
                    
                </form>

                <div className="find-links">
                    <Link to="/login">로그인</Link>
                    <span className="divider">|</span>
                    <Link to="/find-id">아이디 찾기</Link>
                    <span className="divider">|</span>
                    <Link to="/signup">회원가입</Link>
                </div>
                
            </div>
        </div>
    );
};

export default FindPasswordPage;