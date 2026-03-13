// src/pages/MainPage.js

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Sidebar from '../components/Sidebar';
import SearchProductCard from '../components/SearchProductCard';

const MainPage = () => {
  // 조회수 TOP 상품들
  const [topProducts, setTopProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // 🔥 조회수 TOP API 호출 (/api/products/top-views)
  // 🔥 조회수 TOP API 호출 (/api/products/top-views)
useEffect(() => {
  const fetchTopProducts = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const headers = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const res = await fetch(
        'http://localhost:8080/api/products/top-views',
        { headers }
      );

      console.log('TOP 조회수 응답 상태:', res.status);

      if (!res.ok) {
        const text = await res.text();
        console.error('TOP 조회수 API 에러 응답:', text);
        throw new Error('조회수 TOP 상품을 불러오지 못했습니다.');
      }

      const data = await res.json();
      console.log('TOP 조회수 raw data:', data);

      // DTO -> 프론트용으로 매핑
      const mapped = data.map((p) => ({
        id: p.productId ?? p.id,
        name: p.productName ?? p.name,
        price: p.price,
        imageUrl: p.productImage1 ?? p.imageUrl ?? '/productDefault.png',
        views: p.views ?? 0,
        ribbons: 0,
        postedDate: p.postedDate ?? null,
      }));

      // ✅ 최대 10개만 사용
      setTopProducts(mapped.slice(0, 10));
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  fetchTopProducts();
}, []);


  // --- 레이아웃 스타일 (기존 유지) ---
  const mainPageStyle = {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
  };

  const mainLayout = {
    display: 'flex',
    flex: 1,
    width: '100%',
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '20px 0',
  };

  const mainContent = {
    flex: 1,
    padding: '0 20px',
  };

  const productGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(5, 1fr)', // 5열 그리드
    gap: '20px',
  };

  return (
    <div style={mainPageStyle}>
      <Header />

      <div style={mainLayout}>
        <main style={mainContent}>
          <section>
            <h2>조회수 TOP 추천 상품</h2>

            {isLoading && <p>상품 불러오는 중...</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}

            {!isLoading && !error && (
              <div style={productGridStyle}>
                {topProducts.map((product) => (
                  <Link
                    key={product.id}
                    to={`/product/${product.id}`} // ✅ 상세 페이지 이동 (첫 번째 버전 기능)
                    style={{ textDecoration: 'none', color: 'inherit' }}
                  >
                    {/* SearchPage와 동일한 카드 컴포넌트 사용 */}
                    <SearchProductCard product={product} />
                  </Link>
                ))}

                {!topProducts.length && (
                  <p>표시할 상품이 없습니다.</p>
                )}
              </div>
            )}
          </section>

          {/* 🔥 과거 "찜 많은 인기 상품" / 리본 관련 섹션은 완전히 제거 */}
        </main>

        <Sidebar />
      </div>

      <Footer />
    </div>
  );
};

export default MainPage;
