// src/pages/SignupPage.js

import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import './SignupPage.css';

// (관심 카테고리) 최대 3개 선택
const ALL_CATEGORIES = [
  '디지털기기', '가구/인테리어', '유아동', '생활가전',
  '스포츠/레저', '여성의류', '남성의류', '게임/취미',
  '도서/티켓/음반', '기타 중고물품'
];

const SignupPage = () => {
  const navigate = useNavigate();

  // 기본 폼 상태
  const [loginId, setLoginId] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [name, setName] = useState('');
  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState('');
  const [emailAuthCode, setEmailAuthCode] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [location1, setLocation1] = useState('서울특별시'); // 기본값
  const [location2, setLocation2] = useState('');
  const [location3, setLocation3] = useState('');

  // 이메일 인증 여부
  const [isEmailVerified, setIsEmailVerified] = useState(false);

  // 관심 카테고리 (최대 3개)
  const [selectedCategories, setSelectedCategories] = useState([]);

  // 🔹 카테고리 체크박스 핸들러 (최대 3개)
  const handleCategoryChange = (e) => {
    const { value, checked } = e.target;

    if (checked) {
      if (selectedCategories.length < 3) {
        setSelectedCategories((prev) => [...prev, value]);
      } else {
        e.target.checked = false;
        alert('카테고리는 최대 3개까지만 선택할 수 있습니다.');
      }
    } else {
      setSelectedCategories((prev) => prev.filter((cat) => cat !== value));
    }
  };

  // 🔹 폼 제출
  const handleSubmit = async (e) => {
    e.preventDefault();

    // 필수값 체크
    if (
      !loginId ||
      !password ||
      !name ||
      !nickname ||
      !email ||
      !birthDate ||
      !phoneNumber
    ) {
      alert('필수 항목을 모두 입력해주세요.');
      return;
    }

    if (password !== passwordConfirm) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }

    if (!isEmailVerified) {
      alert('이메일 인증을 먼저 완료해주세요.');
      return;
    }

    // 백엔드에 보낼 데이터
    const signupData = {
      loginId,
      password,
      name,
      nickname,
      email,
      birthDate,          // YYYY-MM-DD
      phoneNumber,
      location1,
      location2,
      location3,
      // selectedCategories  // <- 나중에 백엔드 스펙 잡히면 추가
    };

    try {
      await axios.post('http://localhost:8080/api/auth/signup', signupData);

      alert('회원가입이 완료되었습니다! 로그인 페이지로 이동합니다.');
      navigate('/login');
    } catch (error) {
      console.error('회원가입 실패:', error);
      if (error.response && error.response.data) {
        alert(error.response.data);
      } else {
        alert('회원가입 중 오류가 발생했습니다.');
      }
    }
  };

  // 🔹 이메일 인증번호 발송
  const handleSendAuthCode = async () => {
    if (!email) {
      alert('먼저 이메일을 입력해주세요.');
      return;
    }

    try {
      // 쿼리 파라미터 방식 (백엔드 @RequestParam String email 과 매칭)
      await axios.post(
        'http://localhost:8080/api/auth/email-code',
        null,
        { params: { email } }
      );

      alert(`${email}로 인증 코드를 발송했습니다.`);
      // 이메일을 바꾸면 다시 인증받도록 초기화
      setIsEmailVerified(false);
    } catch (error) {
      console.error('이메일 인증 코드 발송 실패:', error);
      alert(error.response?.data || '인증 코드 발송 중 오류가 발생했습니다.');
    }
  };

  // 🔹 이메일 인증 코드 검증
  const handleVerifyEmailCode = async () => {
    if (!email) {
      alert('이메일을 먼저 입력해주세요.');
      return;
    }
    if (!emailAuthCode) {
      alert('인증 코드를 입력해주세요.');
      return;
    }

    try {
      await axios.post('http://localhost:8080/api/auth/verify-email', {
        email,
        code: emailAuthCode,
      });

      alert('이메일 인증이 완료되었습니다.');
      setIsEmailVerified(true);
    } catch (error) {
      console.error('이메일 인증 실패:', error);
      alert(error.response?.data || '인증 코드가 올바르지 않습니다.');
      setIsEmailVerified(false);
    }
  };

  // 이메일이 바뀌면 인증 상태 초기화
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    setIsEmailVerified(false);
    setEmailAuthCode('');
  };

  return (
    <div className="signup-page-container">
      <div className="signup-form-wrapper">
        <Link to="/" className="signup-logo">
          RE:BORN 🎀
        </Link>

        <form onSubmit={handleSubmit} className="signup-form">
          {/* 아이디 */}
          <div className="input-group">
            <label htmlFor="loginId">아이디</label>
            <input
              type="text"
              id="loginId"
              value={loginId}
              onChange={(e) => setLoginId(e.target.value)}
            />
          </div>

          {/* 비밀번호 */}
          <div className="input-group">
            <label htmlFor="password">비밀번호</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {/* 비밀번호 확인 */}
          <div className="input-group">
            <label htmlFor="passwordConfirm">비밀번호 확인</label>
            <input
              type="password"
              id="passwordConfirm"
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
            />
          </div>

          {/* 이름 */}
          <div className="input-group">
            <label htmlFor="name">이름</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {/* 닉네임 */}
          <div className="input-group">
            <label htmlFor="nickname">닉네임</label>
            <input
              type="text"
              id="nickname"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
            />
          </div>

          {/* 전화번호 */}
          <div className="input-group">
            <label htmlFor="phoneNumber">전화번호</label>
            <input
              type="tel"
              id="phoneNumber"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="010-XXXX-XXXX"
            />
          </div>

          {/* 생년월일 */}
          <div className="input-group">
            <label htmlFor="birthDate">생년월일</label>
            <input
              type="date"
              id="birthDate"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
            />
          </div>

          {/* 이메일 + 인증번호 버튼 */}
          <div className="input-group email-group">
            <label htmlFor="email">
              이메일
              {isEmailVerified && (
                <span style={{ marginLeft: 8, color: 'green', fontSize: '0.9rem' }}>
                  ✓ 인증완료
                </span>
              )}
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={handleEmailChange}
              disabled={isEmailVerified} // 인증 완료 후 이메일 변경 막기 (원하면 빼도 됨)
            />
            <button
              type="button"
              className="auth-button"
              onClick={handleSendAuthCode}
              disabled={!email}
            >
              인증번호
            </button>
          </div>

          {/* 이메일 인증 코드 입력 + 인증하기 버튼 */}
          <div className="input-group">
            <label htmlFor="emailAuthCode">이메일 인증</label>
            <div className="email-verify-group">
              <input
                type="text"
                id="emailAuthCode"
                placeholder="인증 코드를 입력하세요"
                value={emailAuthCode}
                onChange={(e) => setEmailAuthCode(e.target.value)}
                disabled={isEmailVerified}
              />
              <button
                type="button"
                className="auth-button"
                onClick={handleVerifyEmailCode}
                disabled={isEmailVerified}
              >
                {isEmailVerified ? '완료' : '인증하기'}
              </button>
            </div>
          </div>

          {/* (위치) */}
                    <div className="form-group"> {/* 1. .input-group으로 변경 */}
                        <label>위치 (필수)</label>
                        {/* 2. 가로 3열을 위한 .location-selects 클래스 추가 */}
                        <div className="location-selects"> 
                            <select id="location1" value={location1} onChange={(e) => setLocation1(e.target.value)}>
                                <option value="서울특별시">서울특별시</option>
                                <option value="경기도">경기도</option>
                            </select>
                            
                            <input type="text" id="location2" placeholder="e.g., 수원시 영통구" value={location2} onChange={(e) => setLocation2(e.target.value)} />
                            
                            <input type="text" id="location3" placeholder="e.g., 용인시 기흥구" value={location3} onChange={(e) => setLocation3(e.target.value)} />
                        </div>
                    </div>

          

          {/* 제출 버튼 */}
          <button type="submit" className="signup-button">
            가입하기
          </button>
        </form>

        <div className="signup-links">
          <span>이미 계정이 있으신가요?</span>
          <Link to="/login">로그인</Link>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
