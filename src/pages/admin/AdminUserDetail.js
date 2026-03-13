// src/pages/admin/AdminUserDetail.js

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios'; // (1. axios import 추가)
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import './AdminUserDetail.css'; 

// (2. 삭제) mockUserDetail, mockWarnings 삭제

const AdminUserDetail = () => {
    const { userId } = useParams(); // URL에서 userId (e.g., testuser1) 가져오기
    const navigate = useNavigate();

    // (3. 수정) 로딩/에러 및 상세 데이터(DTO) 상태
    const [detailData, setDetailData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showPassword, setShowPassword] = useState(false);

    // (4. 수정) 백엔드 API 호출
    useEffect(() => {
        const fetchUserDetail = async () => {
            try {
                const token = localStorage.getItem('accessToken');
                if (!token) {
                    window.location.href = '/login';
                    return;
                }
                
                // (핵심) /api/admin/user/{userId} API 호출
                const response = await axios.get(`http://localhost:8080/api/admin/user/${userId}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                
                setDetailData(response.data); // (수정) state에 DTO 객체 저장

            } catch (err) {
                console.error("유저 상세 정보 로딩 실패:", err);
                setError(err.message);
                if (err.response && (err.response.status === 401 || err.response.status === 403)) {
                    alert('로그인 세션이 만료되었습니다. 다시 로그인해주세요.');
                    window.location.href = '/login';
                }
            } finally {
                setIsLoading(false);
            }
        };

        fetchUserDetail();
    }, [userId]); // userId가 변경될 때마다 API 다시 호출

    // 5. (기획안) "수정" 핸들러 (임시)
    const handleEditWarning = (warningId) => {
        const warning = detailData.warnings.find(w => w.id === warningId);
        const newComment = prompt("새 코멘트 내용을 입력하세요:", warning.comment);
        if (newComment) {
            // (추후) axios.put(`/api/admin/warning/${warningId}`, { comment: newComment })
            alert(`(임시) 경고 ${warningId}의 코멘트가 수정되었습니다.`);
            // (데이터 갱신 로직)
        }
    };

    // 6. (기획안) "삭제" 핸들러 (임시)
    const handleDeleteWarning = (warningId) => {
        if (window.confirm("이 경고를 삭제하시겠습니까?\n(삭제 시 userWarning 횟수가 갱신됩니다.)")) {
            // (추후) axios.delete(`/api/admin/warning/${warningId}`)
            alert(`(임시) 경고 ${warningId}가 삭제되었습니다.`);
            // (데이터 갱신 로직)
        }
    };

    // --- (로딩 및 에러 처리) ---
    if (isLoading) {
        return <div className="admin-page-container"><div className="admin-content-wrapper"><h1>로딩 중...</h1></div></div>;
    }
    if (error || !detailData) {
        return <div className="admin-page-container"><div className="admin-content-wrapper"><h1 style={{ color: 'red' }}>오류: {error || '사용자 정보를 불러올 수 없습니다.'}</h1></div></div>;
    }

    // (수정) 7. detailData (DTO)에서 데이터 추출
    return (
        <div className="admin-page-container">
            <Header />
            <div className="admin-content-wrapper">
                <h1 className="admin-detail-title">유저 - 상세보기</h1>

                {/* 1. 유저 기본 정보 */}
                <div className="admin-detail-grid user-info">
                    <div className="detail-item label">유저 아이디</div>
                    <div className="detail-item value">{detailData.userId}</div>
                    
                    <div className="detail-item label">유저 이름</div>
                    <div className="detail-item value">{detailData.userName}</div>
                    
                    <div className="detail-item label">닉네임</div>
                    <div className="detail-item value">{detailData.userNickname}</div>

                    <div className="detail-item label">비밀번호</div>
                    <div className="detail-item value password-cell">
                        {/* (수정) DTO에서 받은 숨겨진 비밀번호 표시 */}
                        <span>{showPassword ? "(백엔드 전송 필요)" : detailData.userPassword}</span>
                        <button onClick={() => setShowPassword(!showPassword)}>
                            {showPassword ? "숨김" : "① 위치에 표시"}
                        </button>
                    </div>
                    
                    <div className="detail-item label">전화번호</div>
                    <div className="detail-item value">{detailData.userPhone}</div>
                    
                    <div className="detail-item label">이메일</div>
                    <div className="detail-item value">{detailData.userEmail}</div>

                    <div className="detail-item label">생년월일</div>
                    <div className="detail-item value">{detailData.userBirthday}</div>
                    
                    <div className="detail-item label">대표 위치</div>
                    <div className="detail-item value">{detailData.userLocation}</div>

                    <div className="detail-item label">평점 (userScore)</div>
                    <div className="detail-item value">{detailData.userScore}점</div>
                </div>

                {/* 2. 유저 경고 리스트 */}
                <h2 className="admin-detail-subtitle">
                    {detailData.userNickname}님의 경고 리스트 (총 {detailData.userWarning}건의 신고가 있습니다)
                </h2>

                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>문제 발생 제품ID</th>
                            <th>신고 유저ID</th>
                            <th>비고 (코멘트)</th>
                            <th>수정</th>
                            <th>삭제</th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* (수정) detailData.warnings에서 맵핑 */}
                        {detailData.warnings.map(warning => (
                            <tr key={warning.id}>
                                <td>{warning.productId || "-"}</td>
                                <td>{warning.reporterUserId}</td>
                                <td className="comment-cell">{warning.comment}</td>
                                <td>
                                    <button 
                                        className="edit-btn"
                                        onClick={() => handleEditWarning(warning.id)}
                                    >
                                        수정
                                    </button>
                                </td>
                                <td>
                                    <button 
                                        className="delete-btn"
                                        onClick={() => handleDeleteWarning(warning.id)}
                                    >
                                        삭제
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {detailData.warnings.length === 0 && (
                            <tr>
                                <td colSpan="5" className="no-results">경고 내역이 없습니다.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
                
            </div>
            <Footer />
        </div>
    );
};

export default AdminUserDetail;