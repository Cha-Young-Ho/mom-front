import React from 'react';
import { Post, getCategoryColor } from '../../../services/api';
import Modal from '../Modal/Modal';
import './PostModal.css';

interface PostModalProps {
  isOpen: boolean;
  onClose: () => void;
  post: Post | null;
  categoryType: 'news' | 'gallery';
}

const PostModal: React.FC<PostModalProps> = ({
  isOpen,
  onClose,
  post,
  categoryType,
}) => {
  if (!post) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size='large'
      className='post-modal'
    >
      <div className='post-modal-header'>
        <h2>{post.title}</h2>
      </div>
      <div className='post-modal-meta'>
        <span
          className={`category-tag ${getCategoryColor(
            post.category,
            categoryType
          )}`}
        >
          {post.category}
        </span>
        <span className='post-date'>
          {new Date(post.created_at).toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </span>
      </div>
      {post.image_url && (
        <div className='post-modal-image'>
          <img src={post.image_url} alt={post.title} />
        </div>
      )}
      <div className='post-modal-content'>
        <p>{post.content}</p>
      </div>
    </Modal>
  );
};

export default PostModal;
