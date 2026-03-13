// src/pages/admin/AdminPageMain.js

import React, { useState } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import './AdminPageMain.css';
import AdminUserList from './AdminUserList'; 
import AdminProductList from './AdminProductList'; 
import axios from 'axios'; // (1. axios import)

// (기획안) 2. 탭에 따라 달라질 Select 옵션 정의
const searchOptions = {
  user: [
    { value: 'userId', label: '유저 ID' },
    { value: 'userName', label: '유저 이름' },
    { value: 'userNickname', label: '닉네임' },
    { value: 'userPhone', label: '전화번호' },
    { value: 'userEmail', label: '이메일' },
    { value: 'userWarning', label: '경고 횟수' },
  ],
  product: [
    { value: 'productId', label: '제품 ID' },
    { value: 'productName', label: '제품명' },
    { value: 'sellerId', label: '판매자 ID' },
    { value: 'category', label: '카테고리' },
    { value: 'status', label: '거래 상태' },
  ],
};

const AdminPageMain = () => {
    // 3. 상태 관리
    const [currentTab, setCurrentTab] = useState('user'); 
    const [currentFilter, setCurrentFilter] = useState(searchOptions.user[0].value);
    const [searchTerm, setSearchTerm] = useState('');
    
    // (수정) 4. 로딩 및 검색 결과 state
    const [isLoading, setIsLoading] = useState(false);
    const [searchResults, setSearchResults] = useState(null); // null: 검색 전, []: 검색 결과 없음

    const handleTabChange = (tab) => {
        setCurrentTab(tab);
        setCurrentFilter(searchOptions[tab][0].value);
        setSearchResults(null); // 탭 변경 시 결과 초기화
    };

    // (수정) 5. "검색" 버튼 API 연동
    const handleSearch = async () => {
        if (!searchTerm) {
            alert('검색어를 입력해주세요.');
            return;
        }

        setIsLoading(true);
        setSearchResults(null); // 이전 검색 결과 초기화

        try {
            const token = localStorage.getItem('accessToken');
            
            // (핵심) 백엔드 /api/admin/search API 호출
            const response = await axios.get('http://localhost:8080/api/admin/search', {
                headers: { 'Authorization': `Bearer ${token}` },
                params: {
                    type: currentTab,
                    filter: currentFilter,
                    term: searchTerm
                }
            });

            setSearchResults(response.data); // "진짜" 데이터 저장

        } catch (err) {
            console.error("검색 실패:", err);
            alert("검색 중 오류가 발생했습니다.");
            if (err.response && (err.response.status === 401 || err.response.status === 403)) {
                window.location.href = '/login'; // 토큰 만료 시
            }
            setSearchResults([]); // 오류 시 빈 배열
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="admin-page-container">
            <Header />
            <div className="admin-content-wrapper">
                <h1>관리자 페이지</h1>

                {/* 1. 탭 (유저 / 제품) (기존과 동일) */}
                <div className="admin-tabs">
                    <button
                        className={`admin-tab ${currentTab === 'user' ? 'active' : ''}`}
                        onClick={() => handleTabChange('user')}
                    >
                        유저
                    </button>
                    <button
                        className={`admin-tab ${currentTab === 'product' ? 'active' : ''}`}
                        onClick={() => handleTabChange('product')}
                    >
                        제품
                    </button>
                </div>

                {/* 2. 검색 바 (기존과 동일) */}
                <div className="admin-search-bar">
                    <select
                        className="admin-search-select"
                        value={currentFilter}
                        onChange={(e) => setCurrentFilter(e.target.value)}
                    >
                        {searchOptions[currentTab].map(option => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                    <input
                        type="text"
                        className="admin-search-input"
                        placeholder="선택한 필드에 해당하는 값을 입력하세요"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <button onClick={handleSearch} className="admin-search-button" disabled={isLoading}>
                        {isLoading ? '검색 중...' : '검색'}
                    </button>
                </div>

                {/* 3. (수정) 검색 결과 영역 */}
                <div className="admin-results-area">
                    {/* (수정) searchResults가 null이면 (검색 전) 초기 메시지 표시 */}
                    {searchResults === null ? (
                        <>
                            <p>
                                현재 선택: <strong>{currentTab === 'user' ? '유저' : '제품'}</strong> (
                                {searchOptions[currentTab].find(opt => opt.value === currentFilter).label}
                                )
                            </p>
                            <p>(검색 결과가 여기에 표시됩니다)</p>
                        </>
                    ) : (
                        // (수정) searchResults를 props로 전달
                        currentTab === 'user' ? 
                            <AdminUserList searchResults={searchResults} /> : 
                            <AdminProductList searchResults={searchResults} />
                    )}
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default AdminPageMain;