import React, { useCallback, useEffect, useState } from 'react';
import {
  CategoryFilter,
  PostForm,
  PostGrid,
  PostModal,
} from '../../components/shared';
import { API_CONFIG } from '../../config/api';
import { CreatePostRequest, newsAPI, Post } from '../../services/api';
import { isAdmin } from '../../utils/auth';
import './News.css';

const News: React.FC = () => {
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
          ? await newsAPI.getNews(selectedCategories)
          : await newsAPI.getNews();
      setPosts(response.posts);
    } catch (error) {
      console.error('뉴스 로드 실패:', error);
      // 실패 시 기본 데이터 설정
      setPosts([
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
    setCurrentPage(1); // 필터 변경 시 첫 페이지로
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
      await newsAPI.deleteNews(id);
      await loadPosts(); // 삭제 후 목록 새로고침
      alert('게시글이 삭제되었습니다.');
    } catch (error) {
      console.error('게시글 삭제 실패:', error);
      alert('게시글 삭제에 실패했습니다.');
    }
  };

  // 게시글 생성 핸들러
  const handleCreatePost = async (data: CreatePostRequest) => {
    try {
      await newsAPI.createNews(data);
      await loadPosts(); // 생성 후 목록 새로고침
      alert('게시글이 등록되었습니다.');
    } catch (error) {
      console.error('게시글 등록 실패:', error);
      throw error;
    }
  };

  // 페이지네이션 계산
  const totalPages = Math.ceil(posts.length / itemsPerPage);

  return (
    <div className='news'>
      <div className='news-header'>
        <h1>센터소식</h1>
        <p>센터의 다양한 소식과 프로그램 정보를 확인하세요.</p>
      </div>

      {/* 카테고리 필터 */}
      <CategoryFilter
        categories={API_CONFIG.newsCategories}
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
        categoryType='news'
        currentPage={currentPage}
        totalPages={totalPages}
        itemsPerPage={itemsPerPage}
        loading={loading}
        onPostClick={handlePostClick}
        onPostDelete={isAdmin() ? handleDeletePost : undefined}
        onPageChange={setCurrentPage}
        emptyMessage='뉴스가 없습니다.'
      />

      {/* 상세보기 모달 */}
      <PostModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        post={selectedPost}
        categoryType='news'
      />

      {/* 게시글 작성 모달 */}
      <PostForm
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreatePost}
        type='news'
        categories={API_CONFIG.newsCategories}
        title='새 뉴스 작성'
      />
    </div>
  );
};

export default News;
