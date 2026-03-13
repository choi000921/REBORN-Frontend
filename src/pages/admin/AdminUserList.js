// src/pages/admin/AdminUserList.js

import React from 'react';
import { Link } from 'react-router-dom';
import './AdminList.css'; 

// (삭제) mockUsers 삭제

// (수정) 1. props로 'searchResults'를 받음
const AdminUserList = ({ searchResults }) => {
    
    // (수정) 2. state가 아닌 props를 사용
    const users = searchResults || [];

    return (
        <table className="admin-table">
            <thead>
                <tr>
                    <th>유저 아이디</th>
                    <th>유저 이름</th>
                    <th>유저 닉네임</th>
                    <th>관리</th>
                </tr>
            </thead>
            <tbody>
                {/* (수정) 3. users (props)가 비어있는지 확인 */}
                {users.length === 0 ? (
                    <tr>
                        <td colSpan="4" className="no-results">검색 결과가 없습니다.</td>
                    </tr>
                ) : (
                    users.map(user => (
                        <tr key={user.userId}>
                            <td>{user.userId}</td>
                            <td>{user.userName}</td>
                            <td>{user.userNickname}</td>
                            <td>
                                <Link to={`/admin/user/${user.userId}`} className="detail-link-btn">
                                    상세보기
                                </Link>
                            </td>
                        </tr>
                    ))
                )}
            </tbody>
        </table>
    );
};

export default AdminUserList;