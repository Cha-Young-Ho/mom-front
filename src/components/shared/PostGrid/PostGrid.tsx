import React from 'react';
import { Post } from '../../../services/api';
import Pagination from '../Pagination/Pagination';
import PostCard from '../PostCard/PostCard';
import './PostGrid.css';

interface PostGridProps {
  posts: Post[];
  categoryType: 'news' | 'gallery';
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  loading: boolean;
  onPostClick: (post: Post) => void;
  onPostDelete?: (id: string) => void;
  onPageChange: (page: number) => void;
  className?: string;
  emptyMessage?: string;
}

const PostGrid: React.FC<PostGridProps> = ({
  posts,
  categoryType,
  currentPage,
  totalPages,
  itemsPerPage,
  loading,
  onPostClick,
  onPostDelete,
  onPageChange,
  className = '',
  emptyMessage = '게시글이 없습니다.',
}) => {
  if (loading) {
    return (
      <div className='post-grid-loading'>
        <div className='loading-spinner'></div>
        <p>데이터를 불러오는 중...</p>
      </div>
    );
  }

  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentPosts = posts.slice(startIndex, startIndex + itemsPerPage);

  if (currentPosts.length === 0) {
    return (
      <div className='post-grid-empty'>
        <div className='empty-icon'>📝</div>
        <p>{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className={`post-grid-container ${className}`}>
      <div
        className={`post-grid ${
          categoryType === 'news' ? 'news-grid' : 'gallery-grid'
        }`}
      >
        {currentPosts.map(post => (
          <PostCard
            key={post.id}
            post={post}
            categoryType={categoryType}
            onClick={onPostClick}
            onDelete={onPostDelete}
            className={`${categoryType}-card`}
            showAdminActions={!!onPostDelete}
          />
        ))}
      </div>

      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
          className='post-grid-pagination'
        />
      )}
    </div>
  );
};

export default PostGrid;
