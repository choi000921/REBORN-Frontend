// /components/Header.js

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Header.css';

const Header = () => {
    // 1. 상태 관리
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userName, setUserName] = useState('');
    const [showUserDropdown, setShowUserDropdown] = useState(false);
    const [userClass, setUserClass] = useState(0); // 0: 일반, 1: 관리자

    // (임시) 인기 카테고리 (카테고리 필터용)
    const [topKeywords] = useState([
        '게임/취미', '디지털기기', '가구/인테리어', '생활가전',
        '여성의류', '도서/티켓', '기타'
    ]);

    // 검색어
    const [searchText, setSearchText] = useState('');

    const navigate = useNavigate();

    // 2. 로그인 상태 체크
    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        const nickname = localStorage.getItem('userNickname');
        const uClass = localStorage.getItem('userClass');

        if (token && nickname) {
            setIsLoggedIn(true);
            setUserName(nickname);
            setUserClass(Number(uClass) || 0);
        } else {
            setIsLoggedIn(false);
            setUserName('');
            setUserClass(0);
        }
    }, []);

    // 3. 로그아웃
    const handleLogout = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('userNickname');
        localStorage.removeItem('userClass');
        setIsLoggedIn(false);
        setShowUserDropdown(false);
        alert('로그아웃되었습니다.');
        navigate('/');
    };

    // 4. 검색 버튼 / 엔터
    const handleSearch = () => {
        const keyword = searchText.trim();
        if (!keyword) return;
        // 검색어는 q 파라미터로 전달 → SearchPage에서 처리
        navigate(`/search?q=${encodeURIComponent(keyword)}`);
    };

    return (
        <header className="header-container">
            <div className="header-content">

                {/* 1. 왼쪽: 로고 */}
                <div className="header-left">
                    <Link to="/" className="logo">
                        RE:BORN 🎀
                    </Link>
                </div>

                {/* 2. 중앙: 검색바 & 인기 카테고리 */}
                <div className="header-center">
                    <div className="search-bar">
                        <input
                            type="text"
                            placeholder="어떤 상품을 찾으시나요?"
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') handleSearch();
                            }}
                        />
                        <button
                            type="button"
                            className="search-button"
                            onClick={handleSearch}
                        >
                            {/* ⚠️ [수정됨] class -> className 으로 변경 */}
                            <i className="fa-solid fa-magnifying-glass"></i>
                        </button>
                    </div>

                    <div className="keyword-section">
                        <span className="keyword-title">
                            <strong>인기 카테고리</strong>
                        </span>
                        <div className="top-categories">
                            {topKeywords.map((keyword, index) => (
                                <Link
                                    // 카테고리 필터 → category 파라미터 사용
                                    to={`/search?category=${encodeURIComponent(keyword)}`}
                                    key={index}
                                    className="category-item"
                                >
                                    {keyword}
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>

                {/* 3. 오른쪽: 메뉴 버튼 */}
                <div className="header-right">
                    {isLoggedIn ? (
                        <>
                            {/* 로그인 상태 */}
                            <Link to="/chat" className="nav-button">채팅하기</Link>

                            {/* 판매하기: 바로 업로드 페이지로 이동 */}
                            <Link to="/sell" className="nav-button">
                                판매하기
                            </Link>

                            {/* 유저 드롭다운 */}
                            <div className="nav-dropdown">
                                <button
                                    className="nav-button"
                                    onClick={() => setShowUserDropdown(!showUserDropdown)}
                                >
                                    {userName}님
                                </button>
                                {showUserDropdown && (
                                    <div className="dropdown-menu">
                                        {/* 관리자면 /admin, 아니면 /mypage */}
                                        <Link
                                            to={userClass === 1 ? "/admin" : "/mypage"}
                                            className="dropdown-item"
                                            onClick={() => setShowUserDropdown(false)}
                                        >
                                            {userClass === 1 ? "관리자 페이지" : "마이페이지"}
                                        </Link>

                                        <button
                                            onClick={handleLogout}
                                            className="dropdown-item"
                                        >
                                            로그아웃
                                        </button>
                                    </div>
                                )}
                            </div>
                        </>
                    ) : (
                        <>
                            {/* 로그아웃 상태 */}
                            <Link to="/signup" className="nav-button">회원가입</Link>
                            <Link to="/login" className="nav-button">
                                로그인
                            </Link>
                        </>
                    )}
                </div>

            </div>
        </header>
    );
};

export default Header;