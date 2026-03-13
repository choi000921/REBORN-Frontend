// src/components/ProductCard.js
import React from 'react';

// 🔥 "몇 분 전 / 몇 시간 전 / 몇 일 전 / 오래 전" 계산 함수
const formatTimeAgo = (dateString) => {
    if (!dateString) return "";

    // "2024-10-30 18:00:00" → "2024-10-30T18:00:00" (파싱 안전하게)
    let fixedDate = dateString;
    if (fixedDate.includes(' ') && !fixedDate.includes('T')) {
        fixedDate = fixedDate.replace(' ', 'T');
    }

    const now = new Date();
    const past = new Date(fixedDate);

    if (isNaN(past.getTime())) return ""; // 파싱 실패 방지

    const diffMs = now - past;
    const diffMin = Math.floor(diffMs / 60000);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);

    if (diffMin < 1) return "방금 전";
    if (diffMin < 60) return `${diffMin}분 전`;
    if (diffHour < 24) return `${diffHour}시간 전`;
    if (diffDay >= 365) return "오래 전";
    return `${diffDay}일 전`;
};

// (중요) 상품 데이터를 'props'로 받아 화면에 그려줌
const ProductCard = ({ product }) => {
    const cardStyle = {
        border: '1px solid #ddd',
        borderRadius: '8px',
        padding: '10px',
        textAlign: 'left'
    };

    const imgStyle = {
        width: '100%',
        height: '200px',
        backgroundColor: '#eee',
        objectFit: 'cover'
    };

    const metaStyle = {
        marginTop: '6px',
        fontSize: '12px',
        color: '#888',
        display: 'flex',
        gap: '4px',
    };

    // 🔥 null/undefined 대비 안전값
    const imageUrl = product.imageUrl || '/productDefault.png';
    const title = product.title ?? product.name ?? '';
    const price = product.price ?? 0;
    const hearts = product.hearts ?? 0;
    const views = product.views ?? 0;

    // Search 쪽이랑 동일한 시간 문자열
    const timeText = product.postedDate ? formatTimeAgo(product.postedDate) : "";

    return (
        <div style={cardStyle}>
            <img
                src={imageUrl}
                alt={title}
                style={imgStyle}
            />
            <h3 style={{ fontSize: '16px', margin: '10px 0 5px 0' }}>
                {title}
            </h3>
            <p style={{ fontSize: '14px', fontWeight: 'bold', margin: '0 0 5px 0' }}>
                {price.toLocaleString()} 원
            </p>

            {/* 메타 정보: 시간 / 조회수 / 리본 수 */}
            <div style={metaStyle}>
                {timeText && <span>{timeText}</span>}
                {timeText && <span>·</span>}
                <span>조회 {views}</span>
                <span>·</span>
                <span>🎀 {hearts}</span>
            </div>
        </div>
    );
};

export default ProductCard;
