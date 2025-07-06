import React from 'react';
import { PostPage } from '../../components/shared';
import { API_CONFIG } from '../../config/api';
import { galleryAPI, Post } from '../../services/api';

const Notice: React.FC = () => {
  // 실패 시 사용할 기본 데이터
  const fallbackPosts: Post[] = [
    {
      id: '1',
      title: '센터 운영 시간 변경 안내',
      content:
        '2025년 7월부터 센터 운영 시간이 변경됩니다. 평일 09:00-18:00, 토요일 09:00-12:00로 운영됩니다.',
      category: '공지사항',
      created_at: '2025-06-29T10:00:00Z',
      status: 'published',
      short_description: '센터 운영 시간 변경 안내',
    },
    {
      id: '2',
      title: '가족상담 신청서 다운로드',
      content: '가족상담 신청서를 다운로드하여 작성 후 제출해주세요.',
      category: '참고자료',
      created_at: '2025-06-28T10:00:00Z',
      status: 'published',
      short_description: '가족상담 신청서 양식 다운로드',
    },
    {
      id: '3',
      title: '주차장 이용 관련 문의',
      content: '주차장 이용 시간과 요금에 대해 자주 묻는 질문을 정리했습니다.',
      category: '질문',
      created_at: '2025-06-24T10:00:00Z',
      status: 'published',
      short_description: '주차장 이용 안내',
    },
  ];

  return (
    <PostPage
      title='공지사항'
      description='센터의 다양한 소식과 프로그램 정보를 확인하세요.'
      categoryType='gallery'
      categories={API_CONFIG.galleryCategories}
      loadPosts={galleryAPI.getGallery}
      createPost={galleryAPI.createGalleryItem}
      deletePost={galleryAPI.deleteGalleryItem}
      fallbackPosts={fallbackPosts}
      createButtonText='새 공지사항 작성'
      emptyMessage='공지사항이 없습니다.'
      className='notice-page'
    />
  );
};

export default Notice;
