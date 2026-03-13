// src/components/Sidebar.js
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  const [recentProducts, setRecentProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const style = {
    width: '200px',
    padding: '0 20px',
    borderLeft: '1px solid #dee2e6',
    backgroundColor: '#f8f9fa', // 사이드바 배경색
  };

  const imageContainerStyle = {
    width: '100%',
    height: '90px',
    backgroundColor: '#eee',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    borderRadius: '4px',
  };

  const imageStyle = {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  };

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '10px',
    marginTop: '10px',
  };

  // 🔥 마운트 시 한 번, 최근 본 상품 불러오기
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      // 비로그인 상태면 그냥 패스
      return;
    }

    const fetchRecent = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(
          'http://localhost:8080/api/products/recent-views',
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) {
          const text = await res.text();
          console.error('최근 본 상품 API 에러:', text);
          throw new Error('최근 본 상품을 불러오지 못했습니다.');
        }

        const data = await res.json();
        console.log('최근 본 상품 목록:', data);
        // ⚠️ MyRecentViewResponse 필드명 기준
        // p.imageUrl1 없으면 productImage1 등으로 맞춰줘야 함
        setRecentProducts(data);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRecent();
  }, []);

  return (
    <aside style={style}>
      <h2>최근 본 상품</h2>

      {loading && <p style={{ fontSize: '13px' }}>불러오는 중...</p>}
      {error && (
        <p style={{ fontSize: '13px', color: 'red' }}>{error}</p>
      )}

      {!loading && !error && recentProducts.length === 0 && (
        <p
          style={{
            fontSize: '13px',
            color: '#888',
            marginTop: '8px',
          }}
        >
          최근 본 상품이 없습니다.
        </p>
      )}

      <div style={gridStyle}>
        {!loading &&
          !error &&
          recentProducts.map((p) => (
            <Link
              key={p.productId}
              to={`/product/${p.productId}`}
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              <div style={imageContainerStyle}>
                <img
                  src={p.imageUrl1 || p.productImage1 || '/productDefault.png'}
                  alt={p.productName}
                  style={imageStyle}
                />
              </div>
            </Link>
          ))}
      </div>
    </aside>
  );
};

export default Sidebar;
