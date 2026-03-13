// src/pages/mypages/MyPageLayout.js

import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import MyPageMenu from './MyPageMenu'; // 1. 왼쪽 메뉴 (다음 단계에서 생성)
import './MyPageLayout.css'; // 2. 레이아웃 전용 CSS

const MyPageLayout = () => {
    return (
        <div className="mypage-layout-container">
            <Header />
            <div className="mypage-content-wrapper">
                <MyPageMenu /> {/* 3. 왼쪽 메뉴 고정 */}
                <main className="mypage-main-content">
                    <Outlet /> {/* 4. (핵심) 이 부분이 MyPageMain.js 등으로 바뀜 */}
                </main>
            </div>
            <Footer />
        </div>
    );
};

export default MyPageLayout;