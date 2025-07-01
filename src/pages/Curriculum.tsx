import React from 'react';
import './Curriculum.css';

const Curriculum: React.FC = () => {
  return (
    <div className="curriculum-page">
      <div className="container">
        <div className="page-header">
          <h1>취급업무</h1>
          <p>한국미래인적자원개발원에서 수행하는 주요 업무를 소개합니다</p>
        </div>

        <div className="business-areas">
          <div className="business-card">
            <div className="business-icon">📚</div>
            <h3>교육 프로그램 개발</h3>
            <p>미래 인재 양성을 위한 다양한 교육 프로그램을 기획하고 개발합니다.</p>
            <ul>
              <li>직업 능력 개발 프로그램</li>
              <li>디지털 역량 강화 교육</li>
              <li>창업 및 기업가 정신 교육</li>
            </ul>
          </div>

          <div className="business-card">
            <div className="business-icon">🔬</div>
            <h3>연구 및 조사</h3>
            <p>인적자원 개발 분야의 연구와 정책 개발을 수행합니다.</p>
            <ul>
              <li>인적자원 동향 분석</li>
              <li>교육 효과성 연구</li>
              <li>정책 제안 및 컨설팅</li>
            </ul>
          </div>

          <div className="business-card">
            <div className="business-icon">🤝</div>
            <h3>산업체 협력</h3>
            <p>기업과의 협력을 통해 실무 중심의 교육을 제공합니다.</p>
            <ul>
              <li>기업 맞춤형 교육</li>
              <li>산학협력 프로그램</li>
              <li>취업 연계 서비스</li>
            </ul>
          </div>

          <div className="business-card">
            <div className="business-icon">🌐</div>
            <h3>국제 교류</h3>
            <p>글로벌 인재 양성을 위한 국제 교류 활동을 진행합니다.</p>
            <ul>
              <li>해외 교육기관 협력</li>
              <li>국제 인턴십 프로그램</li>
              <li>문화 교류 활동</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Curriculum;
