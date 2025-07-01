import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // 슬라이더 데이터
  const slides = [
    {
      id: 1,
      title: '한국미래인적자원개발원',
      subtitle: '미래 인재 양성을 위한 전문 교육기관입니다.',
      buttonText: '센터소개 자세히 보기',
      image: '/images/health-service.svg',
      icons: ['👨‍🎓', '👩‍🏫', '📚'],
    },
    {
      id: 2,
      title: '전문 교육 프로그램',
      subtitle: '체계적이고 실무 중심의 교육 프로그램을 제공합니다.',
      buttonText: '교육과정 확인하기',
      image: '/images/family-health.svg',
      icons: ['💻', '📖', '🎯'],
    },
    {
      id: 3,
      title: '글로벌 인재 양성',
      subtitle: '국제적 감각을 갖춘 전문 인력을 양성합니다.',
      buttonText: '프로그램 보기',
      image: '/images/online-consultation.svg',
      icons: ['🌍', '🤝', '📈'],
    },
    {
      id: 4,
      title: '산학협력 프로그램',
      subtitle: '기업과 연계한 실무 교육으로 취업을 지원합니다.',
      buttonText: '협력업체 보기',
      image: '/images/health-checkup.svg',
      icons: ['🏢', '🤝', '💼'],
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
      <div className='ehealth-link'>
        <a
          href='https://www.e-bogunso.go.kr'
          target='_blank'
          rel='noopener noreferrer'
          className='ehealth-btn'
        >
          🏢 센터 포털
        </a>
      </div>

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
                      <div className='image-container'>
                        <img
                          src={slide.image}
                          alt={slide.title}
                          className='slide-image'
                        />
                      </div>
                      <div className='people-icons'>
                        {slide.icons.map((icon, iconIndex) => (
                          <span key={iconIndex}>{icon}</span>
                        ))}
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
          <div className='slide-indicators'>
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

      {/* Content Sections - 알림공간, 가족센터정보 */}
      <section className='content-sections'>
        <div className='container'>
          <div className='sections-grid-two'>
            {/* 알림공간 Section */}
            <div className='content-section'>
              <div className='section-header'>
                <h2>
                  <Link
                    to='/gallery'
                    style={{ textDecoration: 'none', color: 'inherit' }}
                  >
                    알림공간
                  </Link>
                </h2>
                <div className='category-tabs'>
                  <Link to='/gallery'>
                    <button className='category-tab active'>전체</button>
                  </Link>
                  <button className='category-tab'>기관소식</button>
                  <button className='category-tab'>디지털 소식</button>
                  <button className='category-tab'>참고자료</button>
                  <Link to='/gallery'>
                    <button className='category-tab-more'>+</button>
                  </Link>
                </div>
              </div>
              <div className='content-list'>
                <Link
                  to='/gallery'
                  style={{ textDecoration: 'none', color: 'inherit' }}
                >
                  <div className='content-item'>
                    <span className='item-tag green'>디지털소식</span>
                    <div className='item-content'>
                      <h3>「한국건강가정진흥원」출산 축하 시회보험 안...</h3>
                      <span className='item-date'>2025-01-25</span>
                    </div>
                  </div>
                </Link>
                <Link
                  to='/gallery'
                  style={{ textDecoration: 'none', color: 'inherit' }}
                >
                  <div className='content-item'>
                    <span className='item-tag green'>기관소식</span>
                    <div className='item-content'>
                      <h3>「2025년 건강가정 문화 확산을 위한 사업 공모...</h3>
                      <span className='item-date'>2025-01-20</span>
                    </div>
                  </div>
                </Link>
              </div>
            </div>

            {/* 가족센터정보 Section */}
            <div className='content-section'>
              <div className='section-header'>
                <h2>
                  <Link
                    to='/news'
                    style={{ textDecoration: 'none', color: 'inherit' }}
                  >
                    가족센터정보
                  </Link>
                </h2>
                <div className='category-tabs'>
                  <Link to='/news'>
                    <button className='category-tab active'>전체</button>
                  </Link>
                  <button className='category-tab'>프로그램</button>
                  <button className='category-tab'>행사</button>
                  <button className='category-tab'>채용정보</button>
                  <Link to='/news'>
                    <button className='category-tab-more'>+</button>
                  </Link>
                </div>
              </div>
              <div className='content-list'>
                <Link
                  to='/news'
                  style={{ textDecoration: 'none', color: 'inherit' }}
                >
                  <div className='content-item'>
                    <span className='item-tag blue'>프로그램</span>
                    <div className='item-content'>
                      <h3>가족 소통 프로그램 [함께걸기]</h3>
                      <span className='item-date'>2025-01-28</span>
                    </div>
                  </div>
                </Link>
                <Link
                  to='/news'
                  style={{ textDecoration: 'none', color: 'inherit' }}
                >
                  <div className='content-item'>
                    <span className='item-tag blue'>프로그램</span>
                    <div className='item-content'>
                      <h3>[다문화가족 자녀 학습지원] 한국어 교육 프로그램</h3>
                      <span className='item-date'>2025-01-27</span>
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
