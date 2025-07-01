import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // 슬라이더 데이터
  const slides = [
    {
      id: 1,
      title: "한국미래인적자원개발원",
      subtitle: "미래 인재 양성을 위한 전문 교육기관입니다.",
      buttonText: "센터소개 자세히 보기",
      image: "/images/health-service.svg",
      icons: ["👨‍🎓", "👩‍🏫", "📚"]
    },
    {
      id: 2,
      title: "전문 교육 프로그램",
      subtitle: "체계적이고 실무 중심의 교육 프로그램을 제공합니다.",
      buttonText: "교육과정 확인하기",
      image: "/images/family-health.svg",
      icons: ["💻", "📖", "🎯"]
    },
    {
      id: 3,
      title: "글로벌 인재 양성",
      subtitle: "국제적 감각을 갖춘 전문 인력을 양성합니다.",
      buttonText: "프로그램 보기",
      image: "/images/online-consultation.svg",
      icons: ["🌍", "🤝", "📈"]
    },
    {
      id: 4,
      title: "산학협력 프로그램",
      subtitle: "기업과 연계한 실무 교육으로 취업을 지원합니다.",
      buttonText: "협력업체 보기",
      image: "/images/health-checkup.svg",
      icons: ["🏢", "🤝", "💼"]
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
      {/* e-보건소 Link를 센터 포털로 변경 */}
      <div className="ehealth-link">
        <a href="https://www.e-bogunso.go.kr" target="_blank" rel="noopener noreferrer" className="ehealth-btn">
          🏢 센터 포털
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
            {/* 센터소개 Section */}
            <div className="content-section">
              <div className="section-header">
                <h2>센터소개</h2>
                <p>한국미래인적자원개발원을 소개합니다</p>
              </div>
              
              <div className="intro-cards">
                <div className="intro-card">
                  <div className="card-icon">🏢</div>
                  <h3>기관 개요</h3>
                  <p>한국미래인적자원개발원은 미래 사회가 필요로 하는 창의적이고 전문적인 인재를 양성하기 위해 설립된 교육기관입니다.</p>
                </div>
                
                <div className="intro-card">
                  <div className="card-icon">🎯</div>
                  <h3>설립 목적</h3>
                  <p>글로벌 시대에 부응하는 인적자원 개발과 지속적인 교육을 통해 개인과 사회의 발전에 기여하고자 합니다.</p>
                </div>
                
                <div className="intro-card">
                  <div className="card-icon">📈</div>
                  <h3>비전</h3>
                  <p>혁신적 교육 방법론과 최신 기술을 활용하여 미래 인재 양성의 선도기관으로 자리매김하겠습니다.</p>
                </div>
              </div>
            </div>

            {/* 조직도 Section */}
            <div className="content-section">
              <div className="section-header">
                <h2>조직도 및 현황</h2>
                <Link to="/courses" className="view-more-btn">상세보기</Link>
              </div>
              
              <div className="organization-preview">
                <div className="org-chart-simple">
                  <div className="org-level">
                    <div className="org-box-simple director">
                      <h4>원장</h4>
                      <p>한국미래인적자원개발원</p>
                    </div>
                  </div>
                  
                  <div className="org-level">
                    <div className="org-box-simple department">
                      <h5>교육기획부</h5>
                      <span>교육과정 기획 및 개발</span>
                    </div>
                    <div className="org-box-simple department">
                      <h5>연구개발부</h5>
                      <span>인적자원 연구</span>
                    </div>
                    <div className="org-box-simple department">
                      <h5>사업운영부</h5>
                      <span>글로벌 융합인재 개발</span>
                    </div>
                  </div>
                </div>
                
                <div className="stats-mini">
                  <div className="stat-mini">
                    <div className="stat-number">25</div>
                    <div className="stat-label">전체 직원</div>
                  </div>
                  <div className="stat-mini">
                    <div className="stat-number">4</div>
                    <div className="stat-label">주요 부서</div>
                  </div>
                  <div className="stat-mini">
                    <div className="stat-number">12</div>
                    <div className="stat-label">운영 팀</div>
                  </div>
                </div>
              </div>
            </div>

            {/* 주요 업무 Section */}
            <div className="content-section">
              <div className="section-header">
                <h2>주요 업무</h2>
                <Link to="/curriculum" className="view-more-btn">상세보기</Link>
              </div>
              <div className="content-list">
                <div className="content-item">
                  <span className="item-tag blue">교육</span>
                  <h3>미래 인재 양성을 위한 교육 프로그램 개발</h3>
                  <span className="item-date">지속적 운영</span>
                </div>
                <div className="content-item">
                  <span className="item-tag green">연구</span>
                  <h3>인적자원 개발 분야 연구 및 정책 개발</h3>
                  <span className="item-date">연중 진행</span>
                </div>
                <div className="content-item">
                  <span className="item-tag purple">협력</span>
                  <h3>산업체 협력 및 국제 교류 활동</h3>
                  <span className="item-date">확대 운영</span>
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
