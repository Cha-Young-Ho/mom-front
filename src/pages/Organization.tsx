import React from 'react';
import './Organization.css';

const Organization: React.FC = () => {
  return (
    <div className="organization-page">
      <div className="container">
        <div className="page-header">
          <h1>조직도 및 현황</h1>
          <p>한국미래인적자원개발원의 조직 구성과 현황을 확인하실 수 있습니다</p>
        </div>

        <div className="organization-chart">
          <div className="org-level-1">
            <div className="org-box director">
              <h3>원장</h3>
              <p>한국미래인적자원개발원</p>
            </div>
          </div>

          <div className="org-level-2">
            <div className="org-box department">
              <h4>교육기획부</h4>
              <ul>
                <li>교육과정 기획 및 개발</li>
                <li>교육 프로그램 운영</li>
                <li>교육 품질 관리</li>
              </ul>
            </div>
            
            <div className="org-box department">
              <h4>연구개발부</h4>
              <ul>
                <li>인적자원 연구</li>
                <li>교육 방법론 개발</li>
                <li>데이터 분석 및 활용</li>
              </ul>
            </div>
            
            <div className="org-box department">
              <h4>사업운영부</h4>
              <ul>
                <li>클로벌 융합인재 개발원</li>
                <li>글로벌 융합인재 개발원</li>
                <li>사업 파트너십 관리</li>
              </ul>
            </div>
          </div>

          <div className="org-level-3">
            <div className="org-box team">
              <h5>교육운영팀</h5>
              <p>일반교육, 전문교육 운영</p>
            </div>
            
            <div className="org-box team">
              <h5>연구기획팀</h5>
              <p>연구 기획 및 수행</p>
            </div>
            
            <div className="org-box team">
              <h5>사업관리팀</h5>
              <p>사업 운영 및 관리</p>
            </div>
            
            <div className="org-box team">
              <h5>고객지원팀</h5>
              <p>고객 상담 및 지원</p>
            </div>
          </div>
        </div>

        <div className="organization-stats">
          <h2>현황</h2>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-number">25</div>
              <div className="stat-label">전체 직원 수</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">4</div>
              <div className="stat-label">주요 부서</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">12</div>
              <div className="stat-label">운영 팀</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">2025</div>
              <div className="stat-label">설립 연도</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Organization;
