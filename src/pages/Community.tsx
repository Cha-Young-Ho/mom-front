import React, { useState } from 'react';
import './Community.css';

interface Post {
  id: number;
  category: string;
  title: string;
  author: string;
  date: string;
  views: number;
  likes: number;
}

const Community: React.FC = () => {
  const [posts] = useState<Post[]>([
    {
      id: 1,
      category: '가족상담',
      title: '청소년 자녀와의 소통 방법에 대해 조언 구합니다',
      author: '김가족',
      date: '2025-06-29',
      views: 124,
      likes: 15
    },
    {
      id: 2,
      category: '교육정보',
      title: '다문화가족 자녀 한국어 교육 프로그램 후기',
      author: '이다문화',
      date: '2025-06-28',
      views: 89,
      likes: 23
    },
    {
      id: 3,
      category: '프로그램후기',
      title: '가족 캠프 참여 후기 - 정말 좋은 경험이었어요',
      author: '박건강',
      date: '2025-06-27',
      views: 156,
      likes: 31
    },
    {
      id: 4,
      category: '생활정보',
      title: '다문화가족 지원 정책 정보 공유합니다',
      author: '정지원',
      date: '2025-06-26',
      views: 234,
      likes: 42
    },
    {
      id: 5,
      category: '생활정보',
      title: '신혼부부 주거 지원 정책 안내',
      author: '최신혼',
      date: '2025-06-25',
      views: 98,
      likes: 18
    },
    {
      id: 6,
      category: '가족상담',
      title: '부부갈등 해결을 위한 상담 프로그램 추천',
      author: '정상담',
      date: '2025-06-24',
      views: 167,
      likes: 27
    }
  ]);

  const [selectedCategory, setSelectedCategory] = useState('전체');
  const categories = ['전체', '가족상담', '교육정보', '프로그램후기', '생활정보'];

  const filteredPosts = selectedCategory === '전체' 
    ? posts 
    : posts.filter(post => post.category === selectedCategory);

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      '가족상담': '#2c5aa0',
      '교육정보': '#e74c3c',
      '프로그램후기': '#28a745',
      '생활정보': '#f39c12'
    };
    return colors[category] || '#95a5a6';
  };

  return (
    <div className="community">
      <div className="container">
        <div className="community-header">
          <h1>가족센터 소통공간</h1>
          <p>가족과 관련된 다양한 정보를 공유하고 소통해보세요</p>
        </div>

        <div className="community-controls">
          <div className="category-tabs">
            {categories.map(category => (
              <button
                key={category}
                className={`category-tab ${selectedCategory === category ? 'active' : ''}`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>
          
          <button className="write-btn">
            ✏️ 글쓰기
          </button>
        </div>

        <div className="posts-table">
          <div className="table-header">
            <div className="col-category">분류</div>
            <div className="col-title">제목</div>
            <div className="col-author">작성자</div>
            <div className="col-date">날짜</div>
            <div className="col-views">조회</div>
            <div className="col-likes">좋아요</div>
          </div>
          
          <div className="table-body">
            {filteredPosts.map(post => (
              <div key={post.id} className="table-row">
                <div className="col-category">
                  <span 
                    className="category-badge"
                    style={{ backgroundColor: getCategoryColor(post.category) }}
                  >
                    {post.category}
                  </span>
                </div>
                <div className="col-title">
                  <a href={`/community/post/${post.id}`} className="post-title">
                    {post.title}
                  </a>
                </div>
                <div className="col-author">{post.author}</div>
                <div className="col-date">{post.date}</div>
                <div className="col-views">{post.views}</div>
                <div className="col-likes">❤️ {post.likes}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="pagination">
          <button className="page-btn">‹ 이전</button>
          <button className="page-btn active">1</button>
          <button className="page-btn">2</button>
          <button className="page-btn">3</button>
          <button className="page-btn">다음 ›</button>
        </div>
      </div>
    </div>
  );
};

export default Community;
