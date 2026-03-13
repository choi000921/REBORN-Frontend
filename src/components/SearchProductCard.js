// src/components/SearchProductCard.js

import React from 'react';
import { Link } from 'react-router-dom';
import './SearchProductCard.css'; // 전용 CSS

// 🔥 "몇 분 전 / 몇 시간 전 / 몇 일 전 / 오래 전" 계산 함수
const formatTimeAgo = (dateString) => {
    if (!dateString) return "";

    let fixedDate = dateString;
    // "2024-10-30 18:00:00" → "2024-10-30T18:00:00" (파싱 안전하게)
    if (fixedDate.includes(" ") && !fixedDate.includes("T")) {
        fixedDate = fixedDate.replace(" ", "T");
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

const SearchProductCard = ({
    product,
    isComparePage = false,
    disableLink = false, // 🔥 부모에서 Link로 감쌀 때 true로 사용
}) => {
    // 🔒 안전한 기본값 처리
    const name = product.name ?? product.title ?? "";
    const price = product.price ?? 0;
    const imageUrl = product.imageUrl || '/productDefault.png';
    const views = product.views ?? 0;
    const ribbons = product.ribbons ?? product.hearts ?? 0;
    const timeText = product.postedDate ? formatTimeAgo(product.postedDate) : "";

    const cardContent = (
        <>
            <img
                src={imageUrl}
                alt={name}
                className="search-card-image"
            />
            <div className="search-card-info">
                <h3 className="search-card-name">{name}</h3>

                <p className="search-card-price">
                    {price.toLocaleString()}원
                </p>

                <div className="search-card-meta">
                    {timeText && <span>{timeText}</span>}
                    {timeText && <span className="divider">·</span>}
                    <span>조회 {views}</span>
                    {typeof ribbons === 'number' && (
                        <>
                            <span className="divider">·</span>
                            <span>🎀 {ribbons}</span>
                        </>
                    )}
                </div>
            </div>
        </>
    );

    // 🔧 isComparePage거나 disableLink면 <div>, 아니면 <Link>
    const Wrapper = (!isComparePage && !disableLink) ? Link : 'div';
    const wrapperProps =
        (!isComparePage && !disableLink)
            ? { to: `/product/${product.id}`, className: 'search-card-link-wrapper' }
            : { className: 'search-card-link-wrapper' };

    return (
        <div className="search-card">
            <Wrapper {...wrapperProps}>
                {cardContent}
            </Wrapper>
        </div>
    );
};

export default SearchProductCard;
