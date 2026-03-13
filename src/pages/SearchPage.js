// src/pages/SearchPage.js

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import SearchProductCard from '../components/SearchProductCard';
import './SearchPage.css';

// (임시) 카테고리 목록 - 필터 UI용
const mockCategories = [
  '디지털기기', '가구/인테리어', '유아동', '생활가전',
  '스포츠/레저', '여성의류', '남성의류', '게임/취미',
  '도서/티켓', '기타'
];

// 🗺 지역 데이터 (서울 12구, 경기도 시 + 구)
const locationData = {
  '서울특별시': {
    level2: [
      '강남구', '서초구', '송파구', '마포구', '용산구', '종로구',
      '중구', '성동구', '광진구', '영등포구', '동작구', '강서구'
    ],
    level3: {}
  },
  '경기도': {
    level2: [
      '수원시', '용인시', '성남시', '고양시', '부천시',
      '안산시', '안양시', '화성시', '남양주시', '의정부시'
    ],
    level3: {
      '수원시': ['장안구', '권선구', '팔달구', '영통구'],
      '용인시': ['처인구', '기흥구', '수지구'],
      '성남시': ['수정구', '중원구', '분당구'],
      '고양시': ['덕양구', '일산동구', '일산서구'],
      '부천시': ['원미구', '소사구', '오정구'],
      '안산시': ['상록구', '단원구'],
      '안양시': ['만안구', '동안구'],
      '화성시': ['봉담읍', '우정읍', '남양읍'],
    }
  }
};

const SearchPage = () => {
  // 🔹 URL 쿼리 (?q=...) 관리
  const [isPriceModalOpen, setIsPriceModalOpen] = useState(false);
  const [priceStats, setPriceStats] = useState(null);

  const [searchParams, setSearchParams] = useSearchParams();
  const keyword = searchParams.get('q') || '';
  const categoryParam = searchParams.get('category') || 'all';

  // ✅ 화면에 보여줄 검색어(또는 카테고리) 한 줄로 결정
  const displayKeyword =
  keyword.trim() !== ''
    ? keyword                      // 검색어가 있으면 그거 우선
    : categoryParam !== 'all'
    ? categoryParam               // 검색어는 없고, category 파라미터가 있으면 그걸 표시
    : '전체';        
  

  // 🔹 실제 검색 결과 데이터 (백엔드에서 받아온 원본)
  const [products, setProducts] = useState([]);
  const [productCount, setProductCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 🔹 필터/정렬/페이지 상태
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const [searchTerm, setSearchTerm] = useState(keyword);
  const [sortOrder, setSortOrder] = useState(searchParams.get('sort') || 'latest');
  const [itemsPerPage, setItemsPerPage] = useState(
    Number(searchParams.get('limit')) || 25
  );

  // ✅ UI에서 입력 중인 값(대기중 필터)
  const [filterCategory, setFilterCategory] = useState(
    searchParams.get('category') || 'all'
  );
  const [filterMinPrice, setFilterMinPrice] = useState(
    searchParams.get('minPrice') || ''
  );
  const [filterMaxPrice, setFilterMaxPrice] = useState(
    searchParams.get('maxPrice') || ''
  );
  const [filterStatus, setFilterStatus] = useState({
    onSale: searchParams.get('status_onSale') === 'true',
    reserved: searchParams.get('status_reserved') === 'true',
    sold: searchParams.get('status_sold') === 'true',
  });

  const [filterLocA1, setFilterLocA1] = useState(
    searchParams.get('locA1') || 'all'
  );
  const [filterLocA2, setFilterLocA2] = useState(
    searchParams.get('locA2') || 'all'
  );
  const [filterLocA3, setFilterLocA3] = useState(
    searchParams.get('locA3') || 'all'
  );

  // 🔥 실제로 목록 필터링에 사용되는 "적용된" 값
  const [appliedCategory, setAppliedCategory] = useState(filterCategory);
  const [appliedMinPrice, setAppliedMinPrice] = useState(filterMinPrice);
  const [appliedMaxPrice, setAppliedMaxPrice] = useState(filterMaxPrice);
  const [appliedStatus, setAppliedStatus] = useState(filterStatus);
  const [appliedLocA1, setAppliedLocA1] = useState(filterLocA1);
  const [appliedLocA2, setAppliedLocA2] = useState(filterLocA2);
  const [appliedLocA3, setAppliedLocA3] = useState(filterLocA3);

  // 🔁 URL 파라미터가 바뀔 때마다 필터 상태도 동기화 (새로고침 대응)
  useEffect(() => {
    const q = searchParams.get('q') || '';
    const sort = searchParams.get('sort') || 'latest';
    const limit = Number(searchParams.get('limit')) || 25;
    const category = searchParams.get('category') || 'all';
    const minPrice = searchParams.get('minPrice') || '';
    const maxPrice = searchParams.get('maxPrice') || '';
    const status_onSale = searchParams.get('status_onSale') === 'true';
    const status_reserved = searchParams.get('status_reserved') === 'true';
    const status_sold = searchParams.get('status_sold') === 'true';
    const locA1 = searchParams.get('locA1') || 'all';
    const locA2 = searchParams.get('locA2') || 'all';
    const locA3 = searchParams.get('locA3') || 'all';

    setSearchTerm(q);
    setSortOrder(sort);
    setItemsPerPage(limit);

    // UI용 상태
    setFilterCategory(category);
    setFilterMinPrice(minPrice);
    setFilterMaxPrice(maxPrice);
    setFilterStatus({
      onSale: status_onSale,
      reserved: status_reserved,
      sold: status_sold,
    });
    setFilterLocA1(locA1);
    setFilterLocA2(locA2);
    setFilterLocA3(locA3);

    // 🔥 실제 적용 상태도 같이 동기화
    setAppliedCategory(category);
    setAppliedMinPrice(minPrice);
    setAppliedMaxPrice(maxPrice);
    setAppliedStatus({
      onSale: status_onSale,
      reserved: status_reserved,
      sold: status_sold,
    });
    setAppliedLocA1(locA1);
    setAppliedLocA2(locA2);
    setAppliedLocA3(locA3);
  }, [searchParams]);

  // 🔥 실제 검색 결과 불러오기 (백엔드 연동)
  useEffect(() => {
    const fetchProducts = async () => {
      // 검색어도 없고 카테고리도 없으면 아무 것도 안 불러옴
      if (!keyword && categoryParam === 'all') {
        setProducts([]);
        setProductCount(0);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const token = localStorage.getItem('accessToken');
        const headers = {};
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }

        const url = `http://localhost:8080/api/products/search?keyword=${encodeURIComponent(
          keyword || ''
        )}`;

        const res = await fetch(url, { headers });

        if (!res.ok) {
          const text = await res.text();
          console.error('검색 API 에러:', text);
          throw new Error('상품 검색 중 오류가 발생했습니다.');
        }

        const data = await res.json();
        console.log('검색 결과 raw data:', data);

        const mapped = data.map((p) => ({
          id: p.productId,
          name: p.productName,
          price: p.price,
          imageUrl: p.productImage1 ?? '/productDefault.png',
          views: p.views ?? 0,
          ribbons: p.ribbons ?? 0, // ✨ 개수는 카드에 보여줄 수 있어서 유지
          postedDate: p.postedDate ?? null,

          category: p.category ?? null,
          status: p.status ?? null,
          loc1: p.productLocation1 ?? null,
          loc2: p.productLocation2 ?? null,
          loc3: p.productLocation3 ?? null,
        }));

        console.log('매핑된 products:', mapped);
        setProducts(mapped);
        setProductCount(mapped.length);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [keyword, categoryParam]);

  // 🔸 지역1 변경 시: 지역2/3 초기화
  const handleLocA1Change = (e) => {
    const value = e.target.value;
    setFilterLocA1(value);
    setFilterLocA2('all');
    setFilterLocA3('all');
  };

  // 🔸 지역2 변경 시: 지역3 초기화
  const handleLocA2Change = (e) => {
    const value = e.target.value;
    setFilterLocA2(value);
    setFilterLocA3('all');
  };

  // 🔸 필터 적용 버튼 클릭 시
  const handleFilterApply = () => {
    // 1) 현재 UI 상태를 "적용된 상태"로 복사
    setAppliedCategory(filterCategory);
    setAppliedMinPrice(filterMinPrice);
    setAppliedMaxPrice(filterMaxPrice);
    setAppliedStatus({ ...filterStatus });
    setAppliedLocA1(filterLocA1);
    setAppliedLocA2(filterLocA2);
    setAppliedLocA3(filterLocA3);

    // 2) URL 파라미터 반영
    const newParams = {
      q: searchTerm,
      sort: sortOrder,
      limit: itemsPerPage,
      category: filterCategory,
      minPrice: filterMinPrice,
      maxPrice: filterMaxPrice,
      status_onSale: filterStatus.onSale,
      status_reserved: filterStatus.reserved,
      status_sold: filterStatus.sold,
      locA1: filterLocA1,
      locA2: filterLocA2,
      locA3: filterLocA3,
    };

    // 빈 값/전체/all/false는 URL에서 제거
    Object.keys(newParams).forEach((key) => {
      if (
        newParams[key] === '' ||
        newParams[key] === 'all' ||
        newParams[key] === false ||
        newParams[key] == null
      ) {
        delete newParams[key];
      }
    });

    setSearchParams(newParams);
    setIsFilterOpen(false);
  };

  // 🔸 필터 초기화 버튼
  const handleFilterReset = () => {
    // UI 상태 리셋
    setFilterCategory('all');
    setFilterMinPrice('');
    setFilterMaxPrice('');
    setFilterStatus({ onSale: false, reserved: false, sold: false });
    setFilterLocA1('all');
    setFilterLocA2('all');
    setFilterLocA3('all');

    // 적용 상태도 리셋
    setAppliedCategory('all');
    setAppliedMinPrice('');
    setAppliedMaxPrice('');
    setAppliedStatus({ onSale: false, reserved: false, sold: false });
    setAppliedLocA1('all');
    setAppliedLocA2('all');
    setAppliedLocA3('all');

    // 검색어(q), 정렬(sort), limit만 유지
    const baseParams = {
      q: searchTerm,
      sort: sortOrder,
      limit: itemsPerPage,
    };
    setSearchParams(baseParams);
  };

  // 🔸 판매 상태 체크박스 변경
  const handleStatusChange = (e) => {
    const { name, checked } = e.target;
    setFilterStatus((prev) => ({ ...prev, [name]: checked }));
  };

  // ✅ 프론트에서 필터 + 정렬 적용
  const getFilteredAndSortedProducts = () => {
    let list = [...products];

    // 1) 카테고리
    if (appliedCategory !== 'all') {
      list = list.filter((p) => p.category === appliedCategory);
    }

    // 2) 가격
    const min = appliedMinPrice !== '' ? Number(appliedMinPrice) : null;
    const max = appliedMaxPrice !== '' ? Number(appliedMaxPrice) : null;

    if (min != null && !Number.isNaN(min)) {
      list = list.filter((p) => (p.price ?? 0) >= min);
    }
    if (max != null && !Number.isNaN(max)) {
      list = list.filter((p) => (p.price ?? 0) <= max);
    }

    // 3) 상태
    const activeStatus = [];
    if (appliedStatus.onSale) activeStatus.push('FOR_SALE');
    if (appliedStatus.reserved) activeStatus.push('RESERVED');
    if (appliedStatus.sold) activeStatus.push('SOLD');

    if (activeStatus.length > 0) {
      list = list.filter((p) => activeStatus.includes(p.status));
    }

    // 4) 지역
    if (appliedLocA1 !== 'all') {
      list = list.filter((p) => p.loc1 === appliedLocA1);
    }
    if (appliedLocA2 !== 'all') {
      list = list.filter((p) => p.loc2 === appliedLocA2);
    }
    if (appliedLocA3 !== 'all') {
      list = list.filter((p) => p.loc3 === appliedLocA3);
    }

    // 5) 정렬 (리본 순 ❌, 조회수/가격/날짜만)
    const getTime = (p) => {
      if (!p.postedDate) return 0;
      let fixed = p.postedDate;
      if (fixed.includes(' ') && !fixed.includes('T')) {
        fixed = fixed.replace(' ', 'T');
      }
      const t = new Date(fixed).getTime();
      return Number.isNaN(t) ? 0 : t;
    };

    list.sort((a, b) => {
      switch (sortOrder) {
        case 'oldest':
          return getTime(a) - getTime(b);
        case 'price_asc':
          return (a.price ?? 0) - (b.price ?? 0);
        case 'price_desc':
          return (b.price ?? 0) - (a.price ?? 0);
        case 'views':
          return (b.views ?? 0) - (a.views ?? 0);
        case 'latest':
        default:
          return getTime(b) - getTime(a);
      }
    });

    return list;
  };

  const filteredProducts = getFilteredAndSortedProducts();
  const limitedProducts = filteredProducts.slice(0, itemsPerPage);
  
  const fetchPriceStats = async () => {
    try {
      const res = await fetch(`http://localhost:8080/api/products/price?keyword=${encodeURIComponent(keyword)}`);
      const data = await res.json();
      setPriceStats(data);
    } catch (err) {
      console.error(err);
    }
  };  

  return (
    <div className="search-page">
      <Header />

      <div className="search-container">
        {/* 1. 검색 결과 헤더 */}
        <div className="search-header">
        <h2>
            <span className="search-keyword">"{displayKeyword}"</span> 검색 결과
        </h2>
        <span className="search-count">
            총 {filteredProducts.length.toLocaleString()}개
        </span>
        <button
          className="price-check-btn"
          onClick={() => {
            setIsPriceModalOpen(true);
            fetchPriceStats();
          }}
        >
          시세 조회
        </button>
        </div>


        {/* 2. 필터 바 */}
        <div className="filter-bar">
          {/* 2-1. 필터 토글 + 초기화 */}
          <div className="filter-toggle-header">
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="filter-toggle-btn"
            >
              필터링
              <span className={isFilterOpen ? 'arrow-up' : 'arrow-down'}>
                {isFilterOpen ? '▲' : '▼'}
              </span>
            </button>
            <button onClick={handleFilterReset} className="filter-reset-btn">
              필터 초기화
            </button>
          </div>

          {/* 2-2. 상세 필터 영역 */}
          {isFilterOpen && (
            <div className="filter-details">
              {/* --- 1번째 줄: 카테고리 --- */}
              <div className="filter-row">
                <label className="filter-label">카테고리</label>
                <select
                  className="filter-select"
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                >
                  <option value="all">전체</option>
                  {mockCategories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* --- 2번째 줄: 가격 --- */}
              <div className="filter-row">
                <label className="filter-label">가격</label>
                <div className="filter-price-inputs">
                  <input
                    type="number"
                    placeholder="최소 가격"
                    value={filterMinPrice}
                    onChange={(e) => setFilterMinPrice(e.target.value)}
                  />
                  <span>~</span>
                  <input
                    type="number"
                    placeholder="최대 가격"
                    value={filterMaxPrice}
                    onChange={(e) => setFilterMaxPrice(e.target.value)}
                  />
                  <span>원</span>
                </div>
              </div>

              {/* --- 3번째 줄: 판매 상태 --- */}
              <div className="filter-row">
                <label className="filter-label">판매 상태</label>
                <div className="filter-checkboxes">
                  <label>
                    <input
                      type="checkbox"
                      name="onSale"
                      checked={filterStatus.onSale}
                      onChange={handleStatusChange}
                    />{' '}
                    판매 중
                  </label>
                  <label>
                    <input
                      type="checkbox"
                      name="reserved"
                      checked={filterStatus.reserved}
                      onChange={handleStatusChange}
                    />{' '}
                    예약 중
                  </label>
                  <label>
                    <input
                      type="checkbox"
                      name="sold"
                      checked={filterStatus.sold}
                      onChange={handleStatusChange}
                    />{' '}
                    판매 완료
                  </label>
                </div>
              </div>

              {/* --- 4번째 줄: 지역 A --- */}
              <div className="filter-row location-row">
                <label className="filter-label">지역 A</label>

                {/* 지역1: 시/도 */}
                <select
                  value={filterLocA1}
                  onChange={handleLocA1Change}
                >
                  <option value="all">지역1</option>
                  <option value="서울특별시">서울특별시</option>
                  <option value="경기도">경기도</option>
                </select>

                {/* 지역2: 구/시 */}
                <select
                  value={filterLocA2}
                  onChange={handleLocA2Change}
                  disabled={filterLocA1 === 'all'}
                >
                  <option value="all">지역2</option>
                  {filterLocA1 !== 'all' &&
                    locationData[filterLocA1]?.level2.map((loc) => (
                      <option key={loc} value={loc}>
                        {loc}
                      </option>
                    ))}
                </select>

                {/* 지역3: 동 (서울은 사용 안 함) */}
                <select
                  value={filterLocA3}
                  onChange={(e) => setFilterLocA3(e.target.value)}
                  disabled={
                    filterLocA1 === '서울특별시' || filterLocA2 === 'all'
                  }
                >
                  <option value="all">지역3</option>
                  {filterLocA1 === '경기도' &&
                    filterLocA2 !== 'all' &&
                    (locationData['경기도'].level3[filterLocA2] || []).map(
                      (loc) => (
                        <option key={loc} value={loc}>
                          {loc}
                        </option>
                      )
                    )}
                </select>
              </div>

              {/* --- 마지막 줄: 필터 적용 버튼 --- */}
              <div className="filter-apply-row">
                <button
                  onClick={handleFilterApply}
                  className="filter-apply-btn"
                >
                  필터 적용
                </button>
              </div>
            </div>
          )}

          {/* 2-3. 정렬 + 페이지 수 */}
          <div className="filter-sort-options">
            <div className="sort-buttons">
              <button
                className={sortOrder === 'latest' ? 'active' : ''}
                onClick={() => setSortOrder('latest')}
              >
                최신 순
              </button>
              <button
                className={sortOrder === 'oldest' ? 'active' : ''}
                onClick={() => setSortOrder('oldest')}
              >
                오래된 순
              </button>
              <button
                className={sortOrder === 'price_asc' ? 'active' : ''}
                onClick={() => setSortOrder('price_asc')}
              >
                낮은 가격 순
              </button>
              <button
                className={sortOrder === 'price_desc' ? 'active' : ''}
                onClick={() => setSortOrder('price_desc')}
              >
                높은 가격 순
              </button>
              <button
                className={sortOrder === 'views' ? 'active' : ''}
                onClick={() => setSortOrder('views')}
              >
                조회수 순
              </button>
              {/* 🔥 리본 순 버튼은 완전히 제거 */}
            </div>
            <select
              className="items-per-page"
              value={itemsPerPage}
              onChange={(e) => setItemsPerPage(Number(e.target.value))}
            >
              <option value={25}>25개씩 보기</option>
              <option value={50}>50개씩 보기</option>
              <option value={100}>100개씩 보기</option>
            </select>
          </div>
        </div>

        {/* 3. 제품 목록 그리드 */}
        {loading && <p>검색 중...</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}

        <div className="product-grid-search">
          {!loading &&
            !error &&
            limitedProducts.map((product) => (
              <SearchProductCard key={product.id} product={product} />
            ))}

          {!loading &&
            !error &&
            limitedProducts.length === 0 &&
            keyword && <p>검색 결과가 없습니다.</p>}
        </div>
      </div>
      {isPriceModalOpen && (
        <div
  className="price-modal-backdrop"
  onClick={() => setIsPriceModalOpen(false)}
>
  <div
    className="price-modal"
    onClick={(e) => e.stopPropagation()}
  >
    <h3>
      <span className="search-keyword">"{displayKeyword}"</span>의 시세
    </h3>

    {/* 최근 한 달 시세 테이블 */}
    <table className="price-table">
      <tbody>
        <tr>
          <td className="label price-weighted">최근 한 달 정밀 시세</td>
          <td className="value price-weighted">{priceStats?.weightedPrice?.toLocaleString()}원</td>
        </tr>
        <tr>
          <td className="label">최근 한 달 평균 가격</td>
          <td className="value">{priceStats?.recentAveragePrice?.toLocaleString()}원</td>
        </tr>
        <tr>
          <td className="label">역대 최고 거래가</td>
          <td className="value">{priceStats?.highestPrice?.toLocaleString()}원</td>
        </tr>
        <tr>
          <td className="label">총 거래 건수</td>
          <td className="value">{priceStats?.totalTransactions?.toLocaleString()}건</td>
        </tr>
        <tr>
          <td className="label">거래 비율</td>
          <td className="value">{priceStats?.soldRatio}</td>
        </tr>
        <tr>
          <td className="label">시세 변동폭</td>
          <td className="value">{priceStats?.priceFluctuation?.toLocaleString()}원</td>
        </tr>
      </tbody>
    </table>


    <button
      className="price-modal-close"
      onClick={() => setIsPriceModalOpen(false)}
    >
      닫기
    </button>
  </div>
</div>

      )}
      <Footer />
    </div>
  );
};

export default SearchPage;
