import React from 'react';

interface BannerModalContentProps {
  slideIdx: number;
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
];

const BannerModalContent: React.FC<BannerModalContentProps> = ({
  slideIdx,
}) => {
  const info = bannerSummaries[slideIdx] || bannerSummaries[0];
  return (
    <div style={{ padding: '10px 0' }}>
      <h3 style={{ color: '#3ec6b6', fontWeight: 700, marginBottom: 10 }}>
        {info.title}
      </h3>
      <div style={{ fontSize: '1.08rem', lineHeight: 1.7 }}>{info.summary}</div>
    </div>
  );
};

export default BannerModalContent;
