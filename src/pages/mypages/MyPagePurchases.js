// src/pages/mypages/MyPagePurchases.js

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios'; // 1. (추가) axios import
import './MyPagePurchases.css'; 

// 2. (삭제) mockPurchaseData 배열 삭제

const MyPagePurchases = () => {
    // 3. (수정) 로딩/에러 상태 추가
    const [purchaseList, setPurchaseList] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const [searchTerm, setSearchTerm] = useState('');

    // 4. (수정) 백엔드 API 호출
    useEffect(() => {
        const fetchMyPurchases = async () => {
            try {
                const token = localStorage.getItem('accessToken');
                if (!token) {
                    window.location.href = '/login'; // 토큰 없으면 로그인으로
                    return;
                }
                
                // (핵심) /api/products/my-purchases API 호출
                const response = await axios.get('http://localhost:8080/api/products/my-purchases', {
                    headers: { 'Authorization': `Bearer ${token}` }
                    // (추후) params: { q: searchTerm }
                });
                
                setPurchaseList(response.data); // (수정) state에 실제 데이터 저장

            } catch (err) {
                console.error("구매 내역 로딩 실패:", err);
                setError(err.message);
                if (err.response && (err.response.status === 401 || err.response.status === 403)) {
                    alert('로그인 세션이 만료되었습니다. 다시 로그인해주세요.');
                    window.location.href = '/login';
                }
            } finally {
                setIsLoading(false);
            }
        };

        fetchMyPurchases();
    }, []); // (참고) 우선은 페이지 로드 시 1회만 실행 (추후 searchTerm으로 재검색)

    // --- (5. 로딩 및 에러 처리) ---
    if (isLoading) {
        return <div className="mypage-loading">로딩 중...</div>;
    }
    if (error) {
        return <div className="mypage-error">오류: {error}</div>;
    }

    return (
        <div className="mypage-purchase-container">
            <h1 className="mypage-title">구매내역</h1>

            {/* 1. 검색 및 새로고침 바 (기존과 동일) */}
            <div className="purchase-filter-bar">
                <input 
                    type="text" 
                    placeholder="제품명으로 검색" 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="purchase-search-input"
                />
                <button onClick={() => window.location.reload()} className="refresh-btn">
                    새로고침
                </button>
            </div>

            {/* 2. 구매 목록 테이블 (데이터만 진짜로 변경) */}
            <table className="purchase-table">
                <thead>
                    <tr>
                        <th>제품명</th>
                        <th>가격</th>
                        <th>상세보기</th>
                    </tr>
                </thead>
                <tbody>
                    {/* (중요) purchaseList가 비어있을 경우 처리 */}
                    {purchaseList.length === 0 ? (
                        <tr>
                            <td colSpan="3" className="no-results">구매 내역이 없습니다.</td>
                        </tr>
                    ) : (
                        purchaseList.map(product => (
                            <tr key={product.productId}>
                                <td>{product.productName}</td>
                                <td>{product.price.toLocaleString()}원</td>
                                <td>
                                    {/* (핵심) 기획안대로 /product/:id (공용 ProductView)로 연결 */}
                                    <Link 
                                        to={`/product/${product.productId}`} 
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

export default MyPagePurchases;