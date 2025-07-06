import React from 'react';
import './Courses.css';

const Courses: React.FC = () => {
  return (
    <div className='courses-page'>
      <div className='container'>
        <div className='page-header'>
          <h1>교육대상</h1>
          <p>한국미래인적자원개발원의 교육 프로그램 대상자를 안내합니다</p>
        </div>

        <div className='target-groups'>
          <div className='target-card'>
            <div className='target-icon'>👨‍💼</div>
            <h3>직장인</h3>
            <p>업무 역량 강화와 경력 개발을 원하는 직장인을 위한 교육</p>
            <ul>
              <li>업무 스킬 향상 과정</li>
              <li>리더십 개발 프로그램</li>
              <li>디지털 전환 교육</li>
              <li>소통 및 협업 역량 강화</li>
            </ul>
            <div className='target-info'>
              <span className='duration'>교육기간: 3-6개월</span>
              <span className='schedule'>평일 저녁 / 주말</span>
            </div>
          </div>

          <div className='target-card'>
            <div className='target-icon'>🎓</div>
            <h3>취업준비생</h3>
            <p>성공적인 취업을 위한 실무 역량과 취업 스킬 습득</p>
            <ul>
              <li>직무별 전문 교육</li>
              <li>면접 및 자기소개서 작성</li>
              <li>포트폴리오 제작 지원</li>
              <li>기업 멘토링 프로그램</li>
            </ul>
            <div className='target-info'>
              <span className='duration'>교육기간: 4-8개월</span>
              <span className='schedule'>전일제 / 시간제</span>
            </div>
          </div>

          <div className='target-card'>
            <div className='target-icon'>🚀</div>
            <h3>창업희망자</h3>
            <p>성공적인 창업을 위한 기업가 정신과 실무 능력 배양</p>
            <ul>
              <li>사업계획서 작성</li>
              <li>마케팅 및 영업 전략</li>
              <li>자금조달 및 투자유치</li>
              <li>법률 및 세무 기초</li>
            </ul>
            <div className='target-info'>
              <span className='duration'>교육기간: 2-4개월</span>
              <span className='schedule'>주중 / 주말 선택</span>
            </div>
          </div>

          <div className='target-card'>
            <div className='target-icon'>👩‍🔬</div>
            <h3>전문직군</h3>
            <p>전문 분야의 심화 지식과 최신 트렌드 학습</p>
            <ul>
              <li>AI/빅데이터 활용</li>
              <li>디지털 마케팅</li>
              <li>프로젝트 관리</li>
              <li>품질관리 시스템</li>
            </ul>
            <div className='target-info'>
              <span className='duration'>교육기간: 1-3개월</span>
              <span className='schedule'>집중 과정</span>
            </div>
          </div>

          <div className='target-card'>
            <div className='target-icon'>🌟</div>
            <h3>경력전환자</h3>
            <p>새로운 분야로의 성공적인 경력 전환 지원</p>
            <ul>
              <li>적성 및 진로 상담</li>
              <li>신규 분야 기초 교육</li>
              <li>실무 프로젝트 경험</li>
              <li>멘토링 및 네트워킹</li>
            </ul>
            <div className='target-info'>
              <span className='duration'>교육기간: 6-12개월</span>
              <span className='schedule'>맞춤형 일정</span>
            </div>
          </div>

          <div className='target-card'>
            <div className='target-icon'>🎯</div>
            <h3>특수계층</h3>
            <p>다양한 배경의 학습자를 위한 맞춤형 교육 프로그램</p>
            <ul>
              <li>장애인 직업훈련</li>
              <li>북한이탈주민 적응교육</li>
              <li>다문화가족 지원교육</li>
              <li>고령자 재취업 교육</li>
            </ul>
            <div className='target-info'>
              <span className='duration'>교육기간: 개별 상담</span>
              <span className='schedule'>맞춤형 지원</span>
            </div>
          </div>
        </div>

        <div className='application-info'>
          <h2>신청 안내</h2>
          <div className='info-grid'>
            <div className='info-item'>
              <h4>📞 상담 문의</h4>
              <p>교육 상담 및 과정 문의</p>
              <span>02-1234-5678</span>
            </div>
            <div className='info-item'>
              <h4>📧 온라인 신청</h4>
              <p>홈페이지를 통한 온라인 신청</p>
              <span>www.example.com</span>
            </div>
            <div className='info-item'>
              <h4>🏢 방문 상담</h4>
              <p>센터 방문 상담 및 안내</p>
              <span>평일 09:00-18:00</span>
            </div>
            <div className='info-item'>
              <h4>💳 교육비 지원</h4>
              <p>국가지원금 및 할인 혜택</p>
              <span>최대 100% 지원</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Courses;
