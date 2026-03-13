// src/pages/mypages/MyPageSalesDetail.js

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './MyPageSalesDetail.css'; // 1. 상세페이지 전용 CSS

// (임시) 2. 백엔드 API 대신 사용할 Mock Data
// (참고) Product.java 엔티티와 1:1 매칭되는 상세 데이터
const mockProductDetail = {
    productId: 101,
    productName: "RE:BORN AI로 등록한 상품 1",
    productDescription: "AI가 자동으로 생성한 상품 설명입니다.\n상태는 A급이며, 스크래치가 거의 없습니다.\n풀박스 구성입니다.",
    price: 35000,
    category: "디지털기기",
    views: 150,
    ribbons: 12, // (참고) 실제로는 product.getRibbons().size()
    status: "FOR_SALE",
    productImage1: "/productDefault.png",
    productImage2: "https://via.placeholder.com/300/E81115/FFFFFF?text=Image+2",
    productImage3: null,
    productLocation1: "경기도",
    productLocation2: "수원시",
    productLocation3: "영통구",
    productLocation4: "서울특별시",
    productLocation5: "강남구",
    productLocation6: "역삼동",
    productLocation7: null,
    productLocation8: null,
    productLocation9: null
};

const getStatusKorean = (status) => {
    if (status === 'RESERVED') return '예약 중';
    if (status === 'SOLD_OUT') return '판매 완료';
    return '판매 중';
};

const MyPageSalesDetail = () => {
    const { productId } = useParams(); // URL에서 productId (e.g., 101) 가져오기
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);

    // 3. (임시) 데이터 로딩
    useEffect(() => {
        // (추후) axios.get(`/api/products/my-sales/${productId}`)
        // 지금은 mock 데이터에서 productId와 일치하는 것을 찾음
        setProduct(mockProductDetail); 
    }, [productId]);

    // 4. (임시) "삭제하기" 핸들러
    const handleDelete = () => {
        if (window.confirm("정말로 이 상품을 삭제하시겠습니까?")) {
            // (추후) axios.delete(`/api/products/${productId}`)
            alert(`${product.productName} 상품이 삭제되었습니다.`);
            navigate('/mypage/sales'); // 목록으로 복귀
        }
    };

    if (!product) {
        return <div>상품 정보를 불러오는 중...</div>;
    }

    return (
        <div className="mypage-sales-detail-container">
            <h1 className="mypage-title">판매 상품 상세 정보</h1>
            
            <div className="detail-grid">
                
                {/* 1. 제품명 */}
                <div className="detail-item label">제품명</div>
                <div className="detail-item value">{product.productName}</div>

                {/* 2. 제품 설명 */}
                <div className="detail-item label">제품 설명</div>
                <div className="detail-item value description">{product.productDescription}</div>

                {/* 3. 가격 */}
                <div className="detail-item label">가격</div>
                <div className="detail-item value">{product.price.toLocaleString()}원</div>
                
                {/* 4. 카테고리 */}
                <div className="detail-item label">카테고리</div>
                <div className="detail-item value">{product.category}</div>

                {/* 5. 조회/찜/상태 */}
                <div className="detail-item label">조회 수</div>
                <div className="detail-item value">{product.views}</div>
                
                <div className="detail-item label">찜 수</div>
                <div className="detail-item value">{product.ribbons}</div>
                
                <div className="detail-item label">거래 상태</div>
                <div className="detail-item value">{getStatusKorean(product.status)}</div>

                {/* 6. 이미지 */}
                <div className="detail-item label">이미지</div>
                <div className="detail-item value image-gallery">
                    {product.productImage1 && <img src={product.productImage1} alt="img 1"/>}
                    {product.productImage2 && <img src={product.productImage2} alt="img 2"/>}
                    {product.productImage3 && <img src={product.productImage3} alt="img 3"/>}
                </div>

                {/* 7. 위치 */}
                <div className="detail-item label">판매 지역 1</div>
                <div className="detail-item value location-box">
                    <span>{product.productLocation1 || '-'}</span>
                    <span>{product.productLocation2 || '-'}</span>
                    <span>{product.productLocation3 || '-'}</span>
                </div>
                
                <div className="detail-item label">판매 지역 2</div>
                <div className="detail-item value location-box">
                    <span>{product.productLocation4 || '-'}</span>
                    <span>{product.productLocation5 || '-'}</span>
                    <span>{product.productLocation6 || '-'}</span>
                </div>

                <div className="detail-item label">판매 지역 3</div>
                <div className="detail-item value location-box">
                    <span>{product.productLocation7 || '-'}</span>
                    <span>{product.productLocation8 || '-'}</span>
                    <span>{product.productLocation9 || '-'}</span>
                </div>

            </div>

            {/* 8. 삭제 버튼 */}
            <div className="detail-actions">
                <button onClick={handleDelete} className="delete-button">
                    삭제하기
                </button>
            </div>
        </div>
    );
};

export default MyPageSalesDetail;