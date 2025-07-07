import React from 'react';
import { Link } from 'react-router-dom';
import { Post, getCategoryColor } from '../../services/api';
import './ContentSection.css';

interface ContentSectionProps {
  title: string;
  linkPath: string;
  posts?: Post[];
  loading: boolean;
  categories?: string[];
  categoryType: 'news' | 'gallery';
  onCategoryClick?: (category: string) => void;
}

const ContentSection: React.FC<ContentSectionProps> = ({
  title,
  linkPath,
  posts = [],
  loading,
  categories = [],
  categoryType,
  onCategoryClick,
}) => {
  return (
    <div className='content-section'>
      <div className='section-header'>
        <h2>
          <Link
            to={linkPath}
            style={{ textDecoration: 'none', color: 'inherit' }}
          >
            {title}
          </Link>
        </h2>
        <div className='category-tabs'>
          <Link to={linkPath}>
            <button className='category-tab active'>전체</button>
          </Link>
          {(categories || []).slice(0, 3).map(category => (
            <button
              key={category}
              className='category-tab'
              onClick={() => onCategoryClick?.(category)}
            >
              {category}
            </button>
          ))}
          <Link to={linkPath}>
            <button className='category-tab-more'>+</button>
          </Link>
        </div>
      </div>
      <div className='content-list'>
        {loading ? (
          <div className='loading'>데이터를 불러오는 중...</div>
        ) : (
          (posts || []).slice(0, 2).map(post => (
            <Link
              key={post.id}
              to={`${linkPath}/${post.id}`}
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              <div className='content-item'>
                <span
                  className={`item-tag ${getCategoryColor(
                    post.category,
                    categoryType
                  )}`}
                >
                  {post.category}
                </span>
                <div className='item-content'>
                  <h3>{post.title}</h3>
                  <div className='item-meta'>
                    <span className='item-date'>
                      {(() => {
                        let raw = post.created_at || (post as any).date;
                        if (!raw) return '';
                        // microseconds(소수점 이하)와 그 뒤의 모든 문자, Z, +00:00 등 모두 제거
                        raw = raw.replace(/\.[0-9]+([A-Za-z:+-].*)?$/, '');
                        // T를 공백으로, -를 /로
                        let normalized = raw
                          .replace('T', ' ')
                          .replace(/-/g, '/');
                        let date = new Date(normalized);
                        // 파싱 실패 시 YYYY-MM-DD만 추출해서 재시도
                        if (isNaN(date.getTime())) {
                          const match = (
                            post.created_at ||
                            (post as any).date ||
                            ''
                          ).match(/\d{4}-\d{2}-\d{2}/);
                          if (match) {
                            normalized = match[0].replace(/-/g, '/');
                            date = new Date(normalized);
                          }
                        }
                        if (isNaN(date.getTime()))
                          return post.created_at || (post as any).date || '';
                        return date.toLocaleDateString('ko-KR');
                      })()}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
};

export default ContentSection;
