// src/pages/ProductUploadPage.js
import React, { useState, useEffect, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import './ProductUploadPage.css'; // 전용 CSS

// --- (임시) 카테고리 목록 ---
const MOCK_CATEGORIES = [
  '(없음)', '디지털기기', '가구/인테리어', '유아동', '생활가전',
  '스포츠/레저', '여성의류', '남성의류', '게임/취미', '도서/티켓', '기타'
];

// 🗺 SearchPage와 비슷하지만, 업로드 페이지에서는 서울도 동(지역3) 사용
const locationData = {
  '서울특별시': {
    level2: [
      '강남구', '서초구', '송파구', '마포구', '용산구', '종로구',
      '중구', '성동구', '광진구', '영등포구', '동작구', '강서구'
    ],
    level3: {
      '강남구': ['역삼동', '논현동', '대치동'],
      '서초구': ['서초동', '방배동', '잠원동'],
      '송파구': ['잠실동', '문정동', '송파동'],
      '마포구': ['합정동', '연남동', '망원동'],
      '용산구': ['이태원동', '한남동', '효창동'],
      '종로구': ['종로1가', '종로2가', '청운동'],
      '중구': ['명동', '회현동', '필동'],
      '성동구': ['성수동', '왕십리도선동', '행당동'],
      '광진구': ['구의동', '군자동', '화양동'],
      '영등포구': ['영등포동', '여의도동', '당산동'],
      '동작구': ['상도동', '노량진동', '사당동'],
      '강서구': ['화곡동', '등촌동', '방화동'],
    }
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
      // 남양주시, 의정부시는 구가 없는 걸로 두기
    }
  }
};

// 1단계 시/도 옵션 (placeholder 유지)
const LOCATION_L1_PLACEHOLDER = '(필수) 시/도 선택';
const LOCATION_L1_OPTIONS = [LOCATION_L1_PLACEHOLDER, '서울특별시', '경기도'];

const ProductUploadPage = () => {
  console.log('🧪 ProductUploadPage 렌더링됨');
  const navigate = useNavigate();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isCheckingRisk, setIsCheckingRisk] = useState(false);

  // 1. 폼 상태
  const [productName, setProductName] = useState('');
  const [productDescription, setProductDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('(없음)');

  // 이미지 + 도용 검사 결과
  const [images, setImages] = useState([]); // [{ file, preview, checkResult }, ...]

  // 2. 위치 상태
  const [locA, setLocA] = useState({
    l1: LOCATION_L1_PLACEHOLDER,
    l2: '(필수) 구/시 선택',
    l3: '(필수) 동/구 선택',
  });
  const [locB, setLocB] = useState({ l1: '', l2: '', l3: '' });
  const [locC, setLocC] = useState({ l1: '', l2: '', l3: '' });
  useEffect(() => {
  console.log('🔥 locA 변경됨:', locA);
  }, [locA]);
  console.log('내 정보 응답:', res.data);

  // 3. 이미지 드롭 + 도용 검사
  const onDrop = useCallback(async (acceptedFiles) => {
    if (images.length + acceptedFiles.length > 3) {
      alert('이미지는 최대 3개까지만 업로드할 수 있습니다.');
      return;
    }

    setIsCheckingRisk(true);
    const token = localStorage.getItem('accessToken');

    const newImageFiles = [];
    for (const file of acceptedFiles) {
      const formData = new FormData();
      formData.append('imageFile', file);

      try {
        const response = await axios.post(
          'http://localhost:8080/api/products/check-image',
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
              'Authorization': `Bearer ${token}`
            }
          }
        );
        newImageFiles.push({
          file,
          preview: URL.createObjectURL(file),
          checkResult: response.data
        });
      } catch (error) {
        console.error("AI 도용 검사 실패:", error);
        newImageFiles.push({
          file,
          preview: URL.createObjectURL(file),
          checkResult: { riskLevel: 'Error', reason: '도용 검사 실패' }
        });
      }
    }

    setImages((prev) => [...prev, ...newImageFiles]);
    setIsCheckingRisk(false);
  }, [images]);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: { 'image/jpeg': [], 'image/png': [] },
    multiple: true
  });

  // 4. AI 자동완성
  const handleAiAnalyze = async () => {
    if (images.length === 0) {
      alert('먼저 이미지를 1개 이상 등록해주세요.');
      return;
    }

    const fileToAnalyze = images[0].file;
    setIsAnalyzing(true);

    const formData = new FormData();
    formData.append('imageFile', fileToAnalyze);
    const token = localStorage.getItem('accessToken');

    try {
      const response = await axios.post(
        'http://localhost:8080/api/products/analyze-image',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`
          }
        }
      );

      const { productName, category, productDescription } = response.data;
      setProductName(productName);
      setCategory(category);
      setProductDescription(productDescription);
      alert('AI가 제품 정보를 자동으로 입력했습니다.');
    } catch (error) {
      console.error("AI 이미지 분석 실패:", error);
      alert("AI 자동 완성 중 오류가 발생했습니다.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  // 5. 이미지 삭제
  const removeImage = (indexToRemove) => {
    setImages((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  // 6. 위치 선택
  const handleLocationChange = (locSet, level, value) => {
    const updateLoc = (prevLoc) => {
      const newLoc = { ...prevLoc };
      if (level === 1) {
        newLoc.l1 = value;
        newLoc.l2 = '';
        newLoc.l3 = '';
      } else if (level === 2) {
        newLoc.l2 = value;
        newLoc.l3 = '';
      } else {
        newLoc.l3 = value;
      }
      return newLoc;
    };

    if (locSet === 'A') setLocA(updateLoc);
    else if (locSet === 'B') setLocB(updateLoc);
    else if (locSet === 'C') setLocC(updateLoc);
  };
  
  useEffect(() => {
  const fetchMyLocation = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        console.log('토큰 없음');
        return;
      }

      const res = await axios.get('http://localhost:8080/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log('내 정보 응답:', res.data);   // ✅ 1) 응답 구조 확인
      const me = res.data;

      setLocA({
        l1: me.userLocation1,
        l2: me.userLocation2,
        l3: me.userLocation3,
      });

      console.log('locA 세팅 후:', {
        l1: me.userLocation1,
        l2: me.userLocation2,
        l3: me.userLocation3,
      }); // ✅ 2) 실제 세팅 값 확인
    } catch (err) {
      console.error('내 위치 불러오기 실패:', err); // ✅ 3) 에러 확인
    }
  };

  fetchMyLocation();
}, []);


  // 7. 등록하기
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isAnalyzing || isCheckingRisk) {
      alert('AI가 작업을 처리 중입니다. 잠시만 기다려주세요.');
      return;
    }

    if (!productName || !productDescription || !price) {
      alert('제품명, 제품 설명, 가격은 필수 입력 항목입니다.');
      return;
    }

    if (!/^\d+$/.test(price)) {
      alert('가격은 숫자(정수)만 입력해주세요.');
      return;
    }

    if (!locA.l1 || locA.l1.includes('선택') ||
        !locA.l2 || locA.l2.includes('선택') ||
        !locA.l3 || locA.l3.includes('선택')) {
      alert('판매 지역 1은 세부 지역(동/읍/면)까지 모두 선택해야 합니다.');
      return;
    }

    if (images.length === 0) {
      alert('하나 이상의 이미지를 등록해야 합니다.');
      return;
    }

    setIsSubmitting(true);

    // 도용 고위험 이미지 경고
    const highRiskImages = images.filter(
      (img) => img.checkResult && img.checkResult.riskLevel === 'High'
    );
    if (highRiskImages.length > 0) {
      const ok = window.confirm(
        `이미지 ${highRiskImages.length}개에서 도용이 의심됩니다.\n` +
        `관리자에게 해당 내역이 보고됩니다.\n\n` +
        `그래도 등록하시겠습니까?`
      );
      if (!ok) {
        setIsSubmitting(false);
        return;
      }
    }

    // 실제 전송 데이터 구성
    const finalFormData = new FormData();
    finalFormData.append('productName', productName);
    finalFormData.append('productDescription', productDescription);
    finalFormData.append('price', price);

    // 🔥 수정: 프론트는 선택값 그대로, 서버가 "(없음) → OTHERS" 처리
    finalFormData.append('category', category);

    const locations = [locA, locB, locC].filter(
      (loc) => loc.l1 && !loc.l1.includes('선택')
    );
    finalFormData.append('locations', JSON.stringify(locations));

    images.forEach((img, index) => {
      finalFormData.append(`productImage${index + 1}`, img.file);
    });

    try {
      await axios.post(
        'http://localhost:8080/api/products/upload',
        finalFormData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
          }
        }
      );

      alert('상품 등록이 완료되었습니다!');
      navigate('/');
    } catch (error) {
      console.error("상품 등록 실패:", error);
      alert("상품 등록 중 오류가 발생했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // 8. 초기화
  const handleReset = () => {
    setProductName('');
    setProductDescription('');
    setPrice('');
    setCategory('(없음)');
    setImages([]);
    // setLocA는 그대로 두고, B/C만 초기화
    setLocB({ l1: '', l2: '', l3: '' });
    setLocC({ l1: '', l2: '', l3: '' });
  };

  // 9. 위험도 태그 색상 클래스
  const getRiskLevelClass = (checkResult) => {
    if (!checkResult) return '';
    const level = checkResult.riskLevel;
    if (level === 'High') return 'risk-high';
    if (level === 'Medium') return 'risk-medium';
    if (level === 'Low') return 'risk-low';
    return 'risk-error';
  };

  const isLoading = isSubmitting || isAnalyzing || isCheckingRisk;

  return (
    <div className="product-upload-page">
      <Header />
      <div className="upload-container">
        <form onSubmit={handleSubmit} className="upload-form">
          <h1>새 제품 등록하기(테스트)</h1>
          {/* 이미지 드롭존 */}
          <div className="form-group">
            <div className="form-group-header">
              <label>
                이미지 (최대 3개) <span>(필수)</span>
                
              </label>
              <button
                  type="button"
                  className="ai-analyze-btn"
                  onClick={handleAiAnalyze}
                  disabled={isLoading || images.length === 0}
                >
                  🤖 AI로 자동 완성
                </button>
            </div>
            <div
              {...getRootProps({
                className: `dropzone ${isLoading ? 'checking' : ''}`,
              })}
            >
              <input {...getInputProps()} />
              {isAnalyzing ? (
                <p>AI가 자동 완성 중입니다...</p>
              ) : isCheckingRisk ? (
                <p>AI가 도용 검사 중입니다...</p>
              ) : (
                <p>클릭 또는 드래그하여 이미지를 여기에 놓으세요</p>
              )}
            </div>
            <div className="image-preview-list">
              {images.map((img, index) => (
                <div key={index} className="image-preview-item">
                  <img
                    src={img.preview}
                    alt={`미리보기 ${index + 1}`}
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="remove-btn"
                  >
                    X
                  </button>

                  {img.checkResult && (
                    <div
                      className={`image-check-tag ${getRiskLevelClass(
                        img.checkResult
                      )}`}
                    >
                      {img.checkResult.riskLevel === 'High'
                        ? '고위험'
                        : img.checkResult.riskLevel === 'Medium'
                        ? '중위험'
                        : img.checkResult.riskLevel === 'Low'
                        ? '안전'
                        : '오류'}
                    </div>
                  )}
                </div>
              ))}
            </div>
        </div>

          {/* 제품명 */}
          <div className="form-group">
            <label htmlFor="productName">
              제품명 <span>(필수)</span>
            </label>
            <input
              type="text"
              id="productName"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              maxLength={100}
              placeholder="제품명을 입력하세요"
            />
          </div>

          {/* 제품 설명 & AI 버튼 */}
          <div className="form-group product-name-group">
            <div className="label-with-button">
              <label htmlFor="productDescription">
                제품 설명 <span>(필수)</span>
              </label>
              
            </div>
            <textarea
              id="productDescription"
              value={productDescription}
              onChange={(e) => setProductDescription(e.target.value)}
              maxLength={1000}
              placeholder="제품 설명을 입력하세요 (최대 1000자)"
              rows={8}
            />
          </div>

          {/* 가격 */}
          <div className="form-group">
            <label htmlFor="price">
              가격 <span>(필수)</span>
            </label>
            <input
              type="number"
              id="price"
              value={price}
              onChange={(e) =>
                setPrice(e.target.value.replace(/\D/g, ''))
              }
              placeholder="가격(원)을 숫자만 입력하세요"
            />
          </div>

          {/* 카테고리 */}
          <div className="form-group">
            <label htmlFor="category">카테고리</label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {MOCK_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          

          {/* 판매 지역 1 (필수) */}
          <div className="form-group">
            <label>
              판매 지역 1 <span>(필수)</span>
            </label>
            <div className="location-selects">
              {/* 시/도 - 사용자 위치, 수정 불가 */}
              <select value={locA.l1} disabled>
                <option value={locA.l1}>{locA.l1 || '시/도'}</option>
              </select>

              {/* 구/시 - 사용자 위치, 수정 불가 */}
              <select value={locA.l2} disabled>
                <option value={locA.l2}>{locA.l2 || '구/시'}</option>
              </select>

              {/* 동/구 - 사용자 위치, 수정 불가 */}
              <select value={locA.l3} disabled>
                <option value={locA.l3}>{locA.l3 || '동/구'}</option>
              </select>
            </div>
          </div>

          {/* 판매 지역 2 (선택) */}
          <div className="form-group">
            <label>판매 지역 2</label>
            <div className="location-selects">
              <select
                value={locB.l1}
                onChange={(e) =>
                  handleLocationChange('B', 1, e.target.value)
                }
              >
                {LOCATION_L1_OPTIONS.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>

              <select
                value={locB.l2}
                onChange={(e) =>
                  handleLocationChange('B', 2, e.target.value)
                }
                disabled={
                  !locB.l1 || locB.l1 === LOCATION_L1_PLACEHOLDER
                }
              >
                <option value="(필수) 구/시 선택">
                  (필수) 구/시 선택
                </option>
                {locB.l1 &&
                  locB.l1 !== LOCATION_L1_PLACEHOLDER &&
                  locationData[locB.l1]?.level2.map((loc) => (
                    <option key={loc} value={loc}>
                      {loc}
                    </option>
                  ))}
              </select>

              <select
                value={locB.l3}
                onChange={(e) =>
                  handleLocationChange('B', 3, e.target.value)
                }
                disabled={
                  !locB.l1 ||
                  !locB.l2 ||
                  locB.l2.includes('선택') ||
                  !locationData[locB.l1] ||
                  !locationData[locB.l1].level3 ||
                  !locationData[locB.l1].level3[locB.l2]
                }
              >
                <option value="(필수) 동/구 선택">
                  (필수) 동/구 선택
                </option>
                {locB.l1 &&
                  locB.l2 &&
                  !locB.l2.includes('선택') &&
                  locationData[locB.l1] &&
                  locationData[locB.l1].level3 &&
                  (locationData[locB.l1].level3[locB.l2] || []).map(
                    (loc) => (
                      <option key={loc} value={loc}>
                        {loc}
                      </option>
                    )
                  )}
              </select>
            </div>
          </div>

          {/* 판매 지역 3 (선택) */}
          <div className="form-group">
            <label>판매 지역 3</label>
            <div className="location-selects">
              <select
                value={locC.l1}
                onChange={(e) =>
                  handleLocationChange('C', 1, e.target.value)
                }
              >
                {LOCATION_L1_OPTIONS.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>

              <select
                value={locC.l2}
                onChange={(e) =>
                  handleLocationChange('C', 2, e.target.value)
                }
                disabled={
                  !locC.l1 || locC.l1 === LOCATION_L1_PLACEHOLDER
                }
              >
                <option value="(필수) 구/시 선택">
                  (필수) 구/시 선택
                </option>
                {locC.l1 &&
                  locC.l1 !== LOCATION_L1_PLACEHOLDER &&
                  locationData[locC.l1]?.level2.map((loc) => (
                    <option key={loc} value={loc}>
                      {loc}
                    </option>
                  ))}
              </select>

              <select
                value={locC.l3}
                onChange={(e) =>
                  handleLocationChange('C', 3, e.target.value)
                }
                disabled={
                  !locC.l1 ||
                  !locC.l2 ||
                  locC.l2.includes('선택') ||
                  !locationData[locC.l1] ||
                  !locationData[locC.l1].level3 ||
                  !locationData[locC.l1].level3[locC.l2]
                }
              >
                <option value="(필수) 동/구 선택">
                  (필수) 동/구 선택
                </option>
                {locC.l1 &&
                  locC.l2 &&
                  !locC.l2.includes('선택') &&
                  locationData[locC.l1] &&
                  locationData[locC.l1].level3 &&
                  (locationData[locC.l1].level3[locC.l2] || []).map(
                    (loc) => (
                      <option key={loc} value={loc}>
                        {loc}
                      </option>
                    )
                  )}
              </select>
            </div>
          </div>

          {/* 등록/초기화 버튼 */}
          <div className="form-actions">
            <button
              type="button"
              onClick={handleReset}
              className="reset-btn"
              disabled={isLoading}
            >
              초기화
            </button>
            <button
              type="submit"
              className="submit-btn"
              disabled={isLoading}
            >
              {isSubmitting
                ? '등록 중...'
                : isAnalyzing
                ? 'AI 분석 중...'
                : isCheckingRisk
                ? '도용 검사 중...'
                : '등록하기'}
            </button>
          </div>
        </form>
      </div>
      <Footer />
    </div>
  );
};

export default ProductUploadPage;
