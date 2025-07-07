import React, { useEffect, useState } from 'react';
import ContentSection from '../../components/ContentSection/ContentSection';
import { API_CONFIG } from '../../config/api';
import { galleryAPI, newsAPI, Post } from '../../services/api';
import './Home.css';

// Ensure this file is treated as a module
export {};

const Home: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [galleryPosts, setGalleryPosts] = useState<Post[]>([]);
  const [newsPosts, setNewsPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

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
      title: '한국미래인적자원개발원',
      subtitle: '미래 인재 양성을 위한 전문 교육기관입니다.',
      buttonText: '센터소개 자세히 보기',
      image: '/images/health-service.svg',
    },
    {
      id: 2,
      title: '전문 교육 프로그램',
      subtitle: '체계적이고 실무 중심의 교육 프로그램을 제공합니다.',
      buttonText: '교육과정 확인하기',
      image: '/images/family-health.svg',
    },
    {
      id: 3,
      title: '글로벌 인재 양성',
      subtitle: '국제적 감각을 갖춘 전문 인력을 양성합니다.',
      buttonText: '프로그램 보기',
      image: '/images/online-consultation.svg',
    },
    {
      id: 4,
      title: '산학협력 프로그램',
      subtitle: '기업과 연계한 실무 교육으로 취업을 지원합니다.',
      buttonText: '협력업체 보기',
      image: '/images/health-checkup.svg',
    },
  ];

  // 자동 슬라이드 기능
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % slides.length);
    }, 5000); // 5초마다 자동 전환

    return () => clearInterval(interval);
  }, [slides.length]);

  const nextSlide = () => {
    setCurrentSlide(prev => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide(prev => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
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
                    <button className='portal-btn'>{slide.buttonText} →</button>
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

          {/* Slide Indicators */}
          <div className='slide-indicators moved-down'>
            {slides.map((_, index) => (
              <button
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
