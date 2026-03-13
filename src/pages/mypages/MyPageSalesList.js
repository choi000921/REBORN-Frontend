// src/pages/mypages/MyPageSalesList.js

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios'; // 1. (추가) axios import
import './MyPageSalesList.css';

// 2. (삭제) mockSalesData 배열 삭제

// (유지) ProductStatus Enum (엔티티와 동일하게)
const getStatusKorean = (status) => {
    if (status === 'RESERVED') return '예약 중';
    if (status === 'SOLD_OUT') return '판매 완료';
    return '판매 중';
};

const MyPageSalesList = () => {
    // 3. (수정) 로딩/에러 상태 추가
    const [salesList, setSalesList] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // (참고) 필터 상태는 나중을 위해 남겨둠
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState({
        FOR_SALE: true,
        RESERVED: true,
        SOLD_OUT: true
    });
    const [sortOrder, setSortOrder] = useState('latest'); 

    // 4. (수정) 백엔드 API 호출
    useEffect(() => {
        const fetchMySales = async () => {
            try {
                const token = localStorage.getItem('accessToken');
                if (!token) {
                    window.location.href = '/login'; // 토큰 없으면 로그인으로
                    return;
                }
                
                // (핵심) /api/products/my-sales API 호출
                const response = await axios.get('http://localhost:8080/api/products/my-sales', {
                    headers: { 'Authorization': `Bearer ${token}` }
                    // (추후) params: { q: searchTerm, status: ..., sort: sortOrder }
                });
                
                setSalesList(response.data); // (수정) state에 실제 데이터 저장

            } catch (err) {
                console.error("판매 내역 로딩 실패:", err);
                setError(err.message);
                if (err.response && (err.response.status === 401 || err.response.status === 403)) {
                    alert('로그인 세션이 만료되었습니다. 다시 로그인해주세요.');
                    window.location.href = '/login';
                }
            } finally {
                setIsLoading(false);
            }
        };

        fetchMySales();
    }, []); // (참고) 우선은 페이지 로드 시 1회만 실행

    // --- (5. 로딩 및 에러 처리) ---
    if (isLoading) {
        return <div className="mypage-loading">로딩 중...</div>;
    }
    if (error) {
        return <div className="mypage-error">오류: {error}</div>;
    }

    // (기존 handleFilterChange는 그대로 둠)
    const handleFilterChange = (e) => {
        const { name, checked } = e.target;
        setStatusFilter(prev => ({ ...prev, [name]: checked }));
    };

    return (
        <div className="mypage-sales-container">
            <h1 className="mypage-title">판매내역</h1>

            {/* 1. 필터 및 검색 바 (기존과 동일) */}
            <div className="sales-filter-bar">
                <input 
                    type="text" 
                    placeholder="제품명으로 검색" 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="sales-search-input"
                />
                <div className="sales-checkboxes">
                    <label><input type="checkbox" name="FOR_SALE" checked={statusFilter.FOR_SALE} onChange={handleFilterChange} /> 판매 중</label>
                    <label><input type="checkbox" name="RESERVED" checked={statusFilter.RESERVED} onChange={handleFilterChange} /> 예약 중</label>
                    <label><input type="checkbox" name="SOLD_OUT" checked={statusFilter.SOLD_OUT} onChange={handleFilterChange} /> 판매 완료</label>
                </div>
                {/* ( ... 정렬 버튼 ... ) */}
            </div>

            {/* 2. 판매 목록 테이블 (데이터만 진짜로 변경) */}
            <table className="sales-table">
                <thead>
                    <tr>
                        <th>제품명</th>
                        <th>제품 등록일</th>
                        <th>거래 상태</th>
                        <th>조회</th>
                        <th>찜</th>
                        <th>관리</th>
                    </tr>
                </thead>
                <tbody>
                    {/* (중요) salesList가 비어있을 경우 처리 */}
                    {salesList.length === 0 ? (
                        <tr>
                            <td colSpan="6" className="no-results">판매한 상품이 없습니다.</td>
                        </tr>
                    ) : (
                        salesList.map(product => (
                            <tr key={product.productId}>
                                <td>{product.productName}</td>
                                {/* (수정) 날짜 형식을 'YYYY.MM.DD'로 변경 */}
                                <td>{new Date(product.postedDate).toLocaleDateString()}</td>
                                <td>{getStatusKorean(product.status)}</td>
                                <td>{product.views}</td>
                                <td>{product.ribbons}</td>
                                <td>
                                    <Link 
                                        to={`/mypage/sales/${product.productId}`} 
                                        className="detail-link-btn"
                                    >
                                        상세보기
                                    </Link>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default MyPageSalesList;