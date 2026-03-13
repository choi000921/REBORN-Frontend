// src/pages/mypages/MyPageWishlist.js

import React, { useState, useEffect } from 'react';
import axios from 'axios'; // (추가)
import './MyPageWishlist.css'; 
import SearchProductCard from '../../components/SearchProductCard'; // 2. 검색 카드 재사용
import { Link } from 'react-router-dom';

// (삭제) mockWishlistData 삭제

const MyPageWishlist = () => {
    // (수정) 로딩/에러 상태 추가
    const [wishlistProducts, setWishlistProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const [searchTerm, setSearchTerm] = useState('');
    const [pageSize, setPageSize] = useState(25);

    // 4. (수정) 백엔드 API 호출
    useEffect(() => {
        const fetchMyWishlist = async () => {
            try {
                const token = localStorage.getItem('accessToken');
                if (!token) {
                    window.location.href = '/login';
                    return;
                }
                
                // (핵심) /api/users/me/wishlist API 호출
                const response = await axios.get('http://localhost:8080/api/users/me/wishlist', {
                    headers: { 'Authorization': `Bearer ${token}` }
                    // (추후) params: { q: searchTerm, limit: pageSize }
                });
                
                setWishlistProducts(response.data); // (수정) state에 실제 데이터 저장

            } catch (err) {
                console.error("찜 목록 로딩 실패:", err);
                setError(err.message);
                if (err.response && (err.response.status === 401 || err.response.status === 403)) {
                    alert('로그인 세션이 만료되었습니다. 다시 로그인해주세요.');
                    window.location.href = '/login';
                }
            } finally {
                setIsLoading(false);
            }
        };

        fetchMyWishlist();
    }, []); // (참고) 우선은 1회만 로딩, 추후 [searchTerm, pageSize] 추가

    // --- (로딩 및 에러 처리) ---
    if (isLoading) {
        return <div className="mypage-loading">로딩 중...</div>;
    }
    if (error) {
        return <div className="mypage-error">오류: {error}</div>;
    }

    return (
        <div className="mypage-wishlist-container">
            <h1 className="mypage-title">찜 한 제품 🎀</h1>

            {/* 1. 검색 및 필터 바 */}
            <div className="wishlist-filter-bar">
                <input 
                    type="text" 
                    placeholder="제품명으로 검색" 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="wishlist-search-input"
                />
                <div className="wishlist-controls">
                    
                    {/* --- (이 부분을 수정) --- */}
                    {/* (삭제) 25개씩 보기 select 
                    <select 
                        value={pageSize} 
                        onChange={(e) => setPageSize(Number(e.target.value))}
                        className="wishlist-page-size"
                    >
                        <option value={25}>25개씩 보기</option>
                        <option value={50}>50개씩 보기</option>
                        <option value={100}>100개씩 보기</option>
                    </select>
                    */}
                    
                    {/* (추가) AI 비교하기 링크 */}
                    <Link to="/mypage/RibbonsCompare" className="ai-compare-btn">
                        AI 비교하기
                    </Link>
                    {/* --- (여기까지) --- */}

                    <button onClick={() => window.location.reload()} className="refresh-btn">
                        새로고침
                    </button>
                </div>
            </div>

            {/* 2. 제품 목록 그리드 (5열) */}
            <div className="wishlist-product-grid">
                {/* (중요) DTO의 필드명(imageUrl1)을 Card가 기대하는 prop(imageUrl)으로 변경 */}
                {wishlistProducts.map(product => (
                    <SearchProductCard 
                        key={product.productId} 
                        product={{
                            id: product.productId,
                            name: product.productName,
                            price: product.price,
                            imageUrl: product.imageUrl1, // 👈 (수정) DTO의 imageUrl1을 imageUrl로 전달
                            postedDate: product.postedDate,
                            views: product.views,
                            ribbons: product.ribbons
                        }} 
                    />
                ))}
            </div>
            
            {wishlistProducts.length === 0 && (
                <div className="no-results">찜 한 상품이 없습니다.</div>
            )}
        </div>
    );
};

export default MyPageWishlist;