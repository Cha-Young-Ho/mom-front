import React, { useState } from 'react';
import './Gallery.css';

interface GalleryItem {
  id: number;
  category: string;
  title: string;
  author: string;
  date: string;
  views: number;
  likes: number;
}

const Gallery: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const galleryData: GalleryItem[] = [
    {
      id: 1,
      category: '교육',
      title: '청소년 자녀와의 소통 방법에 대해 조언 구합니다',
      author: '김가족',
      date: '2025-06-29',
      views: 124,
      likes: 15,
    },
    {
      id: 2,
      category: '교육정보',
      title: '다문화가족 자녀 한국어 교육 프로그램 후기',
      author: '이다문화',
      date: '2025-06-28',
      views: 89,
      likes: 23,
    },
    {
      id: 3,
      category: '프로그램후기',
      title: '가족 캠프 참여 후기 - 정말 좋은 경험이었어요',
      author: '박건강',
      date: '2025-06-27',
      views: 156,
      likes: 31,
    },
    {
      id: 4,
      category: '생활정보',
      title: '다문화가족 지원 정책 정보 공유합니다',
      author: '정지원',
      date: '2025-06-26',
      views: 234,
      likes: 42,
    },
    {
      id: 5,
      category: '생활정보',
      title: '신혼부부 주거 지원 정책 안내',
      author: '최신혼',
      date: '2025-06-25',
      views: 98,
      likes: 18,
    },
    {
      id: 6,
      category: '교육',
      title: '부부갈등 해결을 위한 상담 프로그램 추천',
      author: '정상담',
      date: '2025-06-24',
      views: 167,
      likes: 27,
    },
    {
      id: 7,
      category: '교육정보',
      title: '아이와 함께하는 독서 활동 아이디어',
      author: '김독서',
      date: '2025-06-23',
      views: 143,
      likes: 35,
    },
    {
      id: 8,
      category: '프로그램후기',
      title: '가족 요리교실 참여 후기',
      author: '이요리',
      date: '2025-06-22',
      views: 112,
      likes: 22,
    },
    {
      id: 9,
      category: '생활정보',
      title: '가족 건강검진 정보 및 예약 방법',
      author: '박건강',
      date: '2025-06-21',
      views: 189,
      likes: 28,
    },
    {
      id: 10,
      category: '교육',
      title: '사춘기 자녀 양육에 대한 고민',
      author: '최부모',
      date: '2025-06-20',
      views: 176,
      likes: 19,
    },
    {
      id: 11,
      category: '교육정보',
      title: '온라인 가족 상담 프로그램 안내',
      author: '윤상담',
      date: '2025-06-19',
      views: 145,
      likes: 26,
    },
    {
      id: 12,
      category: '프로그램후기',
      title: '부모-자녀 소통 워크숍 참여 후기',
      author: '장소통',
      date: '2025-06-18',
      views: 134,
      likes: 33,
    },
    {
      id: 13,
      category: '생활정보',
      title: '가족여행 계획 세우기 팁',
      author: '노여행',
      date: '2025-06-17',
      views: 201,
      likes: 41,
    },
    {
      id: 14,
      category: '교육정보',
      title: '다문화가족을 위한 한국 문화 체험 프로그램',
      author: '강문화',
      date: '2025-06-16',
      views: 167,
      likes: 29,
    },
    {
      id: 15,
      category: '교육',
      title: '고령 부모님과의 관계 개선 방법',
      author: '조관계',
      date: '2025-06-15',
      views: 123,
      likes: 21,
    },
    {
      id: 16,
      category: '프로그램후기',
      title: '가족 상담 프로그램 경험담',
      author: '서상담',
      date: '2025-06-14',
      views: 145,
      likes: 25,
    },
    {
      id: 17,
      category: '생활정보',
      title: '육아 휴직 신청 방법과 혜택',
      author: '김육아',
      date: '2025-06-13',
      views: 198,
      likes: 37,
    },
    {
      id: 18,
      category: '교육정보',
      title: '자녀 진로 상담 프로그램 소개',
      author: '이진로',
      date: '2025-06-12',
      views: 156,
      likes: 28,
    },
  ];

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      교육: '#3498db',
      교육정보: '#e74c3c',
      프로그램후기: '#28a745',
      생활정보: '#f39c12',
    };
    return colors[category] || '#95a5a6';
  };

  const totalPages = Math.ceil(galleryData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = galleryData.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className='gallery-page'>
      <div className='gallery-header'>
        <h1>주요정보</h1>
        <p>가족지원센터의 주요 정보와 프로그램을 확인해보세요</p>
      </div>

      <div className='gallery-board'>
        <div className='board-header'>
          <div className='board-stats'>
            <span>총 {galleryData.length}개의 게시글</span>
          </div>
        </div>

        <div className='gallery-table'>
          <div className='table-header'>
            <div className='col-category'>분류</div>
            <div className='col-title'>제목</div>
            <div className='col-author'>작성자</div>
            <div className='col-date'>날짜</div>
            <div className='col-views'>조회</div>
            <div className='col-likes'>좋아요</div>
          </div>

          <div className='table-body'>
            {currentItems.map(item => (
              <div key={item.id} className='table-row'>
                <div className='col-category'>
                  <span
                    className='category-tag'
                    style={{ backgroundColor: getCategoryColor(item.category) }}
                  >
                    {item.category}
                  </span>
                </div>
                <div className='col-title'>
                  <h3>{item.title}</h3>
                </div>
                <div className='col-author'>{item.author}</div>
                <div className='col-date'>{item.date}</div>
                <div className='col-views'>{item.views}</div>
                <div className='col-likes'>
                  <span className='like-count'>❤️ {item.likes}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className='pagination'>
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className='page-btn'
          >
            ‹ 이전
          </button>

          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index + 1}
              onClick={() => handlePageChange(index + 1)}
              className={`page-btn ${
                currentPage === index + 1 ? 'active' : ''
              }`}
            >
              {index + 1}
            </button>
          ))}

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className='page-btn'
          >
            다음 ›
          </button>
        </div>
      </div>
    </div>
  );
};

export default Gallery;
