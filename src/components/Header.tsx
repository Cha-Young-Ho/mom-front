import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Header.css';

const Header: React.FC = () => {
  const location = useLocation();

  const handleKakaoChat = () => {
    // 여기에 카카오톡 상담 링크를 넣어주세요
    // window.open('KAKAO_CHAT_LINK', '_blank');
    console.log('카카오톡 상담 링크를 설정해주세요');
  };

  return (
    <header className="header">
      <div className="header-top">
        <div className="header-info">
          <span>🌈 다양한 가족서비스 정보를 한눈에 × 고부갈등 마음여행 독서일기 3탄</span>
        </div>
        <div className="header-links">
          <span>언어선택</span>
          <span>사이트맵 바로가기</span>
        </div>
      </div>
      
      <div className="header-main">
        <div className="header-container">
          <div className="logo">
            <Link to="/">
              <div className="logo-container">
                <div className="logo-icon">
                  <div className="logo-blocks">
                    <div className="block block-1"></div>
                    <div className="block block-2"></div>
                    <div className="block block-3"></div>
                    <div className="block block-4"></div>
                  </div>
                </div>
                <h1>다문화가정 지원 유정센터</h1>
              </div>
            </Link>
          </div>
          
          <nav className="navigation">
            <Link 
              to="/" 
              className={location.pathname === '/' ? 'active' : ''}
            >
              한국정착정보
            </Link>
            <Link 
              to="/community" 
              className={location.pathname === '/community' ? 'active' : ''}
            >
              가족센터 정보
            </Link>
            <Link to="#" className="nav-link">알림공간</Link>
            <Link to="#" className="nav-link">인식개선</Link>
            <Link to="#" className="nav-link">상담실</Link>
          </nav>
          
          <div className="contact-buttons">
            <button className="contact-btn kakao-btn" onClick={handleKakaoChat}>
              <span className="kakao-icon">💬</span>
              <div className="btn-text">
                <div className="btn-label">카카오톡 상담</div>
                <div className="btn-subtitle">24시간 언제든지</div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
