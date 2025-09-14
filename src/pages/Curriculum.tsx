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

const certificateSummaries = [
  {
    name: '노인심리상담사',
    summary: (
      <div style={{ marginBottom: 32 }}>
        <h4>노인심리상담사</h4>
        <div style={{ color: '#444', fontSize: '1.05rem', marginBottom: 8 }}>
          <b style={{ color: '#3ec6b6' }}>노인의 마음을 읽는 전문가!</b> <br />
          노인의 심리적·정서적 문제를 이해하고 상담을 통해 <b>정서적 안정</b>을
          선물합니다.
          <br />
          <span style={{ color: '#3ec6b6', fontWeight: 600 }}>
            노인복지관, 요양시설, 사회복지기관
          </span>{' '}
          등에서 활약하며, 따뜻한 공감과 전문 상담으로 노인분들의 삶에 활력을
          더합니다.
        </div>
        <ul>
          <li>
            <b>다양한 상담기법</b> 습득: 노인 심리상담, 가족상담, 집단상담 등
          </li>
          <li>
            <b>활동처</b>: 노인복지관, 요양원, 사회복지관 등
          </li>
          <li>
            <b>진출 직업</b>: 노인상담사, 사회복지사, 복지시설 프로그램 운영자
            등
          </li>
        </ul>
      </div>
    ),
  },
  {
    name: '웃음코칭지도사',
    summary: (
      <div style={{ marginBottom: 32 }}>
        <h4>웃음코칭지도사</h4>
        <div style={{ color: '#444', fontSize: '1.05rem', marginBottom: 8 }}>
          <b style={{ color: '#3ec6b6' }}>웃음은 최고의 명약!</b> <br />
          웃음치료와 긍정적 정서 함양을 위한 <b>재미있고 유쾌한 프로그램</b>을
          기획·운영합니다.
          <br />
          <span style={{ color: '#3ec6b6', fontWeight: 600 }}>
            노인, 성인, 아동
          </span>{' '}
          등 다양한 계층을 대상으로 <b>웃음치료 강의</b>와 워크숍을 진행하며,
          모두의 얼굴에 미소를 피웁니다.
        </div>
        <ul>
          <li>
            <b>웃음치료 이론·실습</b>, 긍정심리 코칭법 습득
          </li>
          <li>
            <b>활동처</b>: 복지관, 병원, 평생교육기관, 기업 등
          </li>
          <li>
            <b>진출 직업</b>: 웃음치료사, 건강강사, 복지프로그램 강사 등
          </li>
        </ul>
      </div>
    ),
  },
  {
    name: '한지공예지도사',
    summary: (
      <div style={{ marginBottom: 32 }}>
        <h4>한지공예지도사</h4>
        <div style={{ color: '#444', fontSize: '1.05rem', marginBottom: 8 }}>
          <b style={{ color: '#3ec6b6' }}>전통과 창의의 만남!</b> <br />
          전통 한지공예 기법으로 <b>아름다운 공예품</b>을 만들고,{' '}
          <span style={{ color: '#3ec6b6', fontWeight: 600 }}>
            교육·체험 프로그램
          </span>
          을 운영하는 전문가입니다.
          <br />
          노인 여가·치유 프로그램, 학교, 문화센터 등에서 <b>손끝의 예술</b>을
          전파합니다.
        </div>
        <ul>
          <li>
            <b>한지공예 실습</b>, 창작 및 지도법 습득
          </li>
          <li>
            <b>활동처</b>: 문화센터, 복지관, 평생교육기관 등
          </li>
          <li>
            <b>진출 직업</b>: 공예강사, 문화예술교육사, 체험프로그램 운영자 등
          </li>
        </ul>
      </div>
    ),
  },
  {
    name: '실버책놀이지도사',
    summary: (
      <div style={{ marginBottom: 32 }}>
        <h4>실버책놀이지도사</h4>
        <div style={{ color: '#444', fontSize: '1.05rem', marginBottom: 8 }}>
          <b style={{ color: '#3ec6b6' }}>책과 함께하는 두뇌운동!</b> <br />
          노인 대상 <b>책놀이 프로그램</b>을 기획·운영하여{' '}
          <span style={{ color: '#3ec6b6', fontWeight: 600 }}>
            인지·정서 활성화
          </span>
          와 <b>사회성 증진</b>을 지원합니다.
          <br />
          복지관, 도서관, 평생교육기관 등에서 <b>책과 놀이의 즐거움</b>을
          전합니다.
        </div>
        <ul>
          <li>
            <b>책놀이 프로그램 기획</b>, 독서치료, 인지활동 지도법 습득
          </li>
          <li>
            <b>활동처</b>: 복지관, 도서관, 평생교육기관 등
          </li>
          <li>
            <b>진출 직업</b>: 책놀이강사, 독서치료사, 인지활동 지도사 등
          </li>
        </ul>
      </div>
    ),
  },
  {
    name: '노인돌봄생활지원사',
    summary: (
      <div style={{ marginBottom: 32 }}>
        <h4>노인돌봄생활지원사</h4>
        <div style={{ color: '#444', fontSize: '1.05rem', marginBottom: 8 }}>
          <b style={{ color: '#3ec6b6' }}>노인의 든든한 동반자!</b> <br />
          노인의 <b>일상생활 지원</b>, 정서적 교류, 건강관리, 사회참여 활동 등을
          돕는{' '}
          <span style={{ color: '#3ec6b6', fontWeight: 600 }}>돌봄 전문가</span>
          입니다.
          <br />
          방문요양, 재가복지, 복지시설 등에서 <b>따뜻한 손길</b>로 노인분들의
          삶을 지켜줍니다.
        </div>
        <ul>
          <li>
            <b>노인 돌봄 실무</b>, 건강관리, 생활지원 서비스 습득
          </li>
          <li>
            <b>활동처</b>: 방문요양센터, 재가복지센터, 복지시설 등
          </li>
          <li>
            <b>진출 직업</b>: 요양보호사, 생활지원사, 사회복지사 등
          </li>
        </ul>
      </div>
    ),
  },
  {
    name: '독서지도사',
    summary: (
      <div style={{ marginBottom: 32 }}>
        <h4>독서지도사</h4>
        <div style={{ color: '#444', fontSize: '1.05rem', marginBottom: 8 }}>
          <b style={{ color: '#3ec6b6' }}>독서의 즐거움을 전하는 전문가!</b> <br />
          아동과 청소년의 <b>논리적 사고력, 창의적 표현력, 의사소통 능력</b>을 향상시키기 위해 
          독서 훈련과 올바른 독서 습관 형성에 관한 지도를 합니다.
          <br />
          <span style={{ color: '#3ec6b6', fontWeight: 600 }}>
            도서관, 학교, 평생교육기관, 문화센터
          </span>{' '}
          등에서 <b>독서교육 프로그램</b>을 운영하며, 독서를 통한 인성교육과 학습능력 향상을 지원합니다.
        </div>
        <ul>
          <li>
            <b>독서지도 이론·실습</b>, 연령별 독서프로그램 기획법 습득
          </li>
          <li>
            <b>활동처</b>: 도서관, 학교, 평생교육기관, 문화센터, 독서실 등
          </li>
          <li>
            <b>진출 직업</b>: 독서지도사, 도서관사서, 독서교육강사, 학습지도사 등
          </li>
        </ul>
      </div>
    ),
  },
  {
    name: '병원 동행 매니저',
    summary: (
      <div style={{ marginBottom: 32 }}>
        <h4>병원 동행 매니저</h4>
        <div style={{ color: '#444', fontSize: '1.05rem', marginBottom: 8 }}>
          <b style={{ color: '#3ec6b6' }}>환자의 든든한 의료 파트너!</b> <br />
          혼자서 병원 방문이 어려운 환자들을 위해 <b>진료 예약, 동행, 수납, 약 수령, 귀가 지원</b> 등 
          전반적인 의료 이용을 돕는 전문 인력입니다.
          <br />
          <span style={{ color: '#3ec6b6', fontWeight: 600 }}>
            병원, 요양시설, 지자체, 의료기관
          </span>{' '}
          등에서 활동하며, 환자와 의료진 간의 원활한 소통을 지원하고 <b>안전한 진료 환경</b>을 조성합니다.
        </div>
        <ul>
          <li>
            <b>병원 예약 및 접수 지원</b>, 의료 정보 전달, 검사 및 치료 과정 동행
          </li>
          <li>
            <b>활동처</b>: 병원, 요양시설, 지자체, 의료기관, 방문의료센터 등
          </li>
          <li>
            <b>진출 직업</b>: 병원 동행 매니저, 의료 코디네이터, 환자 상담사, 의료 지원사 등
          </li>
        </ul>
      </div>
    ),
  },
];

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
        {certificateSummaries.map(cert => (
          <li
            key={cert.name}
            style={{
              color: '#3ec6b6',
              fontWeight: 600,
              marginBottom: 6,
            }}
          >
            {cert.name}
          </li>
        ))}
      </ul>
    ),
    detail: certificateSummaries.map(cert => cert.summary),
  },
];

const Curriculum: React.FC = () => {
  const [modalIdx, setModalIdx] = useState<number | null>(null);

  return (
    <div className='curriculum-page'>
      <div className='container'>
        <div className='page-header'>
          <h1 className='curriculum-title'>교육과정</h1>
        </div>
        <div className='business-areas'>
          {curriculumList.map((item, idx) => (
            <div
              className='business-card pretty-card'
              key={item.title}
              onClick={() => setModalIdx(idx)}
            >
              <div className='card-icon'>{item.icon}</div>
              <h3 className='card-title'>{item.title}</h3>
              <div className='card-desc'>{item.desc}</div>
            </div>
          ))}
        </div>
      </div>
      <Modal
        isOpen={modalIdx !== null}
        onClose={() => setModalIdx(null)}
        title={modalIdx !== null ? curriculumList[modalIdx].title : ''}
      >
        <div
          className={`curriculum-modal-content${
            modalIdx === 3 ? ' cert-list-modal' : ''
          }`}
        >
          {modalIdx !== null &&
          Array.isArray(curriculumList[modalIdx].detail) ? (
            <div className='cert-list'>
              {(curriculumList[modalIdx].detail as React.ReactNode[]).map(
                (summary, i) => (
                  <div className='cert-card' key={i}>
                    {summary}
                  </div>
                )
              )}
            </div>
          ) : modalIdx === 2 ? (
            <span
              dangerouslySetInnerHTML={{
                __html: curriculumList[modalIdx].detail as string,
              }}
            />
          ) : modalIdx !== null &&
            typeof curriculumList[modalIdx].detail === 'string' ? (
            <div className='modal-desc'>{curriculumList[modalIdx].detail}</div>
          ) : null}
        </div>
      </Modal>
    </div>
  );
};

export default Curriculum;
