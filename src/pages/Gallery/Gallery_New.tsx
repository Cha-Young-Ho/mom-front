import React, { useCallback, useEffect, useState } from 'react';
import {
  CategoryFilter,
  PostForm,
  PostGrid,
  PostModal,
} from '../../components/shared';
import { API_CONFIG } from '../../config/api';
import { CreatePostRequest, galleryAPI, Post } from '../../services/api';
import { isAdmin } from '../../utils/auth';
import './Gallery.css';

const Gallery: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const itemsPerPage = 9;

  // 데이터 로드
  const loadPosts = useCallback(async () => {
    try {
      setLoading(true);
      const response =
        selectedCategories.length > 0
          ? await galleryAPI.getGallery(selectedCategories)
          : await galleryAPI.getGallery();
      setPosts(response.posts);
    } catch (error) {
      console.error('갤러리 로드 실패:', error);
      // 실패 시 기본 데이터 설정
      setPosts([
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
      ]);
    } finally {
      setLoading(false);
    }
  }, [selectedCategories]);

  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  // 카테고리 필터 핸들러
  const handleCategoryFilter = (categories: string[]) => {
    setSelectedCategories(categories);
    setCurrentPage(1);
  };

  const handleClearCategories = () => {
    setSelectedCategories([]);
    setCurrentPage(1);
  };

  // 게시글 클릭 핸들러
  const handlePostClick = (post: Post) => {
    setSelectedPost(post);
    setIsModalOpen(true);
  };

  // 게시글 삭제 핸들러
  const handleDeletePost = async (id: string) => {
    try {
      await galleryAPI.deleteGalleryItem(id);
      await loadPosts();
      alert('게시글이 삭제되었습니다.');
    } catch (error) {
      console.error('게시글 삭제 실패:', error);
      alert('게시글 삭제에 실패했습니다.');
    }
  };

  // 게시글 생성 핸들러
  const handleCreatePost = async (data: CreatePostRequest) => {
    try {
      await galleryAPI.createGalleryItem(data);
      await loadPosts();
      alert('게시글이 등록되었습니다.');
    } catch (error) {
      console.error('게시글 등록 실패:', error);
      throw error;
    }
  };

  // 페이지네이션 계산
  const totalPages = Math.ceil(posts.length / itemsPerPage);

  return (
    <div className='gallery'>
      <div className='gallery-header'>
        <h1>주요정보</h1>
        <p>센터의 자료와 정보를 확인하세요.</p>
      </div>

      {/* 카테고리 필터 */}
      <CategoryFilter
        categories={API_CONFIG.galleryCategories}
        selectedCategories={selectedCategories}
        onCategoryChange={handleCategoryFilter}
        onClearAll={handleClearCategories}
      />

      {/* 관리자 컨트롤 */}
      {isAdmin() && (
        <div className='admin-controls'>
          <button
            className='admin-btn create'
            onClick={() => setIsCreateModalOpen(true)}
          >
            새 항목 추가
          </button>
        </div>
      )}

      {/* 게시글 그리드 */}
      <PostGrid
        posts={posts}
        categoryType='gallery'
        currentPage={currentPage}
        totalPages={totalPages}
        itemsPerPage={itemsPerPage}
        loading={loading}
        onPostClick={handlePostClick}
        onPostDelete={isAdmin() ? handleDeletePost : undefined}
        onPageChange={setCurrentPage}
        emptyMessage='갤러리 항목이 없습니다.'
      />

      {/* 상세보기 모달 */}
      <PostModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        post={selectedPost}
        categoryType='gallery'
      />

      {/* 게시글 작성 모달 */}
      <PostForm
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreatePost}
        type='gallery'
        categories={API_CONFIG.galleryCategories}
        title='새 갤러리 항목 추가'
      />
    </div>
  );
};

export default Gallery;
