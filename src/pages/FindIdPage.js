// src/pages/FindIdPage.js

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './FindPage.css'; // 1. 공통 CSS 사용

const FindIdPage = () => {
    const [name, setName] = useState('');
    const [nickname, setNickname] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!name || !nickname) {
            alert('이름과 닉네임을 모두 입력해주세요.');
            return;
        }

        // (추후) 백엔드 API 호출 (GET /api/users/find-id?name=...&nickname=...)
        console.log('아이디 찾기 시도:', { name, nickname });
        
        // (임시) 성공 시
        alert('회원님의 아이디는 [testuser] 입니다.');
        // (임시) 실패 시
        // alert('일치하는 회원 정보가 없습니다.');
    };

    return (
        <div className="find-page-container">
            <div className="find-form-wrapper">
                
                <Link to="/" className="find-logo">
                    RE:BORN 🎀
                </Link>

                <h2 className="find-title">아이디 찾기</h2>

                <form onSubmit={handleSubmit} className="find-form">
                    
                    <div className="input-group">
                        <label htmlFor="name">이름</label>
                        <input 
                            type="text" 
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>

                    <div className="input-group">
                        <label htmlFor="nickname">닉네임</label>
                        <input 
                            type="text" 
                            id="nickname"
                            value={nickname}
                            onChange={(e) => setNickname(e.target.value)}
                        />
                    </div>

                    <button type="submit" className="find-button">
                        아이디 찾기
                    </button>
                    
                </form>

                <div className="find-links">
                    <Link to="/login">로그인</Link>
                    <span className="divider">|</span>
                    <Link to="/find-password">비밀번호 찾기</Link>
                    <span className="divider">|</span>
                    <Link to="/signup">회원가입</Link>
                </div>
                
            </div>
        </div>
    );
};

export default FindIdPage;