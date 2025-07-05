import React from 'react';
import { PostPage } from '../../components/shared';
import { API_CONFIG } from '../../config/api';
import { galleryAPI, Post } from '../../services/api';

const Gallery: React.FC = () => {
  // 실패 시 사용할 기본 데이터
  const fallbackPosts: Post[] = [
    {
      id: '1',
      title: '2025년 가족상담 프로그램 신청 안내',
      content:
        '가족상담 프로그램 신청 방법과 절차에 대해 안내해드립니다. 전문 상담사와 함께 가족 간의 소통을 개선하고 화목한 가정을 만들어보세요.',
      category: '공지사항',
      created_at: '2025-06-29T10:00:00Z',
      status: 'published',
      image_url: '/images/family-health.svg',
      short_description: '가족상담 프로그램 신청 양식 및 이용방법 안내',
    },
    {
      id: '2',
      title: '센터 이용 관련 자주 묻는 질문',
      content: '센터 이용 시 자주 문의되는 질문들을 정리했습니다.',
      category: '질문',
      created_at: '2025-06-28T10:00:00Z',
      status: 'published',
      short_description: '센터 이용 관련 FAQ 모음',
    },
    {
      id: '3',
      title: '건강가정지원센터 2025년 사업계획 발표',
      content: '올해 추진할 주요 사업과 프로그램 계획을 발표합니다.',
      category: '참고자료',
      created_at: '2025-06-27T10:00:00Z',
      status: 'published',
      short_description: '2025년 주요 사업 및 프로그램 계획 발표',
    },
  ];

  return (
    <PostPage
      title='주요정보'
      description='센터의 자료와 정보를 확인하세요.'
      categoryType='gallery'
      categories={API_CONFIG.galleryCategories}
      loadPosts={galleryAPI.getGallery}
      createPost={galleryAPI.createGalleryItem}
      deletePost={galleryAPI.deleteGalleryItem}
      fallbackPosts={fallbackPosts}
      createButtonText='새 항목 추가'
      emptyMessage='갤러리 항목이 없습니다.'
      className='gallery-page'
    />
  );
};

export default Gallery;
