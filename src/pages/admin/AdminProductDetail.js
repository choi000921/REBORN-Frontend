// src/pages/admin/AdminProductDetail.js

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios'; // (1. axios import 추가)
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import './AdminProductDetail.css'; 

// (2. 삭제) mockProductDetail 삭제

// (유지) 3. Mock Data (필터용) - (이것도 추후 API로 대체 가능)
const ALL_STATUSES = ["FOR_SALE", "RESERVED", "SOLD_OUT"];
const ALL_CATEGORIES = ["디지털기기", "생활가전", "게임/취미", "가구/인테리어", "유아동", "스포츠/레저", "여성의류", "남성의류", "도서/티켓/음반", "기타 중고물품", "OTHERS"];

const AdminProductDetail = () => {
    const { productId } = useParams(); // URL에서 productId (e.g., 1) 가져오기
    const navigate = useNavigate();

    // (4. 수정) 로딩/에러 및 상세 데이터(DTO) 상태
    const [product, setProduct] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // (기획안) 수정 가능한 필드
    const [editableStatus, setEditableStatus] = useState('');
    const [editableCategory, setEditableCategory] = useState('');

    // (5. 수정) 백엔드 API 호출
    useEffect(() => {
        const fetchProductDetail = async () => {
            try {
                const token = localStorage.getItem('accessToken');
                if (!token) {
                    window.location.href = '/login';
                    return;
                }
                
                // (핵심) /api/admin/product/{productId} API 호출
                const response = await axios.get(`http://localhost:8080/api/admin/product/${productId}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                
                setProduct(response.data); // (수정) state에 DTO 객체 저장
                // (수정) DTO 값으로 Select/Input state 초기화
                setEditableStatus(response.data.status);
                setEditableCategory(response.data.category);

            } catch (err) {
                console.error("제품 상세 정보 로딩 실패:", err);
                setError(err.message);
                if (err.response && (err.response.status === 401 || err.response.status === 403)) {
                    alert('로그인 세션이 만료되었습니다. 다시 로그인해주세요.');
                    window.location.href = '/login';
                }
            } finally {
                setIsLoading(false);
            }
        };

        fetchProductDetail();
    }, [productId]); // productId가 변경될 때마다 API 다시 호출

    // 6. (기획안) "저장" 핸들러 (임시)
    const handleSave = () => {
        // (추후) axios.put(`/api/admin/product/${productId}`, { 
        //    status: editableStatus, 
        //    category: editableCategory 
        // })
        alert(`(임시) 상품 ${productId}의 상태가 ${editableStatus}(으)로, 카테고리가 ${editableCategory}(으)로 변경되었습니다.`);
    };

    // 7. (기획안) "제품 삭제" 핸들러 (임시)
    const handleDelete = () => {
        if (window.confirm(`[${product.productName}] 상품을 정말 삭제하시겠습니까?`)) {
            // (추후) axios.delete(`/api/admin/product/${productId}`)
            alert(`(임시) 상품 ${productId}가 삭제되었습니다.`);
            navigate('/admin'); // 관리자 메인으로 복귀
        }
    };


    // --- (로딩 및 에러 처리) ---
    if (isLoading) {
        return <div className="admin-page-container"><div className="admin-content-wrapper"><h1>로딩 중...</h1></div></div>;
    }
    if (error || !product) {
        return <div className="admin-page-container"><div className="admin-content-wrapper"><h1 style={{ color: 'red' }}>오류: {error || '상품 정보를 불러올 수 없습니다.'}</h1></div></div>;
    }

    // (수정) 8. product (DTO)에서 데이터 추출
    return (
        <div className="admin-page-container">
            <Header />
            <div className="admin-content-wrapper">
                <h1 className="admin-detail-title">제품 - 상세보기</h1>

                {/* 1. 제품 기본 정보 (4열) */}
                <div className="admin-detail-grid product-info">
                    <div className="detail-item label">제품 ID</div>
                    <div className="detail-item value">{product.productId}</div>
                    
                    <div className="detail-item label">판매자 ID</div>
                    <div className="detail-item value">{product.sellerId}</div>
                    
                    <div className="detail-item label">제품명</div>
                    <div className="detail-item value">{product.productName}</div>
                    
                    <div className="detail-item label">거래 상태</div>
                    <div className="detail-item value">{product.status}</div>
                </div>

                {/* 2. 제품 설명 */}
                <h2 className="admin-detail-subtitle">제품 설명</h2>
                <div className="admin-detail-box description">
                    {product.productDescription}
                </div>

                {/* 3. 제품 상세 정보 (4열) */}
                <h2 className="admin-detail-subtitle">상세 정보</h2>
                <div className="admin-detail-grid product-info">
                    <div className="detail-item label">카테고리</div>
                    <div className="detail-item value">{product.category}</div>

                    <div className="detail-item label">가격</div>
                    <div className="detail-item value">{product.price.toLocaleString()}원</div>
                    
                    <div className="detail-item label">등록일</div>
                    <div className="detail-item value">{new Date(product.postedDate).toLocaleString()}</div>

                    <div className="detail-item label">조회 / 찜</div>
                    <div className="detail-item value">
                        {product.views}회 / 🎀 {product.ribbons}개
                    </div>
                </div>
                
                {/* 4. 위치 정보 (3열) */}
                <h2 className="admin-detail-subtitle">판매 지역</h2>
                <div className="admin-detail-grid product-location">
                    <div className="detail-item value">{product.productLocationA || "-"}</div>
                    <div className="detail-item value">{product.productLocationB || "-"}</div>
                    <div className="detail-item value">{product.productLocationC || "-"}</div>
                </div>

                {/* 5. 이미지 (3열) */}
                <h2 className="admin-detail-subtitle">상품 이미지</h2>
                <div className="admin-detail-grid product-images">
                    <div className="image-box">
                        {product.productImage1 ? <img src={product.productImage1} alt="img 1"/> : <span>Image 1 없음</span>}
                    </div>
                    <div className="image-box">
                        {product.productImage2 ? <img src={product.productImage2} alt="img 2"/> : <span>Image 2 없음</span>}
                    </div>
                    <div className="image-box">
                        {product.productImage3 ? <img src={product.productImage3} alt="img 3"/> : <span>Image 3 없음</span>}
                    </div>
                </div>
                
                {/* 6. 관리자 수정/삭제 */}
                <h2 className="admin-detail-subtitle">상품 관리</h2>
                <div className="admin-actions-bar">
                    {/* 상태 변경 */}
                    <div className="action-group">
                        <label>제품 상태 변경</label>
                        <select value={editableStatus} onChange={(e) => setEditableStatus(e.target.value)}>
                            {ALL_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                    </div>
                    
                    {/* 카테고리 변경 */}
                    <div className="action-group">
                        <label>카테고리 변경</label>
                        <select value={editableCategory} onChange={(e) => setEditableCategory(e.target.value)}>
                            {ALL_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>
                    
                    {/* 저장 버튼 */}
                    <button onClick={handleSave} className="action-btn save-btn">
                        저장
                    </button>

                    {/* 삭제 버튼 (오른쪽 정렬) */}
                    <button onClick={handleDelete} className="action-btn delete-btn">
                        제품 삭제
                    </button>
                </div>

            </div>
            <Footer />
        </div>
    );
};

export default AdminProductDetail;