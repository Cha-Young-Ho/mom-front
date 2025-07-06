import React, { useEffect } from 'react';
import './Modal.css';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'small' | 'medium' | 'large';
  className?: string;
  closeOnOverlayClick?: boolean;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'medium',
  className = '',
  closeOnOverlayClick = true,
}) => {
  // Handle escape key press
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && closeOnOverlayClick) {
      onClose();
    }
  };

  return (
    <div
      className='modal-overlay'
      onClick={handleOverlayClick}
      data-testid='modal-overlay'
    >
      <div
        className={`modal-content modal-${size} ${className}`}
        onClick={e => e.stopPropagation()}
        role='dialog'
        data-testid='modal-content'
      >
        {title && (
          <div className='modal-header'>
            <h2>{title}</h2>
            <button
              className='modal-close-btn'
              onClick={onClose}
              aria-label='닫기'
            >
              ×
            </button>
          </div>
        )}

        <div className='modal-body'>{children}</div>
      </div>
    </div>
  );
};

export default Modal;
