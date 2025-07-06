import React, { useCallback, useEffect, useState } from 'react';
import { CreatePostRequest, Post } from '../../../services/api';
import { isAdmin } from '../../../utils/auth';
import CategoryFilter from '../CategoryFilter/CategoryFilter';
import PageLayout from '../PageLayout/PageLayout';
import PostForm from '../PostForm/PostForm';
import PostGrid from '../PostGrid/PostGrid';
import PostModal from '../PostModal/PostModal';

interface PostPageProps {
  title: string;
  description: string;
  categoryType: 'news' | 'gallery';
  categories: string[];
  loadPosts: (categories?: string[]) => Promise<{ posts: Post[] }>;
  createPost: (data: CreatePostRequest) => Promise<Post | void>;
  updatePost?: (
    id: string,
    data: Partial<CreatePostRequest>
  ) => Promise<Post | void>;
  deletePost: (id: string) => Promise<void>;
  fallbackPosts: Post[];
  itemsPerPage?: number;
  createButtonText?: string;
  emptyMessage?: string;
  className?: string;
}

const PostPage: React.FC<PostPageProps> = ({
  title,
  description,
  categoryType,
  categories,
  loadPosts,
  createPost,
  deletePost,
  fallbackPosts,
  itemsPerPage = 9,
  createButtonText = '새 게시글 작성',
  emptyMessage = '게시글이 없습니다.',
  className = '',
}) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // 데이터 로드
  const handleLoadPosts = useCallback(async () => {
    try {
      setLoading(true);
      const response = await loadPosts(
        selectedCategories.length > 0 ? selectedCategories : undefined
      );
      setPosts(response.posts);
    } catch (error) {
      console.error('게시글 로드 실패:', error);
      setPosts(fallbackPosts);
    } finally {
      setLoading(false);
    }
  }, [selectedCategories, loadPosts, fallbackPosts]);

  useEffect(() => {
    handleLoadPosts();
  }, [handleLoadPosts]);

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
      await deletePost(id);
      await handleLoadPosts();
      alert('게시글이 삭제되었습니다.');
    } catch (error) {
      console.error('게시글 삭제 실패:', error);
      alert('게시글 삭제에 실패했습니다.');
    }
  };

  // 게시글 생성 핸들러
  const handleCreatePost = async (data: CreatePostRequest) => {
    try {
      await createPost(data);
      await handleLoadPosts();
      alert('게시글이 등록되었습니다.');
    } catch (error) {
      console.error('게시글 등록 실패:', error);
      throw error;
    }
  };

  // 페이지네이션 계산
  const totalPages = Math.ceil(posts.length / itemsPerPage);

  return (
    <PageLayout
      title={title}
      description={description}
      showAdminControls={true}
      onCreateClick={() => setIsCreateModalOpen(true)}
      createButtonText={createButtonText}
      className={className}
    >
      {/* 카테고리 필터 */}
      <CategoryFilter
        categories={categories}
        selectedCategories={selectedCategories}
        onCategoryChange={handleCategoryFilter}
        onClearAll={handleClearCategories}
      />

      {/* 게시글 그리드 */}
      <PostGrid
        posts={posts}
        categoryType={categoryType}
        currentPage={currentPage}
        totalPages={totalPages}
        itemsPerPage={itemsPerPage}
        loading={loading}
        onPostClick={handlePostClick}
        onPostDelete={isAdmin() ? handleDeletePost : undefined}
        onPageChange={setCurrentPage}
        emptyMessage={emptyMessage}
      />

      {/* 상세보기 모달 */}
      <PostModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        post={selectedPost}
        categoryType={categoryType}
      />

      {/* 게시글 작성 모달 */}
      <PostForm
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreatePost}
        type={categoryType}
        categories={categories}
        title={`새 ${title} 작성`}
      />
    </PageLayout>
  );
};

export default PostPage;
