// src/pages/mypages/MyPageRibbonsCompare.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './MyPageRibbonsCompare.css'; 
import SearchProductCard from '../../components/SearchProductCard'; 
import { Link } from 'react-router-dom';

// ... (EmptySlot, ProductSlot 컴포넌트) ...
const EmptySlot = ({ text }) => (
    <div className="compare-slot empty"><span>{text}</span></div>
);
const ProductSlot = ({ product, onClear }) => (
    <div className="compare-slot filled">
        <img src={product.imageUrl1 || '/productDefault.png'} alt={product.productName} />
        <div className="slot-info">
            <h4>{product.productName}</h4>
            <p>{product.price.toLocaleString()}원</p>
        </div>
        <button onClick={onClear} className="clear-slot-btn">다른 제품 선택</button>
    </div>
);


const MyPageRibbonsCompare = () => {
    // 1. 상태 관리
    const [wishlist, setWishlist] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // (수정) aiComment (String) -> aiResult (Object)
    const [aiResult, setAiResult] = useState(null); 

    const [slot1, setSlot1] = useState(null); 
    const [slot2, setSlot2] = useState(null); 
    const [memo1, setMemo1] = useState('');
    const [memo2, setMemo2] = useState('');

    // 2. 찜 목록 데이터 로딩 (기존과 동일)
    useEffect(() => {
        const fetchMyWishlist = async () => {
            try {
                const token = localStorage.getItem('accessToken');
                if (!token) { window.location.href = '/login'; return; }
                
                const response = await axios.get('http://localhost:8080/api/users/me/wishlist', {
                    headers: { 'Authorization': `Bearer ${token}` },
                    params: { q: searchTerm } 
                });
                setWishlist(response.data);
            } catch (err) {
                console.error("찜 목록 로딩 실패:", err);
            }
        };
        fetchMyWishlist();
    }, [searchTerm]); 

    // ... (handleProductClick, clearSlot 함수는 기존과 동일) ...
    const handleProductClick = (product) => {
        if (!slot1) { setSlot1(product); }
        else if (!slot2) { setSlot2(product); }
        else { alert('비교 슬롯 2개가 모두 찼습니다.'); }
    };
    const clearSlot = (slotNumber) => {
        if (slotNumber === 1) { setSlot1(null); setMemo1(''); }
        else { setSlot2(null); setMemo2(''); }
    };

    // 5. (수정) 초기화
    const handleReset = () => {
        setMemo1('');
        setMemo2('');
        setAiResult(null); // (수정) aiResult를 null로
    };

    // 6. (수정) "추천 받기" (AI 호출)
    const handleGetRecommendation = async () => {
        if (!slot1 || !slot2) {
            alert('비교할 제품 2개를 모두 선택해주세요.');
            return;
        }
        setIsLoading(true);
        setAiResult(null); // (수정) AI 결과 초기화

        try {
            const token = localStorage.getItem('accessToken');
            // (수정) 백엔드가 새 DTO를 반환
            const response = await axios.post('http://localhost:8080/api/ai/compare', 
                {
                    productId1: slot1.productId,
                    productId2: slot2.productId,
                    memo1: memo1,
                    memo2: memo2
                },
                { headers: { 'Authorization': `Bearer ${token}` } }
            );
            
            setAiResult(response.data); // (수정) AI 응답 (JSON 객체)을 통째로 저장

        } catch (error) {
            console.error("AI 비교 실패:", error);
            setAiResult({ // (수정) 오류 시에도 DTO 객체 형식
                scoreA: 0, scoreB: 0,
                recommendation: "error",
                reason: "AI 추천을 생성하는 중 오류가 발생했습니다.",
                prosA: "-", consA: "-", prosB: "-", consB: "-"
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="mypage-compare-container">
            <h1 className="mypage-title">찜 한 제품 AI 비교 🎀</h1>

            {/* 1. 비교 섹션 (기존과 동일) */}
            <div className="compare-section">
                <div className="compare-slots-wrapper">
                    <div className="compare-column">
                        {slot1 ? <ProductSlot product={slot1} onClear={() => clearSlot(1)} /> : <EmptySlot text="제품 1 (아래 목록에서 선택)" />}
                        <textarea className="memo-input" placeholder="제품 1에 대한 메모 (e.g., '이건 꼭 필요함')"
                            value={memo1} onChange={(e) => setMemo1(e.target.value)} name="memo1" />
                    </div>
                    <div className="vs-divider">VS</div>
                    <div className="compare-column">
                        {slot2 ? <ProductSlot product={slot2} onClear={() => clearSlot(2)} /> : <EmptySlot text="제품 2 (아래 목록에서 선택)" />}
                        <textarea className="memo-input" placeholder="제품 2에 대한 메모 (e.g., '이건 좀 비쌈')"
                            value={memo2} onChange={(e) => setMemo2(e.target.value)} name="memo2" />
                    </div>
                </div>

                {/* --- (3. (핵심 수정) AI 코멘트 -> AI 비교표 + 점수판) --- */}
                <div className="compare-column ai-column">
                    <div className="ai-comment-box">
                        {/* 1. 로딩 중 */}
                        {isLoading && "AI가 비교 중입니다..."}

                        {/* 2. AI 응답 (결과)이 있을 때 */}
                        {aiResult && !isLoading && (
                            <div className="ai-result-wrapper">
                                
                                {/* A. (추가) 점수판 */}
                                <div className="ai-score-board">
                                    <div className="score-box">
                                        <span>{slot1.productName}</span>
                                        <strong>{aiResult.scoreA}점</strong>
                                    </div>
                                    <div className="score-vs">VS</div>
                                    <div className="score-box">
                                        <span>{slot2.productName}</span>
                                        <strong>{aiResult.scoreB}점</strong>
                                    </div>
                                </div>
                                
                                {/* B. 최종 추천 */}
                                <div className="ai-recommendation">
                                    <strong>AI 최종 추천: {aiResult.recommendation === 'productA' ? slot1.productName : slot2.productName} 👑</strong>
                                </div>
                                {/* C. 추천 사유 */}
                                <p className="ai-reason">{aiResult.reason}</p>
                                
                                {/* D. 비교표 (테이블) */}
                                <table className="compare-table">
                                    <thead>
                                        <tr>
                                            <th>{slot1.productName}</th>
                                            <th>{slot2.productName}</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td className="pros">👍 {aiResult.prosA}</td>
                                            <td className="pros">👍 {aiResult.prosB}</td>
                                        </tr>
                                        <tr>
                                            <td className="cons">👎 {aiResult.consA}</td>
                                            <td className="cons">👎 {aiResult.consB}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        )}
                        
                        {/* 3. AI 응답이 없을 때 (초기 상태) */}
                        {!aiResult && !isLoading && "두 제품과 메모를 바탕으로 AI가 추천 코멘트를 생성합니다."}
                    </div>
                    
                    {/* (버튼은 기존과 동일) */}
                    <div className="ai-buttons">
                        <button onClick={handleGetRecommendation} className="ai-submit-btn" disabled={isLoading}>
                            {isLoading ? '분석 중...' : '추천 받기'}
                        </button>
                        <button onClick={handleReset} className="ai-reset-btn" disabled={isLoading}>초기화</button>
                    </div>
                </div>
            </div>

            <hr className="divider" />

            {/* 2. 제품 목록 (찜 목록) ... (이하 동일) ... */}
            <div className="compare-product-list">
                {/* ... (filter bar) ... */}
                <div className="wishlist-product-grid">
                    {wishlist.map(product => (
                        <div 
                            key={product.productId} 
                            onClick={(e) => { e.preventDefault(); handleProductClick(product); }} 
                            className="product-card-wrapper"
                        >
                            <SearchProductCard 
                                isComparePage={true} 
                                product={{
                                    id: product.productId,
                                    name: product.productName,
                                    price: product.price,
                                    imageUrl: product.imageUrl1 || '/productDefault.png',
                                    postedDate: product.postedDate,
                                    views: product.views,
                                    ribbons: product.ribbons
                                }} 
                            />
                        </div>
                    ))}
                </div>
                {/* ... */}
            </div>
        </div>
    );
};

export default MyPageRibbonsCompare;