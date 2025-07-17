import React, { useEffect, useState } from 'react';
import ContentSection from '../../components/ContentSection/ContentSection';
import Modal from '../../components/shared/Modal/Modal';
import { API_CONFIG } from '../../config/api';
import { galleryAPI, newsAPI, Post } from '../../services/api';
import BannerModalContent from './BannerModalContent';
import './Home.css';

// Ensure this file is treated as a module
export {};

const Home: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [galleryPosts, setGalleryPosts] = useState<Post[]>([]);
  const [newsPosts, setNewsPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [bannerModalOpen, setBannerModalOpen] = useState(false);
  const [modalSlideIdx, setModalSlideIdx] = useState<number | null>(null);

  // API 데이터 로드
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        // 갤러리와 뉴스 최근 데이터 병렬로 가져오기
        const [galleryResponse, newsResponse] = await Promise.all([
          galleryAPI.getRecentGallery(),
          newsAPI.getRecentNews(),
        ]);

        setGalleryPosts(galleryResponse.posts);
        setNewsPosts(newsResponse.posts);
      } catch (error) {
        console.error('API 데이터 로드 실패:', error);
        // 실패 시 기본 데이터 설정
        setGalleryPosts([
          {
            id: '1',
            title: '센터 운영 시간 변경 안내',
            content: '',
            category: '공지사항',
            created_at: '2025-01-25T00:00:00Z',
            status: 'published',
          },
          {
            id: '2',
            title: '가족상담 신청서 다운로드',
            content: '',
            category: '참고자료',
            created_at: '2025-01-24T00:00:00Z',
            status: 'published',
          },
        ]);

        setNewsPosts([
          {
            id: '1',
            title: '가족 소통 프로그램 [함께걸기]',
            content: '',
            category: '프로그램',
            created_at: '2025-01-28T00:00:00Z',
            status: 'published',
          },
          {
            id: '2',
            title: '센터 창립 5주년 기념행사',
            content: '',
            category: '행사',
            created_at: '2025-01-27T00:00:00Z',
            status: 'published',
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // 슬라이더 데이터
  const slides = [
    {
      id: 1,
      title: '마스크 착용 캠페인',
      subtitle: '건강한 사회를 위한 올바른 마스크 착용 실천!',
      buttonText: '자세히 보기',
      image: process.env.PUBLIC_URL + '/mask.jpeg',
    },
    {
      id: 2,
      title: '센터 안내 팸플릿',
      subtitle: '다양한 교육·상담 프로그램을 한눈에!',
      buttonText: '자세히 보기',
      image: process.env.PUBLIC_URL + '/pamplet.png',
    },
    {
      id: 3,
      title: '세미나/행사 현장',
      subtitle: '생생한 현장 사진과 함께하는 센터 이야기',
      buttonText: '자세히 보기',
      image: process.env.PUBLIC_URL + '/semina.jpeg',
    },
    {
      id: 4,
      title: '노인케어 전문가 과정',
      subtitle:
        '노인 심리지원, 인지기능 활성화, 사회성 발달을 위한 민간자격 취득 교육! (9/4~10/30, 매주 목, 총 8회)',
      buttonText: '자세히 보기',
      image: process.env.PUBLIC_URL + '/images/oldman_care.png',
    },
  ];

  // 자동 슬라이드 기능
  useEffect(() => {
    if (bannerModalOpen) return; // 모달 열려있으면 자동 슬라이드 멈춤
    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % slides.length);
    }, 5000); // 5초마다 자동 전환

    return () => clearInterval(interval);
  }, [slides.length, bannerModalOpen]);

  const nextSlide = () => {
    setCurrentSlide(prev => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide(prev => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const openBannerModal = () => {
    setBannerModalOpen(true);
    setModalSlideIdx(currentSlide);
  };
  const closeBannerModal = () => {
    setBannerModalOpen(false);
    setModalSlideIdx(null);
  };

  return (
    <div className='home'>
      {/* e-보건소 Link를 센터 포털로 변경 */}
      {/* <div className='ehealth-link'>
        <a
          href='https://www.e-bogunso.go.kr'
          target='_blank'
          rel='noopener noreferrer'
          className='ehealth-btn'
        >
          🏢 센터 포털
        </a>
      </div> */}

      {/* Main Hero Section with Slider */}
      <section className='main-hero'>
        <div className='hero-slider'>
          <div
            className='slides-container'
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {slides.map((slide, index) => (
              <div key={slide.id} className='slide'>
                <div className='hero-content'>
                  <div className='hero-left'>
                    <h1>{slide.title}</h1>
                    <p>{slide.subtitle}</p>
                    <button className='portal-btn' onClick={openBannerModal}>
                      자세히 보기 →
                    </button>
                  </div>
                  <div className='hero-right'>
                    <div className='hero-illustration'>
                      <div className='image-container fill-height'>
                        <img
                          src={slide.image}
                          alt={slide.title}
                          className='slide-image fill-height-img'
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation Arrows */}
          <button className='slider-nav prev' onClick={prevSlide}>
            ❮
          </button>
          <button className='slider-nav next' onClick={nextSlide}>
            ❯
          </button>
          {/* Indicators */}
          <div className='slider-indicators'>
            {slides.map((_, index) => (
              <span
                key={index}
                className={`indicator ${
                  index === currentSlide ? 'active' : ''
                }`}
                onClick={() => goToSlide(index)}
              />
            ))}
          </div>
        </div>
      </section>
      <Modal
        isOpen={bannerModalOpen}
        onClose={closeBannerModal}
        title={modalSlideIdx !== null ? slides[modalSlideIdx].title : ''}
      >
        {modalSlideIdx !== null && (
          <BannerModalContent
            slideIdx={modalSlideIdx}
            image={slides[modalSlideIdx].image}
          />
        )}
      </Modal>

      {/* Content Sections - 센터소식, 주요정보 */}
      <section className='content-sections'>
        <div className='container'>
          <div className='sections-grid-two'>
            {/* 센터소식 Section */}
            <ContentSection
              title='센터소식'
              linkPath='/news'
              posts={newsPosts}
              loading={loading}
              categories={API_CONFIG.newsCategories}
              categoryType='news'
            />

            {/* 주요정보 Section */}
            <ContentSection
              title='주요정보'
              linkPath='/gallery'
              posts={galleryPosts}
              loading={loading}
              categories={API_CONFIG.galleryCategories}
              categoryType='gallery'
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
