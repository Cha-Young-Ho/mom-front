import React from 'react';
import './Footer.css';

const Footer: React.FC = () => {
  return (
    <footer className='footer'>
      <div className='footer-container'>
        <div className='footer-content'>
          <div className='footer-section'>
            <h3>한국미래인적자원개발원</h3>
            <p>미래를 준비하는 전문 교육기관</p>
          </div>

          <div className='footer-section'>
            <h4>연락처</h4>
            <div className='contact-info'>
              <p>📞 전화: 010-8828-4772</p>
              <p>📍 주소: 창원시 성산구 상남로 184번길 27</p>
              <p>대표: 이영진</p>
              <p>사업자등록번호: 603-26-97395</p>
            </div>
          </div>

          <div className='footer-section'>
            <h4>빠른 링크</h4>
            <ul className='footer-links'>
              <li>
                <a href='/'>센터소개</a>
              </li>
              <li>
                <a href='/curriculum'>교육과정</a>
              </li>
              <li>
                <a href='/courses'>교육대상</a>
              </li>
              <li>
                <a href='/gallery'>주요정보</a>
              </li>
              <li>
                <a href='/news'>센터소식</a>
              </li>
            </ul>
          </div>

          <div className='footer-section'>
            <h4>상담 문의</h4>
            <button
              className='footer-kakao-btn'
              onClick={() =>
                window.open('https://open.kakao.com/o/sbo9fqFh', '_blank')
              }
            >
              💬 카카오톡 상담
            </button>
            <p className='operating-hours'>상담 시간: 평일 09:00 - 18:00</p>
          </div>
        </div>

        <div className='footer-bottom'>
          <div className='footer-copyright'>
            <p>&copy; 2024 한국미래인적자원개발원. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
