import React from 'react';
import { SeoHelmet } from '../../components/SeoHelmet';
import { PostPage } from '../../components/shared';
import { API_CONFIG } from '../../config/api';
import { newsAPI, Post } from '../../services/api';

const News: React.FC = () => {
  // 실패 시 사용할 기본 데이터
  const fallbackPosts: Post[] = [
    {
      id: '1',
      title: '2025년 가족상담 프로그램 운영 안내',
      content:
        '올해 새롭게 시작하는 가족상담 프로그램에 대한 안내입니다. 전문 상담사와 함께하는 맞춤형 상담 서비스를 제공합니다.',
      category: '센터소식',
      created_at: '2025-06-29T10:00:00Z',
      status: 'published',
      image_url: '/images/family-health.svg',
      short_description: '전문 상담사와 함께하는 맞춤형 가족상담 프로그램',
    },
    {
      id: '2',
      title: '센터 창립 5주년 기념행사 개최',
      content: '센터 창립 5주년을 맞아 다양한 기념행사를 개최합니다.',
      category: '행사소식',
      created_at: '2025-06-28T10:00:00Z',
      status: 'published',
      image_url: '/images/health-service.svg',
      short_description: '센터 창립 5주년 기념행사 개최 안내',
    },
    {
      id: '3',
      title: '가족센터 운영시간 변경 안내',
      content: '가족센터 운영시간이 변경됩니다. 이용에 참고해주세요.',
      category: '센터소식',
      created_at: '2025-06-27T10:00:00Z',
      status: 'published',
      short_description: '센터 운영시간 변경 안내',
    },
    {
      id: '4',
      title: '육아 지원 정보 업데이트',
      content: '최신 육아 지원 정보를 업데이트했습니다.',
      category: '생활정보',
      created_at: '2025-06-26T10:00:00Z',
      status: 'published',
      short_description: '육아 지원 정보 업데이트',
    },
    {
      id: '5',
      title: '센터 소식 모음',
      content: '이번 달 센터 주요 소식을 모았습니다.',
      category: '기타',
      created_at: '2025-06-25T10:00:00Z',
      status: 'published',
      short_description: '센터 소식 모음',
    },
  ];

  return (
    <>
      <SeoHelmet
        title='센터소식 - 한국미래인적자원개발원'
        description='센터의 최신 소식과 공지사항을 확인하세요.'
      />
      <PostPage
        title='센터소식'
        description='센터의 다양한 소식과 프로그램 정보를 확인하세요.'
        categoryType='news'
        categories={API_CONFIG.newsCategories}
        loadPosts={newsAPI.getNews}
        createPost={newsAPI.createNews}
        deletePost={newsAPI.deleteNews}
        fallbackPosts={fallbackPosts}
        createButtonText='새 뉴스 작성'
        emptyMessage='뉴스가 없습니다.'
        className='news-page'
      />
    </>
  );
};

export default News;
