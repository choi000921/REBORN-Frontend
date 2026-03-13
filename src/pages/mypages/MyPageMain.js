// src/pages/mypages/MyPageMain.js

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios'; // 1. (추가) axios import
import './MyPageMain.css'; 
import defaultProfile from '../../components/defaultProfile.png';

// 2. (삭제) Mock Data (mockUserData) 삭제

const MyPageMain = () => {
    // 3. (수정) 로딩 상태와 에러 상태 추가
    const [userData, setUserData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // 4. (수정) 페이지 로드 시 백엔드 API 호출
    useEffect(() => {
        // "내 정보" API 호출
        const fetchMyInfo = async () => {
            try {
                const token = localStorage.getItem('accessToken');
                if (!token) {
                    // (수정) 토큰이 없으면 로그인 페이지로 강제 이동 (선택 사항)
                    // throw new Error('로그인이 필요합니다.');
                    window.location.href = '/login'; // 로그인 페이지로 이동
                    return;
                }

                // (핵심) axios로 백엔드 API 호출 (Postman과 동일)
                const response = await axios.get('http://localhost:8080/api/users/me', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                // 성공 시, 응답 데이터를 state에 저장
                setUserData(response.data); 

            } catch (err) {
                console.error("내 정보 로딩 실패:", err);
                setError(err.message);
                // (수정) 403 (토큰 만료 등) 에러 시 로그인 페이지로
                if (err.response && (err.response.status === 401 || err.response.status === 403)) {
                    alert('로그인 세션이 만료되었습니다. 다시 로그인해주세요.');
                    window.location.href = '/login';
                }
            } finally {
                setIsLoading(false);
            }
        };

        fetchMyInfo();
    }, []); // [] : 페이지가 처음 로드될 때 1번만 실행

    // 5. (임시) userScore에 따른 리본 계산
    const getRibbon = (score) => {
        if (score > 4.0) return "🎀 골드 리본";
        if (score > 3.0) return "🥈 실버 리본";
        return "🥉 브론즈 리본";
    };

    // --- (6. 로딩 및 에러 처리) ---
    if (isLoading) {
        return <div>로딩 중...</div>;
    }

    if (error || !userData) {
        return <div style={{ color: 'red' }}>오류: {error || '사용자 정보를 불러올 수 없습니다.'}</div>;
    }

    // 7. (수정) 이제 userData는 "진짜" 데이터입니다.
    // (참고: userLocation은 DTO에서 이미 합쳐져서 옵니다.)
    return (
        <div className="mypage-main-container">
            <h1 className="mypage-title">{userData.userNickname}님의 마이페이지</h1>
            
            <div className="profile-section">
                {/* 1. 프로필 (왼쪽) */}
                <div className="profile-left">
                    <div className="profile-image-box">
                        <img src={defaultProfile} alt="profile" />
                    </div>
                    <Link to="/mypage/edit" className="edit-profile-btn">
                        정보 수정
                    </Link>
                </div>

                {/* 2. 프로필 (오른쪽) */}
                <div className="profile-right">
                    <div className="profile-info-top">
                        <span className="info-name">{userData.userName}</span>
                        <span className="info-nickname">{userData.userNickname}</span>
                        <span className="info-score">{getRibbon(userData.userScore)} ({userData.userScore}점)</span>
                    </div>
                    
                    <div className="profile-counts">
                        <div className="count-box">
                            <span>판매 수</span>
                            <strong>{userData.salesCount}</strong>
                        </div>
                        <div className="count-box">
                            <span>구매 수</span>
                            <strong>{userData.purchasesCount}</strong>
                        </div>
                    </div>

                    <div className="profile-info-bottom">
                        <div className="info-row">
                            <span>📞 {userData.userPhone}</span>
                            <span>🎂 {userData.userBirthday}</span>
                        </div>
                        <div className="info-row">
                            <span>✉️ {userData.userEmail}</span>
                            <span>📍 {userData.userLocation}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MyPageMain;