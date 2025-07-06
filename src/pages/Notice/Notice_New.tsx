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
import './Notice.css';

const Notice: React.FC = () => {
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
      console.error('공지사항 로드 실패:', error);
      // 실패 시 기본 데이터 설정
      setPosts([
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
          content:
            '주차장 이용 시간과 요금에 대해 자주 묻는 질문을 정리했습니다.',
          category: '질문',
          created_at: '2025-06-24T10:00:00Z',
          status: 'published',
          short_description: '주차장 이용 안내',
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
    <div className='notice'>
      <div className='notice-header'>
        <h1>공지사항</h1>
        <p>센터의 다양한 소식과 프로그램 정보를 확인하세요.</p>
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
            새 게시글 작성
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
        emptyMessage='공지사항이 없습니다.'
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
        title='새 공지사항 작성'
      />
    </div>
  );
};

export default Notice;
