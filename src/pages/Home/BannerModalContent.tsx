import React from 'react';

interface BannerModalContentProps {
  slideIdx: number;
  image: string;
  content?: string;
}

const bannerSummaries = [
  {
    title: '마스크 착용 캠페인',
    summary:
      '건강한 사회를 위한 올바른 마스크 착용 실천! 센터에서는 마스크 착용의 중요성을 알리고, 올바른 착용법과 생활 속 실천 방법을 안내합니다.',
  },
  {
    title: '센터 안내 팸플릿',
    summary:
      '센터의 다양한 교육·상담 프로그램, 시설, 이용 방법을 한눈에 볼 수 있는 안내 팸플릿입니다. 주요 서비스와 지원 내용을 요약해드립니다.',
  },
  {
    title: '세미나/행사 현장',
    summary:
      '센터에서 진행된 각종 세미나, 행사, 교육 현장의 생생한 모습을 사진과 함께 소개합니다. 다양한 활동과 참여 후기를 확인해보세요.',
  },
  {
    title: '노인케어 전문가 과정',
    summary:
      '노인 관련 직무 역량 향상 및 민간자격 취득 과정입니다. 정서지원, 인지기능 활성화, 사회성 발달 등 다양한 노인케어 실무를 배우고, 심리상담사·웃음코칭지도사·실버책놀이지도사 등 자격증 취득이 가능합니다. 9/4~10/30, 매주 목요일, 총 8회 24시간 진행. 수강료 15만원(교재비 별도). 문의: 055-283-3220',
  },
];

const BannerModalContent: React.FC<BannerModalContentProps> = ({
  slideIdx,
  image,
  content,
}) => {
  const info = bannerSummaries[slideIdx] || bannerSummaries[0];

  // content가 있으면 content를 사용, 없으면 기본 summary 사용
  const displayContent = content || info.summary;

  return (
    <div style={{ padding: '10px 0' }}>
      <h3 style={{ color: '#3ec6b6', fontWeight: 700, marginBottom: 10 }}>
        {info.title}
      </h3>
      <div style={{ fontSize: '1.08rem', lineHeight: 1.7, marginBottom: 20 }}>
        {displayContent}
      </div>
      <div style={{ textAlign: 'center' }}>
        <img
          src={image}
          alt={info.title}
          style={{
            maxWidth: '320px',
            width: '100%',
            borderRadius: 12,
            boxShadow: '0 4px 16px rgba(0,0,0,0.07)',
          }}
        />
      </div>
    </div>
  );
};

export default BannerModalContent;
