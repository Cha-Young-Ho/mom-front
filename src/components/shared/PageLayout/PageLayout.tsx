import React from 'react';
import { isAdmin } from '../../../utils/auth';
import Button from '../Button/Button';
import './PageLayout.css';

interface PageLayoutProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  showAdminControls?: boolean;
  onCreateClick?: () => void;
  createButtonText?: string;
  className?: string;
}

const PageLayout: React.FC<PageLayoutProps> = ({
  title,
  description,
  children,
  showAdminControls = false,
  onCreateClick,
  createButtonText = '새 항목 추가',
  className = '',
}) => {
  return (
    <div className={`page-layout ${className}`}>
      <div className='page-header'>
        <h1>{title}</h1>
        {description && <p>{description}</p>}
      </div>

      {showAdminControls && isAdmin() && onCreateClick && (
        <div className='admin-controls'>
          <Button
            variant='success'
            onClick={onCreateClick}
            className='create-btn'
          >
            {createButtonText}
          </Button>
        </div>
      )}

      <div className='page-content'>{children}</div>
    </div>
  );
};

export default PageLayout;
