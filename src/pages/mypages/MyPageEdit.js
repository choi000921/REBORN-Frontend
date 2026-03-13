// src/pages/mypages/MyPageEdit.js

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // (1. axios import 추가)
import './MyPageEdit.css'; 

// (삭제) 2. mockUserData 삭제

// (유지) 3. Mock Data (Locations L1) - (이것도 추후 API로 대체 가능)
const MOCK_LOCATIONS_L1 = ['(필수) 시/도 선택', '서울특별시', '경기도'];
// (삭제) MOCK_LOCATIONS_L2, L3 (직접 입력으로 변경)

const MyPageEdit = () => {
    const navigate = useNavigate();
    
    // 4. 폼(Form) 상태 관리 (기존과 동일)
    const [userName, setUserName] = useState('');
    const [userNickname, setUserNickname] = useState('');
    const [userPassword, setUserPassword] = useState(''); // '새 비밀번호'
    const [passwordCheck, setPasswordCheck] = useState('');
    const [userPhone, setUserPhone] = useState('');
    const [userEmail, setUserEmail] = useState('');
    const [loc, setLoc] = useState({ l1: '', l2: '', l3: '' });

    // (수정 불가)
    const [userId, setUserId] = useState('');
    const [userBirthday, setUserBirthday] = useState('');

    // 5. (수정) 데이터 로딩 (API 호출)
    useEffect(() => {
        const fetchMyInfo = async () => {
            try {
                const token = localStorage.getItem('accessToken');
                if (!token) { window.location.href = '/login'; return; }

                // (수정) /api/users/me API 호출 (MyPageMain과 동일)
                const response = await axios.get('http://localhost:8080/api/users/me', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                
                const data = response.data;
                // (수정) API 응답으로 state 채우기
                setUserName(data.userName);
                setUserNickname(data.userNickname);
                setUserPhone(data.userPhone);
                setUserEmail(data.userEmail);
                
                // (수정) userLocation(합쳐진 문자열)을 다시 분리
                const locParts = data.userLocation.split(' ');
                setLoc({ l1: locParts[0] || '', l2: locParts[1] || '', l3: locParts[2] || '' });
                
                // (수정) 수정 불가 항목 채우기 (userId는 AuthResponse에서 가져와야 함)
                // (임시) 로그인한 유저 ID (localStorage에서)
                setUserId(localStorage.getItem('userId')); 
                setUserBirthday(data.userBirthday);

            } catch (err) {
                console.error("정보 수정 페이지 로딩 실패:", err);
            }
        };
        
        fetchMyInfo();
    }, []); // 1회만 실행

    // 6. (수정) 위치 선택 핸들러 (L2, L3는 text input)
    const handleLocationChange = (level, value) => {
        const newLoc = { ...loc };
        if (level === 1) {
            newLoc.l1 = value;
            // (수정) L1 변경 시 L2, L3 초기화 (직접 입력이므로)
            newLoc.l2 = ''; 
            newLoc.l3 = '';
        } else if (level === 2) {
            newLoc.l2 = value;
        } else {
            newLoc.l3 = value;
        }
        setLoc(newLoc);
    };

    // 7. (수정) "수정 완료" 핸들러 (API 호출)
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (userPassword && (userPassword !== passwordCheck)) {
            alert('비밀번호가 일치하지 않습니다.');
            return;
        }
        
        // (수정) 백엔드 DTO(MyPageEditRequest)에 맞게 데이터 준비
        const updateData = {
            userNickname: userNickname,
            newUserPassword: userPassword, // (비밀번호는 비어있으면 백엔드가 무시)
            userPhone: userPhone,
            userEmail: userEmail,
            location1: loc.l1,
            location2: loc.l2,
            location3: loc.l3
        };

        try {
            const token = localStorage.getItem('accessToken');
            // (수정) PUT /api/users/me API 호출
            await axios.put('http://localhost:8080/api/users/me', updateData, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            
            alert('정보 수정이 완료되었습니다.');
            navigate('/mypage'); // "내 정보" 메인으로 복귀
        } catch (error) {
            console.error("정보 수정 실패:", error);
            alert("정보 수정 중 오류가 발생했습니다.");
        }
    };
    
    // 8. (수정) "초기화" 핸들러
    const handleReset = () => {
        // (수정) API로 불러온 초기 데이터로 되돌리는 것은 복잡하므로,
        // 비밀번호 입력란만 비웁니다.
        setUserPassword('');
        setPasswordCheck('');
    };

    return (
        <div className="mypage-edit-container">
            <h1 className="mypage-title">{userNickname}님의 마이페이지</h1>
            
            <form onSubmit={handleSubmit} className="edit-form">
                {/* ... (userName, userNickname, password 폼) ... */}
                <div className="form-row">
                    <label>이름</label>
                    <input type="text" value={userName} onChange={(e) => setUserName(e.target.value)} />
                </div>
                <div className="form-row">
                    <label>닉네임</label>
                    <input type="text" value={userNickname} onChange={(e) => setUserNickname(e.target.value)} />
                </div>
                <div className="form-row">
                    <label>새 비밀번호</label>
                    <input type="password" value={userPassword} onChange={(e) => setUserPassword(e.target.value)} placeholder="변경할 경우에만 입력" />
                </div>
                <div className="form-row">
                    <label>비밀번호 확인</label>
                    <input type="password" value={passwordCheck} onChange={(e) => setPasswordCheck(e.target.value)} />
                </div>
                <div className="form-row">
                    <label>전화번호</label>
                    <input type="tel" value={userPhone} onChange={(e) => setUserPhone(e.target.value)} />
                </div>
                <div className="form-row">
                    <label>이메일</label>
                    <input type="email" value={userEmail} onChange={(e) => setUserEmail(e.target.value)} />
                </div>


                {/* --- 수정 불가 항목 (기존과 동일) --- */}
                <div className="form-row readonly">
                    <label>아이디</label>
                    <span>{userId} (수정 불가)</span>
                </div>
                <div className="form-row readonly">
                    <label>생년월일</label>
                    <span>{userBirthday} (수정 불가)</span>
                </div>

                {/* --- (수정) 위치 (L2, L3를 input type="text"로 변경) --- */}
                <div className="form-row location">
                    <label>대표 위치</label>
                    <div className="location-selects">
                        <select value={loc.l1} onChange={(e) => handleLocationChange(1, e.target.value)}>
                            {MOCK_LOCATIONS_L1.map(l => <option key={l} value={l}>{l}</option>)}
                        </select>
                        
                        {/* (수정) select -> input */}
                        <input 
                            type="text" 
                            placeholder="시/군/구 (직접 입력)" 
                            value={loc.l2} 
                            onChange={(e) => handleLocationChange(2, e.target.value)} 
                            disabled={!loc.l1 || loc.l1 === MOCK_LOCATIONS_L1[0]}
                        />
                        <input 
                            type="text" 
                            placeholder="동/읍/면 (직접 입력)" 
                            value={loc.l3} 
                            onChange={(e) => handleLocationChange(3, e.target.value)}
                            disabled={!loc.l1 || loc.l1 === MOCK_LOCATIONS_L1[0]}
                        />
                    </div>
                </div>

                {/* --- 버튼 (기존과 동일) --- */}
                <div className="form-actions">
                    <button type="button" onClick={handleReset} className="reset-btn">초기화</button>
                    <button type="submit" className="submit-btn">수정 완료</button>
                </div>
            </form>
        </div>
    );
};

export default MyPageEdit;