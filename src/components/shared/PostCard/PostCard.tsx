import React from 'react';
import { getCategoryColor, Post } from '../../../services/api';
import './PostCard.css';

interface PostCardProps {
  post: Post;
  categoryType: 'news' | 'gallery';
  onClick: (post: Post) => void;
  onDelete?: (id: string) => void;
  className?: string;
  showAdminActions?: boolean;
}

const PostCard: React.FC<PostCardProps> = ({
  post,
  categoryType,
  onClick,
  onDelete,
  className = '',
  showAdminActions = false,
}) => {
  const handleCardClick = () => {
    onClick(post);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDelete && window.confirm('정말 삭제하시겠습니까?')) {
      onDelete(post.id);
    }
  };

  return (
    <div
      className={`post-card ${className}`}
      onClick={handleCardClick}
      data-testid='post-card'
    >
      {post.image_url ? (
        <div className='post-card-image'>
          <img src={post.image_url} alt={post.title} />
        </div>
      ) : (
        <div className='post-card-image'>
          <img src='/images/default-post.svg' alt={post.title} />
        </div>
      )}
      <div className='post-card-content'>
        <div className='post-card-header'>
          <span
            className={`category-badge ${getCategoryColor(
              post.category,
              categoryType
            )}`}
          >
            {post.category}
          </span>
          {showAdminActions && onDelete && (
            <button
              className='delete-btn'
              onClick={handleDeleteClick}
              aria-label='게시글 삭제'
            >
              ×
            </button>
          )}
        </div>
        <h3 className='post-card-title'>{post.title}</h3>
        {post.short_description && (
          <p className='post-card-description'>{post.short_description}</p>
        )}
        <div className='post-card-meta'>
          <span>
            {(() => {
              let raw = post.created_at || (post as any).date;
              if (!raw) return '';
              let date = new Date(raw);
              if (isNaN(date.getTime())) {
                let fixed = raw
                  .replace(/([.][0-9]+)?([+-]\d{2}:?\d{2}|Z)?$/, '')
                  .replace('T', ' ')
                  .replace(/-/g, '/');
                date = new Date(fixed);
                if (isNaN(date.getTime())) {
                  const match = raw.match(/\d{4}-\d{2}-\d{2}/);
                  if (match) {
                    date = new Date(match[0].replace(/-/g, '/'));
                  }
                }
              }
              if (isNaN(date.getTime())) return raw;
              return date
                .toLocaleDateString('ko-KR', {
                  year: 'numeric',
                  month: '2-digit',
                  day: '2-digit',
                })
                .replace(/\. /g, '.')
                .replace(/\.$/, '');
            })()}
          </span>
        </div>
      </div>
    </div>
  );
};

export default PostCard;
