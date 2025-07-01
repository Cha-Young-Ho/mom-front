import React, { useState } from 'react';
import './Notice.css';

interface NoticeItem {
  id: number;
  category: string;
  title: string;
  author: string;
  date: string;
  views: number;
  likes: number;
  image?: string;
  description?: string;
}

const Notice: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedNotice, setSelectedNotice] = useState<NoticeItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const itemsPerPage = 9; // 카드 형태로 변경하여 한 페이지에 9개씩 표시

  const noticeData: NoticeItem[] = [
    {
      id: 1,
      category: '센터소식',
      title: '2025년 가족센터 신규 프로그램 오픈',
      author: '센터 관리자',
      date: '2025-06-29',
      views: 324,
      likes: 45,
      image: '/images/family-health.svg',
      description:
        '가족의 건강한 소통과 화합을 위한 다양한 프로그램을 새롭게 선보입니다.',
    },
    {
      id: 2,
      category: '프로그램소식',
      title: '다문화가족 자녀 한국어 교육 프로그램 성과 발표',
      author: '교육팀',
      date: '2025-06-28',
      views: 289,
      likes: 63,
      image: '/images/health-service.svg',
      description:
        '지난 3개월간 진행된 한국어 교육 프로그램의 우수한 성과를 공유합니다.',
    },
    {
      id: 3,
      category: '행사소식',
      title: '가족 소통 워크숍 "함께 걸어요" 개최',
      author: '행사기획팀',
      date: '2025-06-27',
      views: 456,
      likes: 81,
      image: '/images/online-consultation.svg',
      description:
        '가족 간의 깊이 있는 소통을 위한 특별 워크숍이 성황리에 마무리되었습니다.',
    },
    {
      id: 4,
      category: '센터소식',
      title: '한국미래인적자원개발원 시설 확장 안내',
      author: '센터 관리자',
      date: '2025-06-26',
      views: 534,
      likes: 92,
      image: '/images/health-checkup.svg',
      description:
        '더 나은 서비스 제공을 위해 교육시설과 상담실을 확장하였습니다.',
    },
    {
      id: 5,
      category: '프로그램소식',
      title: '부모-자녀 관계 개선 프로그램 수료식',
      author: '상담팀',
      date: '2025-06-25',
      views: 298,
      likes: 58,
      image: '/images/family-health.svg',
      description:
        '12주간 진행된 부모-자녀 관계 개선 프로그램이 성공적으로 마무리되었습니다.',
    },
    {
      id: 6,
      category: '행사소식',
      title: '가족 건강 검진 캠페인 진행',
      author: '건강관리팀',
      date: '2025-06-24',
      views: 367,
      likes: 47,
      image: '/images/health-service.svg',
      description:
        '가족 구성원 모두의 건강을 챙기는 무료 검진 서비스를 제공했습니다.',
    },
    {
      id: 7,
      category: '센터소식',
      title: '우수 가족 멘토 시상식 개최',
      author: '센터 관리자',
      date: '2025-06-23',
      views: 443,
      likes: 75,
      image: '/images/online-consultation.svg',
      description: '지역사회 발전에 기여한 우수 가족 멘토들을 시상하였습니다.',
    },
    {
      id: 8,
      category: '프로그램소식',
      title: '온라인 가족 상담 서비스 확대',
      author: '상담팀',
      date: '2025-06-22',
      views: 312,
      likes: 52,
      image: '/images/health-checkup.svg',
      description:
        '언제 어디서나 편리하게 이용할 수 있는 온라인 상담 서비스를 확대 운영합니다.',
    },
    {
      id: 9,
      category: '행사소식',
      title: '가족 요리교실 "맛있는 추억 만들기"',
      author: '행사기획팀',
      date: '2025-06-21',
      views: 389,
      likes: 68,
      image: '/images/family-health.svg',
      description:
        '가족이 함께 요리하며 소중한 추억을 만드는 특별한 시간을 가졌습니다.',
    },
    {
      id: 10,
      category: '센터소식',
      title: '가족센터 개원 5주년 기념행사',
      author: '센터 관리자',
      date: '2025-06-20',
      views: 676,
      likes: 124,
      image: '/images/health-service.svg',
      description:
        '지역사회와 함께한 5년의 발자취를 돌아보는 뜻깊은 기념행사를 개최했습니다.',
    },
    {
      id: 11,
      category: '교육정보',
      title: '온라인 가족 상담 프로그램 안내',
      author: '교육팀',
      date: '2025-06-19',
      views: 245,
      likes: 36,
      image: '/images/online-consultation.svg',
      description:
        '새로운 온라인 플랫폼을 통한 가족 상담 프로그램을 소개합니다.',
    },
    {
      id: 12,
      category: '프로그램소식',
      title: '부모-자녀 소통 워크숍 참여 후기',
      author: '참여가족',
      date: '2025-06-18',
      views: 234,
      likes: 43,
      image: '/images/family-health.svg',
      description:
        '워크숍 참여 가족들의 생생한 후기와 변화된 모습을 공유합니다.',
    },
  ];

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      센터소식: '#3498db',
      프로그램소식: '#e74c3c',
      행사소식: '#28a745',
      교육정보: '#f39c12',
    };
    return colors[category] || '#95a5a6';
  };

  const totalPages = Math.ceil(noticeData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = noticeData.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleCardClick = (notice: NoticeItem) => {
    setSelectedNotice(notice);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedNotice(null);
  };

  return (
    <div className='notice-page'>
      <div className='notice-header'>
        <h1>센터소식</h1>
        <p>가족지원센터의 다양한 소식과 정보를 확인해보세요</p>
      </div>

      <div className='notice-board'>
        <div className='board-header'>
          <div className='board-stats'>
            <span>총 {noticeData.length}개의 소식</span>
          </div>
        </div>

        <div className='notice-cards'>
          {currentItems.map(item => (
            <div
              key={item.id}
              className='notice-card'
              onClick={() => handleCardClick(item)}
            >
              <div className='card-image'>
                <img src={item.image} alt={item.title} />
                <div
                  className='category-badge'
                  style={{ backgroundColor: getCategoryColor(item.category) }}
                >
                  {item.category}
                </div>
              </div>
              <div className='card-content'>
                <h3 className='card-title'>{item.title}</h3>
                <p className='card-description'>{item.description}</p>
                <div className='card-meta'>
                  <div className='meta-info'>
                    <span className='author'>{item.author}</span>
                    <span className='date'>{item.date}</span>
                  </div>
                  <div className='card-stats'>
                    <span className='views'>👁 {item.views}</span>
                    <span className='likes'>❤️ {item.likes}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
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

      {/* Modal */}
      {isModalOpen && selectedNotice && (
        <div className='modal-overlay' onClick={closeModal}>
          <div className='modal-content' onClick={e => e.stopPropagation()}>
            <button className='modal-close' onClick={closeModal}>
              ✕
            </button>

            <div className='modal-header'>
              <div className='modal-image'>
                <img src={selectedNotice.image} alt={selectedNotice.title} />
                <div
                  className='modal-category-badge'
                  style={{
                    backgroundColor: getCategoryColor(selectedNotice.category),
                  }}
                >
                  {selectedNotice.category}
                </div>
              </div>
            </div>

            <div className='modal-body'>
              <h2 className='modal-title'>{selectedNotice.title}</h2>
              <div className='modal-meta'>
                <div className='modal-meta-info'>
                  <span className='modal-author'>
                    작성자: {selectedNotice.author}
                  </span>
                  <span className='modal-date'>
                    작성일: {selectedNotice.date}
                  </span>
                </div>
                <div className='modal-stats'>
                  <span className='modal-views'>👁 {selectedNotice.views}</span>
                  <span className='modal-likes'>❤️ {selectedNotice.likes}</span>
                </div>
              </div>

              <div className='modal-description'>
                <p>{selectedNotice.description}</p>

                {/* 추가 상세 내용 */}
                <div className='modal-detail-content'>
                  <h3>상세 내용</h3>
                  <p>
                    {selectedNotice.category === '센터소식' &&
                      `한국미래인적자원개발원에서는 지역사회 발전과 가족의 행복을 위해 지속적으로 노력하고 있습니다. 
                      이번 소식을 통해 센터의 다양한 활동과 성과를 공유하며, 앞으로도 더 나은 서비스를 제공하겠습니다.`}
                    {selectedNotice.category === '프로그램소식' &&
                      `우리 센터의 전문 프로그램은 가족 구성원들의 건강한 관계 형성과 소통 능력 향상을 목표로 합니다. 
                      체계적인 커리큘럼과 전문가의 지도를 통해 실질적인 도움을 제공하고 있습니다.`}
                    {selectedNotice.category === '행사소식' &&
                      `센터에서 주최하는 다양한 행사는 가족 간의 유대감을 강화하고 지역사회와의 소통을 활성화하는 
                      중요한 역할을 하고 있습니다. 많은 분들의 참여와 관심에 감사드립니다.`}
                    {selectedNotice.category === '교육정보' &&
                      `지속적인 교육과 학습을 통해 가족의 역량을 강화하고, 변화하는 사회에 적응할 수 있도록 
                      다양한 교육 프로그램과 정보를 제공하고 있습니다.`}
                  </p>

                  <div className='modal-contact-info'>
                    <h4>문의사항</h4>
                    <p>📞 전화: 02-1234-5678</p>
                    <p>📧 이메일: info@example.com</p>
                    <p>🏢 주소: 서울시 중구 세종대로 110</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Notice;
