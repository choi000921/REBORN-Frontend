// src/pages/admin/AdminProductList.js

import React from 'react';
import { Link } from 'react-router-dom';
import './AdminList.css'; 

// (삭제) mockProducts 삭제

// (유지)
const getStatusKorean = (status) => {
    if (status === 'RESERVED') return '예약 중';
    if (status === 'SOLD_OUT') return '판매 완료';
    return '판매 중';
};

// (수정) 1. props로 'searchResults'를 받음
const AdminProductList = ({ searchResults }) => {
    
    // (수정) 2. state가 아닌 props를 사용
    const products = searchResults || [];

    return (
        <table className="admin-table">
            <thead>
                <tr>
                    <th>제품 아이디</th>
                    <th>등록한 유저 아이디</th>
                    <th>제품명</th>
                    <th>제품 등록일</th>
                    <th>거래 상태</th>
                    <th>관리</th>
                </tr>
            </thead>
            <tbody>
                {/* (수정) 3. products (props)가 비어있는지 확인 */}
                {products.length === 0 ? (
                    <tr>
                        <td colSpan="6" className="no-results">검색 결과가 없습니다.</td>
                    </tr>
                ) : (
                    products.map(product => (
                        <tr key={product.productId}>
                            <td>{product.productId}</td>
                            <td>{product.userId}</td>
                            <td>{product.productName}</td>
                            <td>{new Date(product.postedDate).toLocaleDateString()}</td>
                            <td>{getStatusKorean(product.status)}</td>
                            <td>
                                <Link to={`/admin/product/${product.productId}`} className="detail-link-btn">
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

export default AdminProductList;