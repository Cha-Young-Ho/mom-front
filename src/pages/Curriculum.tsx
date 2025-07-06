import React from 'react';
import './Curriculum.css';

const Curriculum: React.FC = () => {
  return (
    <div className='curriculum-page'>
      <div className='container'>
        <div className='page-header'>
          <h1>취급업무</h1>
          <p>한국미래인적자원개발원에서 수행하는 주요 업무를 소개합니다</p>
        </div>

        <div className='business-areas'>
          <div className='business-card'>
            <div className='business-icon'>📚</div>
            <h3>교육 프로그램 개발</h3>
            <p>
              미래 인재 양성을 위한 다양한 교육 프로그램을 기획하고 개발합니다.
            </p>
            <ul>
              <li>직업 능력 개발 프로그램</li>
              <li>디지털 역량 강화 교육</li>
              <li>창업 및 기업가 정신 교육</li>
            </ul>
          </div>

          <div className='business-card'>
            <div className='business-icon'>🔬</div>
            <h3>연구 및 조사</h3>
            <p>인적자원 개발 분야의 연구와 정책 개발을 수행합니다.</p>
            <ul>
              <li>인적자원 동향 분석</li>
              <li>교육 효과성 연구</li>
              <li>정책 제안 및 컨설팅</li>
            </ul>
          </div>

          <div className='business-card'>
            <div className='business-icon'>🤝</div>
            <h3>산업체 협력</h3>
            <p>기업과의 협력을 통해 실무 중심의 교육을 제공합니다.</p>
            <ul>
              <li>기업 맞춤형 교육</li>
              <li>산학협력 프로그램</li>
              <li>취업 연계 서비스</li>
            </ul>
          </div>

          <div className='business-card'>
            <div className='business-icon'>🌐</div>
            <h3>국제 교류</h3>
            <p>글로벌 인재 양성을 위한 국제 교류 활동을 진행합니다.</p>
            <ul>
              <li>해외 교육기관 협력</li>
              <li>국제 인턴십 프로그램</li>
              <li>문화 교류 활동</li>
            </ul>
          </div>

          <div className='business-card'>
            <div className='business-icon'>💼</div>
            <h3>취업 지원</h3>
            <p>
              교육수료생들의 성공적인 취업을 위한 종합적인 지원을 제공합니다.
            </p>
            <ul>
              <li>취업 상담 및 코칭</li>
              <li>이력서 및 면접 컨설팅</li>
              <li>기업 연계 및 추천</li>
            </ul>
          </div>

          <div className='business-card'>
            <div className='business-icon'>📊</div>
            <h3>성과 관리</h3>
            <p>교육 효과와 성과를 체계적으로 관리하고 평가합니다.</p>
            <ul>
              <li>교육 성과 측정</li>
              <li>수료생 추적 관리</li>
              <li>품질 개선 활동</li>
            </ul>
          </div>
        </div>

        <div className='contact-section'>
          <h2>업무 관련 문의</h2>
          <div className='contact-grid'>
            <div className='contact-item'>
              <h4>📞 대표번호</h4>
              <p>02-1234-5678</p>
            </div>
            <div className='contact-item'>
              <h4>📧 이메일</h4>
              <p>info@hrdi.or.kr</p>
            </div>
            <div className='contact-item'>
              <h4>🏢 본사</h4>
              <p>서울특별시 중구 세종대로 124</p>
            </div>
            <div className='contact-item'>
              <h4>🕒 업무시간</h4>
              <p>평일 09:00 - 18:00</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Curriculum;
