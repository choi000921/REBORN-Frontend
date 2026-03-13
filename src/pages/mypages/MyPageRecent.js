// src/pages/mypages/MyPageRecent.js

import React, { useState, useEffect } from 'react';
import axios from 'axios'; 
import './MyPageRecent.css'; 
import SearchProductCard from '../../components/SearchProductCard'; 

// (수정) "최근 본 상품" 데이터 로딩 함수를 분리
const fetchMyRecentViews = async (token, searchTerm) => {
    try {
        const response = await axios.get('http://localhost:8080/api/users/me/recent-views', {
            headers: { 'Authorization': `Bearer ${token}` },
            params: { q: searchTerm } // 검색 기능 연동
        });
        return response.data;
    } catch (err) {
        console.error("최근 본 상품 로딩 실패:", err);
        if (err.response && (err.response.status === 401 || err.response.status === 403)) {
            alert('로그인 세션이 만료되었습니다. 다시 로그인해주세요.');
            window.location.href = '/login';
        }
        throw err; // 에러를 다시 던져서 상위에서 처리
    }
};


const MyPageRecent = () => {
    const [recentProducts, setRecentProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    // (수정) 데이터 로딩
    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        if (!token) {
            window.location.href = '/login';
            return;
        }
        
        setIsLoading(true);
        fetchMyRecentViews(token, searchTerm)
            .then(data => {
                setRecentProducts(data);
            })
            .catch(err => {
                setError(err.message);
            })
            .finally(() => {
                setIsLoading(false);
            });
    // (수정) searchTerm이 바뀔 때마다 API 다시 호출
    }, [searchTerm]); 

    // --- (이 2개 핸들러를 새로 추가) ---

    /**
     * (기획안) "전체 삭제" 버튼 핸들러
     * (DB의 /api/users/me/recent-views API를 호출)
     */
    const handleDeleteAll = async () => {
        if (window.confirm("최근 본 상품 목록을 모두 삭제하시겠습니까? (DB에서 영구 삭제됩니다)")) {
            try {
                const token = localStorage.getItem('accessToken');
                await axios.delete('http://localhost:8080/api/users/me/recent-views', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                setRecentProducts([]); // (성공) 프론트엔드 상태를 비움
                alert('목록이 모두 삭제되었습니다.');
            } catch (err) {
                console.error("전체 삭제 실패:", err);
                alert("삭제 중 오류가 발생했습니다.");
            }
        }
    };

    
    // --- (로딩 및 에러 처리) ---
    if (isLoading) {
        return <div className="mypage-loading">로딩 중...</div>;
    }
    if (error) {
        return <div className="mypage-error">오류: {error}</div>;
    }

    return (
        <div className="mypage-recent-container">
            <h1 className="mypage-title">최근 본 제품</h1>

            {/* 1. (수정) "전체 삭제" 버튼 추가 */}
            <div className="recent-filter-bar">
                <input 
                    type="text" 
                    placeholder="제품명으로 검색" 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="recent-search-input"
                />
                <div> {/* (추가) 버튼 그룹 */}
                    <button onClick={handleDeleteAll} className="refresh-btn delete-all-btn">
                        전체 삭제
                    </button>
                    <button onClick={() => window.location.reload()} className="refresh-btn">
                        새로고침
                    </button>
                </div>
            </div>

            {/* 2. (수정) onDelete prop 전달 */}
            <div className="recent-product-grid">
                {recentProducts.map(product => (
                    <SearchProductCard 
                        key={product.productId} 
                        product={{
                            id: product.productId,
                            name: product.productName,
                            price: product.price,
                            imageUrl: product.imageUrl1,
                            postedDate: product.postedDate,
                            views: product.views,
                            ribbons: product.ribbons
                        }} 
                    />
                ))}
            </div>

            {recentProducts.length === 0 && (
                <div className="no-results">최근 본 상품이 없습니다.</div>
            )}
        </div>
    );
};

export default MyPageRecent;