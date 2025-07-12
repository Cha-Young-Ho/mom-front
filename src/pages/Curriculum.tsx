import React, { useState } from 'react';
import Modal from '../components/shared/Modal/Modal';
import './Curriculum.css';

const coachingDetail = `
<strong style="color:#3ec6b6;font-size:1.08rem;">대상</strong><br />
<span style="font-size:1rem;">리턴특색을 통해 새로운 경력을 형성하고 취업을 준비하고자 하는 경력단절여성</span>
<hr style="margin:18px 0 18px 0;" />
<div style="display:flex;flex-direction:column;gap:18px;">
  <div>
    <strong style="color:#3ec6b6;">1일차 자기이해</strong>
    <ul style="margin:6px 0 0 18px;padding:0;line-height:1.7;font-size:1rem;">
      <li>프로그램 소개 및 내용 설명</li>
      <li>레크리에이션을 통한 집단내의 친밀감 형성</li>
      <li>자기소개 및 일의 의미 파악하기</li>
      <li>성격검사를 통한 자신과 타인의 이해</li>
    </ul>
  </div>
  <div>
    <strong style="color:#3ec6b6;">2일차 자기분석</strong>
    <ul style="margin:6px 0 0 18px;padding:0;line-height:1.7;font-size:1rem;">
      <li>일의 경험 나누기</li>
      <li>나의 진로계획 세우기</li>
      <li>여성 고용시장 파악</li>
    </ul>
  </div>
  <div>
    <strong style="color:#3ec6b6;">3일차 직종탐색 및 진로 계획 설정</strong>
    <ul style="margin:6px 0 0 18px;padding:0;line-height:1.7;font-size:1rem;">
      <li>여성유망직종 알아보기</li>
      <li>직업카드를 활용한 직업 탐색</li>
      <li>나의 재취업 준비도 평가하기</li>
    </ul>
  </div>
  <div>
    <strong style="color:#3ec6b6;">4일차 구직전략</strong>
    <ul style="margin:6px 0 0 18px;padding:0;line-height:1.7;font-size:1rem;">
      <li>강점 역량 파악</li>
      <li>효과적인 이력서 작성법</li>
      <li>효과적인 자기소개서 작성법</li>
    </ul>
  </div>
  <div>
    <strong style="color:#3ec6b6;">5일차 모의면접 및 도전</strong>
    <ul style="margin:6px 0 0 18px;padding:0;line-height:1.7;font-size:1rem;">
      <li>이미지 메이킹을 통한 자신감 상승</li>
      <li>면접 전략 습득</li>
      <li>모의면접을 통한 면접 코칭</li>
      <li>수료식 및 취업에 대한 다짐</li>
    </ul>
  </div>
</div>
`;

const curriculumList = [
  {
    icon: <span className='business-icon'>👤</span>,
    title: '평생교육 강사양성',
    desc: '평생교육 현장에서 전문 강사로 활동할 수 있도록 체계적인 교육과 실습을 제공합니다.',
    detail:
      '평생교육 강사양성 과정 상세 안내입니다. (여기에 상세 커리큘럼, 지원자격, 교육기간 등 구체 내용 추가 가능)',
  },
  {
    icon: <span className='business-icon'>🗂️</span>,
    title: '직업개발교육',
    desc: '다양한 직업군에 맞춘 실무 중심의 교육과정으로 취업 경쟁력을 높입니다.',
    detail:
      '직업개발교육 과정 상세 안내입니다. (여기에 상세 커리큘럼, 지원자격, 교육기간 등 구체 내용 추가 가능)',
  },
  {
    icon: <span className='business-icon'>🔗</span>,
    title: '취업코칭 프로그램',
    desc: '취업 준비생을 위한 맞춤형 코칭과 실전 취업 전략을 지원합니다.',
    detail: coachingDetail,
  },
  {
    icon: <span className='business-icon'>📄</span>,
    title: '민간자격증 발급',
    desc: (
      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        <li>노인심리상담사</li>
        <li>웃음코칭지도사</li>
        <li>한지공예지도사</li>
        <li>실버책놀이지도사</li>
        <li>노인돌봄생활지원사</li>
      </ul>
    ),
    detail:
      '민간자격증 발급 과정 상세 안내입니다. (각 자격증별 상세 설명, 발급 절차 등 구체 내용 추가 가능)',
  },
];

const Curriculum: React.FC = () => {
  const [modalIdx, setModalIdx] = useState<number | null>(null);

  return (
    <div className='curriculum-page'>
      <div className='container'>
        <div className='page-header'>
          <h1>교육과정</h1>
        </div>
        <div className='business-areas'>
          {curriculumList.map((item, idx) => (
            <div
              className='business-card'
              key={item.title}
              onClick={() => setModalIdx(idx)}
              style={{ cursor: 'pointer' }}
            >
              {item.icon}
              <h3>{item.title}</h3>
              <p>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
      <Modal
        isOpen={modalIdx !== null}
        onClose={() => setModalIdx(null)}
        title={modalIdx !== null ? curriculumList[modalIdx].title : ''}
      >
        <div style={{ whiteSpace: 'pre-line' }}>
          {modalIdx !== null &&
            (modalIdx === 2 ? (
              <span
                dangerouslySetInnerHTML={{
                  __html: curriculumList[modalIdx].detail as string,
                }}
              />
            ) : (
              curriculumList[modalIdx].detail
            ))}
        </div>
      </Modal>
    </div>
  );
};

export default Curriculum;
