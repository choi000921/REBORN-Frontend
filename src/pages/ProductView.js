// src/pages/ProductView.js

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import './ProductView.css';

const DEFAULT_IMAGE = '/productDefault.png';

const ProductView = () => {
  // /product/:productId 에서 productId 가져오기
  const { productId } = useParams();

  // 상태
  const [product, setProduct] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLiked, setIsLiked] = useState(false);       // 찜 여부
  const [ribbonCount, setRibbonCount] = useState(0);   // 찜 개수
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 🔥 상세 정보 로딩 + JWT 토큰 포함
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);

        const token = localStorage.getItem('accessToken');

        const headers = {};
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }

        const res = await fetch(
          `http://localhost:8080/api/products/${productId}`,
          { headers }
        );

        if (!res.ok) {
          const text = await res.text();
          console.error('상세 조회 에러:', text);
          throw new Error('상품 정보를 불러오지 못했습니다.');
        }

        const data = await res.json();
        console.log('상품 상세:', data);

        setProduct(data);
        // ⭐ 백엔드에서 내려준 찜 정보 반영
        if (typeof data.liked === 'boolean') {
          setIsLiked(data.liked);
        }
        if (typeof data.ribbons === 'number') {
          setRibbonCount(data.ribbons);
        }
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  // 이미지 배열
  const productImages =
    product && product.images && product.images.length > 0
      ? product.images
      : [DEFAULT_IMAGE];

  const goToPrevious = () => {
    const isFirst = currentImageIndex === 0;
    const newIndex = isFirst
      ? productImages.length - 1
      : currentImageIndex - 1;
    setCurrentImageIndex(newIndex);
  };

  const goToNext = () => {
    const isLast = currentImageIndex === productImages.length - 1;
    const newIndex = isLast ? 0 : currentImageIndex + 1;
    setCurrentImageIndex(newIndex);
  };

  // ⭐ 리본(찜) 토글
  const toggleLike = async () => {
    if (!product) return;

    const token = localStorage.getItem('accessToken'); // 위에서 쓰는 키와 통일
    if (!token) {
      alert('로그인이 필요한 기능입니다.');
      return;
    }

    try {
      const res = await fetch(
        `http://localhost:8080/api/products/${product.id}/ribbon`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({}), // 바디가 없어도 되지만 형태 맞춰줌
        }
      );

      if (!res.ok) {
        const text = await res.text();
        console.error('찜 토글 에러:', text);
        throw new Error('찜 처리 중 오류가 발생했습니다.');
      }

      const data = await res.json();
      console.log('찜 토글 결과:', data);

      setIsLiked(data.liked);
      setRibbonCount(data.ribbons);
    } catch (err) {
      console.error(err);
      alert('찜 처리 중 오류가 발생했습니다.');
    }
  };

  const handleChat = () => {
    // (추후) 채팅방 생성 API 연동 후 navigate로 이동
    alert(`채팅방 생성 시도! (판매자 ID: ${product?.sellerId})`);
  };

  const getStatusClassName = (status) => {
    if (status === '판매 완료') return 'status-sold';
    if (status === '예약 중') return 'status-reserved';
    return 'status-sales'; // 기본: 판매 중
  };

  // 위치 3칸 채우기
  const getLocations = () => {
    const locations = product?.locations || [];
    const displayLocations = [];
    for (let i = 0; i < 3; i++) {
      displayLocations.push(locations[i] || ' - ');
    }
    return displayLocations;
  };

  // ⏳ 로딩 / 에러 처리
  if (loading) {
    return (
      <>
        <Header />
        <div style={{ padding: '40px', textAlign: 'center' }}>
          상품 정보를 불러오는 중입니다...
        </div>
        <Footer />
      </>
    );
  }

  if (error || !product) {
    return (
      <>
        <Header />
        <div style={{ padding: '40px', textAlign: 'center', color: 'red' }}>
          {error || '상품 정보를 찾을 수 없습니다.'}
        </div>
        <Footer />
      </>
    );
  }

  const locations = getLocations();

  return (
    <div className="product-view-page">
      <Header />

      <div className="product-view-container">
        {/* 1. 왼쪽 컬럼 */}
        <div className="product-view-left">
          {/* 1-1. 이미지 슬라이더 */}
          <div className="image-slider">
            {/* 판매 상태 뱃지 */}
            <div className={`status-badge ${getStatusClassName(product.status)}`}>
              {product.status}
            </div>

            {/* 이미지 여러 개일 때만 화살표 표시 */}
            {productImages.length > 1 && (
              <>
                <button
                  onClick={goToPrevious}
                  className="slider-btn prev"
                >
                  ◀
                </button>
                <button
                  onClick={goToNext}
                  className="slider-btn next"
                >
                  ▶
                </button>
              </>
            )}

            <img
              src={productImages[currentImageIndex]}
              alt={product.name}
              className="main-product-image"
            />
          </div>

          {/* 1-2. 메타 정보 (찜, 조회, 카테고리) */}
          <div className="product-meta-bar">
            <button onClick={toggleLike} className="like-button">
              {isLiked ? '💝' : '🎀'} {ribbonCount}
            </button>
            <span>|</span>
            <span>조회 {product.views.toLocaleString()}</span>
            <span>|</span>
            <span>{product.category}</span>
          </div>
        </div>

        {/* 2. 오른쪽 컬럼 */}
        <div className="product-view-right">
          <h1 className="product-name">{product.name}</h1>

          <div className="product-price">
            {product.price.toLocaleString()}원
          </div>

          <div className="product-location-box">
            <div className="location-item">{locations[0]}</div>
            <div className="location-item">{locations[1]}</div>
            <div className="location-item">{locations[2]}</div>
          </div>

          <button className="chat-button" onClick={handleChat}>
            채팅하기
          </button>

          <div className="product-seller-bar">
            <span>{product.userNickname}</span>
            <span>{product.postedDate}</span>
          </div>

          <div className="product-description">
            <h2>상품설명</h2>
            <p>{product.description}</p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ProductView;
