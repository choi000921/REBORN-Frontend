// src/pages/mypages/MyPageMenu.js

import React from 'react';
import { NavLink } from 'react-router-dom'; // NavLink: 활성화된 링크 스타일링
import './MyPageMenu.css';

const MyPageMenu = () => {
    return (
        <aside className="mypage-menu">
            <h2>마이페이지</h2>
            <nav>
                {/* NavLink는 현재 경로와 to가 일치하면 'active' 클래스를 자동으로 추가합니다.
                  (end={true}는 /mypage/sales 등에서 /mypage가 활성화되는 것을 방지)
                */}
                <NavLink to="/mypage" end>내 정보</NavLink>
                <NavLink to="/chat">채팅하기</NavLink>
                <NavLink to="/mypage/sales">판매내역</NavLink>
                <NavLink to="/mypage/purchases">구매내역</NavLink>
                <NavLink to="/mypage/wishlist">찜 한 제품</NavLink>
                <NavLink to="/mypage/recent">최근 본 제품</NavLink>
            </nav>
        </aside>
    );
};

export default MyPageMenu;