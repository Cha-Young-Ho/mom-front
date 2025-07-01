import React, { useEffect, useState } from 'react';
import './Home.css';

const Home: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // 슬라이더 데이터
  const slides = [
    {
      id: 1,
      title: "보건서비스 정보를 한눈에",
      subtitle: "다양한 보건서비스 정보를 제공합니다.",
      buttonText: "e-Health 포털 바로가기",
      image: "/images/health-service.svg",
      icons: ["👩‍⚕️", "👨‍⚕️", "👨‍👩‍👧‍👦"]
    },
    {
      id: 2,
      title: "가족 건강 관리 서비스",
      subtitle: "온 가족의 건강을 체계적으로 관리해보세요.",
      buttonText: "건강관리 서비스 보기",
      image: "/images/family-health.svg",
      icons: ["👶", "👦", "👨‍🦳"]
    },
    {
      id: 3,
      title: "온라인 상담 및 예약",
      subtitle: "언제 어디서나 편리한 온라인 상담을 받아보세요.",
      buttonText: "온라인 상담 예약",
      image: "/images/online-consultation.svg",
      icons: ["📞", "💬", "📋"]
    },
    {
      id: 4,
      title: "건강검진 및 예방접종",
      subtitle: "정기 건강검진과 예방접종 일정을 관리하세요.",
      buttonText: "검진 일정 확인",
      image: "/images/health-checkup.svg",
      icons: ["🔬", "💉", "📊"]
    }
  ];

  // 자동 슬라이드 기능
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000); // 5초마다 자동 전환

    return () => clearInterval(interval);
  }, [slides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  return (
    <div className="home">
      {/* e-보건소 Link */}
      <div className="ehealth-link">
        <a href="#" className="ehealth-btn">
          🏠 e-보건소
        </a>
      </div>

      {/* Main Hero Section with Slider */}
      <section className="main-hero">
        <div className="hero-slider">
          <div className="slides-container" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
            {slides.map((slide, index) => (
              <div key={slide.id} className="slide">
                <div className="hero-content">
                  <div className="hero-left">
                    <h1>{slide.title}</h1>
                    <p>{slide.subtitle}</p>
                    <button className="portal-btn">
                      {slide.buttonText} →
                    </button>
                  </div>
                  <div className="hero-right">
                    <div className="hero-illustration">
                      <div className="image-container">
                        <img 
                          src={slide.image} 
                          alt={slide.title}
                          className="slide-image"
                        />
                      </div>
                      <div className="people-icons">
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
          <button className="slider-nav prev" onClick={prevSlide}>
            ❮
          </button>
          <button className="slider-nav next" onClick={nextSlide}>
            ❯
          </button>

          {/* Slide Indicators */}
          <div className="slide-indicators">
            {slides.map((_, index) => (
              <button
                key={index}
                className={`indicator ${index === currentSlide ? 'active' : ''}`}
                onClick={() => goToSlide(index)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Content Sections */}
      <section className="content-sections">
        <div className="container">
          <div className="sections-grid">
            {/* 알림공간 Section */}
            <div className="content-section">
              <div className="section-header">
                <h2>알림공간</h2>
              </div>
              <div className="section-tabs">
                <button className="tab active">전체</button>
                <button className="tab">기관소식</button>
                <button className="tab">디지털 소식</button>
                <button className="tab">참고자료</button>
                <button className="tab-more">+</button>
              </div>
              <div className="content-list">
                <div className="content-item">
                  <span className="item-tag green">디지털소식</span>
                  <h3>「한국건강가정진흥원」 출산 축하 시회보험 안...</h3>
                  <span className="item-date">2025-01-25</span>
                </div>
                <div className="content-item">
                  <span className="item-tag green">기관소식</span>
                  <h3>「2025년 건강가정 문화 확산을 위한 사업 공모...</h3>
                  <span className="item-date">2025-01-20</span>
                </div>
              </div>
            </div>

            {/* 가족센터정보 Section */}
            <div className="content-section">
              <div className="section-header">
                <h2>가족센터정보</h2>
              </div>
              <div className="section-tabs">
                <button className="tab active">전체</button>
                <button className="tab">프로그램</button>
                <button className="tab">행사</button>
                <button className="tab">채용정보</button>
                <button className="tab-more">+</button>
              </div>
              <div className="content-list">
                <div className="content-item">
                  <span className="item-tag blue">프로그램</span>
                  <h3>가족 소통 프로그램 [함께걸기]</h3>
                  <span className="item-date">2025-01-28</span>
                </div>
                <div className="content-item">
                  <span className="item-tag blue">프로그램</span>
                  <h3>[다문화가족 자녀 학습지원] 한국어 교육 프로그램</h3>
                  <span className="item-date">2025-01-27</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
