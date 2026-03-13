// src/App.js

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';

// 1. 모든 페이지 컴포넌트 import
import MainPage from './pages/MainPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import FindIdPage from './pages/FindIdPage';
import FindPasswordPage from './pages/FindPasswordPage';
import ProductView from './pages/ProductView';
import SearchPage from './pages/SearchPage';
import ProductUploadPage from './pages/ProductUploadPage';

// 2. 마이페이지 컴포넌트 import
import MyPageLayout from './pages/mypages/MyPageLayout';
import MyPageMain from './pages/mypages/MyPageMain';
import MyPageEdit from './pages/mypages/MyPageEdit';
import MyPageSalesList from './pages/mypages/MyPageSalesList'; 
import MyPageSalesDetail from './pages/mypages/MyPageSalesDetail';
import MyPagePurchases from './pages/mypages/MyPagePurchases';
import MyPageWishlist from './pages/mypages/MyPageWishlist';
import MyPageRecent from './pages/mypages/MyPageRecent'; 
import MyPageRibbonsCompare from './pages/mypages/MyPageRibbonsCompare'; 

// 3. 관리자 페이지 컴포넌트 import
import AdminPageMain from './pages/admin/AdminPageMain';
import AdminUserDetail from './pages/admin/AdminUserDetail'; 
import AdminProductDetail from './pages/admin/AdminProductDetail';
// ※ AdminUserList / AdminProductList는 AdminPageMain 내부에서 import해서 쓰는 편이 자연스러워서 여기선 제거

// (추후)
// import ChatPage from './pages/ChatPage';

function App() {
  return (
    <div className="App">
      {/* URL 경로에 따라 알맞은 페이지를 렌더링 */}
      <Routes> 
        {/* --- 1. 일반 경로들 --- */}
        <Route path="/" element={<MainPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/find-id" element={<FindIdPage />} />
        <Route path="/find-password" element={<FindPasswordPage />} />
        <Route path="/product/:productId" element={<ProductView />} /> 
        <Route path="/search" element={<SearchPage />} />
        <Route path="/sell" element={<ProductUploadPage />} />
        {/* <Route path="/chat" element={<ChatPage />} /> */}

        {/* --- 2. 마이페이지 중첩 라우트 --- */}
        <Route path="/mypage" element={<MyPageLayout />}>
          {/* /mypage 기본 경로: 내 정보 */}
          <Route index element={<MyPageMain />} />
          {/* 내 정보 수정 */}
          <Route path="edit" element={<MyPageEdit />} />
          {/* 판매 내역 리스트 + 상세 */}
          <Route path="sales" element={<MyPageSalesList />} />
          <Route path="sales/:productId" element={<MyPageSalesDetail />} />
          {/* 구매 내역 */}
          <Route path="purchases" element={<MyPagePurchases />} />
          {/* 찜한 제품 */}
          <Route path="wishlist" element={<MyPageWishlist />} />
          {/* 최근 본 상품 */}
          <Route path="recent" element={<MyPageRecent />} /> 
          {/* 리본 비교 페이지 */}
          <Route path="ribbonsCompare" element={<MyPageRibbonsCompare />} /> 
        </Route>

        {/* --- 3. 관리자 페이지 --- */}
        <Route path="/admin" element={<AdminPageMain />} />
        {/* 유저 상세보기 */}
        <Route path="/admin/user/:userId" element={<AdminUserDetail />} />
        {/* 제품 상세보기 */}
        <Route path="/admin/product/:productId" element={<AdminProductDetail />} />
      </Routes>
    </div>
  );
}

export default App;
