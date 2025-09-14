import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { authAPI, isAdmin } from '../utils/auth';
import './Header.css';

const Header: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleKakaoChat = () => {
    window.open('https://open.kakao.com/o/sbo9fqFh', '_blank');
  };

  const handleAdminLogout = () => {
    if (window.confirm('로그아웃 하시겠습니까?')) {
      authAPI.logout();
      navigate('/');
      window.location.reload(); // 상태 갱신을 위해 새로고침
    }
  };

  return (
    <header className='header'>
      <div className='header-top'>
        <div className='header-info'>{/* 기존 안내 메시지 삭제됨 */}</div>
      </div>

      <div className='header-main'>
        <div className='header-container'>
          <div className='logo'>
            <Link to='/'>
              <div className='logo-container'>
                <div className='logo-icon'>
                  <img src='/logo.png' alt='한국미래인적자원개발원 로고' className='logo-image' />
                </div>
                <h1>한국미래인적자원개발원</h1>
              </div>
            </Link>
          </div>
          <nav className='navigation'>
            <Link to='/' className={location.pathname === '/' ? 'active' : ''}>
              센터소개
            </Link>
            <Link
              to='/curriculum'
              className={location.pathname === '/curriculum' ? 'active' : ''}
            >
              교육과정
            </Link>
            <Link
              to='/courses'
              className={location.pathname === '/courses' ? 'active' : ''}
            >
              교육대상
            </Link>
            <Link
              to='/gallery'
              className={location.pathname === '/gallery' ? 'active' : ''}
            >
              주요정보
            </Link>
            <Link
              to='/news'
              className={location.pathname === '/news' ? 'active' : ''}
            >
              센터소식
            </Link>
          </nav>

          <div className='contact-buttons'>
            {isAdmin() ? (
              <div className='admin-controls'>
                <span className='admin-status'>👤 관리자 모드</span>
                <button
                  className='admin-logout-btn'
                  onClick={handleAdminLogout}
                >
                  로그아웃
                </button>
              </div>
            ) : (
              <button
                className='contact-btn kakao-btn'
                onClick={handleKakaoChat}
              >
                <span className='kakao-icon'>💬</span>
                <div className='btn-text'>
                  <div className='btn-label'>카카오톡 상담</div>
                  <div className='btn-subtitle'>24시간 언제든지</div>
                </div>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
