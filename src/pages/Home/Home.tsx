import React, { useEffect, useState } from 'react';
import ContentSection from '../../components/ContentSection/ContentSection';
import BannerEditModal from '../../components/shared/BannerAdmin/BannerEditModal';
import { API_CONFIG } from '../../config/api';
import { galleryAPI, newsAPI, Post } from '../../services/api';
import { bannerAPI, BannerSlide } from '../../services/bannerAPI';
import { authAPI, isAdmin } from '../../utils/auth';
import './Home.css';

// Ensure this file is treated as a module
export { };

const Home: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [galleryPosts, setGalleryPosts] = useState<Post[]>([]);
  const [newsPosts, setNewsPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [bannerLoading, setBannerLoading] = useState(true);
  const [editingSlide, setEditingSlide] = useState<BannerSlide | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [adminToken, setAdminToken] = useState<string | null>(null);

  // 슬라이더 데이터를 state로 변경
  const [slides, setSlides] = useState<BannerSlide[]>([]);

  // 어드민 토큰 확인
  useEffect(() => {
    const token = authAPI.hasToken() ? authAPI.getAuthHeaders().Authorization?.replace('Bearer ', '') : null;
    setAdminToken(token || null);
  }, []);

  // 배너 데이터 로드 (새로운 API 사용)
  useEffect(() => {
    const loadBannerData = async () => {
      try {
        setBannerLoading(true);
        const slides: BannerSlide[] = await bannerAPI.getActiveBanners();
        setSlides(slides);
      } catch (error) {
        console.error('배너 데이터 로드 실패:', error);
        setSlides([]);
      } finally {
        setBannerLoading(false);
      }
    };
    loadBannerData();
  }, []);

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
        setGalleryPosts([]);
        setNewsPosts([]);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // 자동 슬라이드 기능 (모달 조건 제거)
  useEffect(() => {
    if (slides.length === 0) return;
    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [slides.length]);

  const nextSlide = () => {
    if (slides.length === 0) return;
    setCurrentSlide(prev => (prev + 1) % slides.length);
  };
  const prevSlide = () => {
    if (slides.length === 0) return;
    setCurrentSlide(prev => (prev - 1 + slides.length) % slides.length);
  };
  const goToSlide = (index: number) => {
    if (index >= 0 && index < slides.length) {
      setCurrentSlide(index);
    }
  };

  const handleSlidesChange = (newSlides: BannerSlide[]) => {
    setSlides(newSlides);
    if (currentSlide >= newSlides.length) {
      setCurrentSlide(0);
    }
  };

  const handleEditSlide = (slide: BannerSlide) => {
    setEditingSlide(slide);
    setIsEditModalOpen(true);
  };

  const handleDeleteSlide = async (slideId: string) => {
    if (!adminToken) {
      alert('관리자 로그인이 필요합니다.');
      return;
    }

    if (window.confirm('이 배너를 삭제하시겠습니까?')) {
      try {
        const result = await bannerAPI.deleteBanner(slideId, adminToken);
        if (result.success) {
          // 성공적으로 삭제되면 목록에서 제거
          const newSlides = slides.filter(slide => slide.id !== slideId);
          handleSlidesChange(newSlides);
          alert('배너가 삭제되었습니다.');
        } else {
          alert(result.message || '배너 삭제에 실패했습니다.');
        }
      } catch (error) {
        console.error('배너 삭제 실패:', error);
        alert('배너 삭제 중 오류가 발생했습니다.');
      }
    }
  };

  const handleSaveSlide = async (slide: BannerSlide) => {
    if (!adminToken) {
      alert('관리자 로그인이 필요합니다.');
      return;
    }

    try {
      if (editingSlide) {
        // 수정
        const result = await bannerAPI.updateBanner(editingSlide.id, {
          title: slide.title,
          content: slide.content,
          image_url: slide.image,
        }, adminToken);

        if (result.success) {
          // 성공적으로 수정되면 목록 업데이트
          const newSlides = slides.map(s =>
            s.id === editingSlide.id ? { ...slide } : s
          );
          handleSlidesChange(newSlides);
          alert('배너가 수정되었습니다.');
        } else {
          alert(result.message || '배너 수정에 실패했습니다.');
        }
      } else {
        // 추가
        const result = await bannerAPI.createBanner({
          title: slide.title,
          content: slide.content,
          image_url: slide.image,
        }, adminToken);

        if (result.success) {
          // 성공적으로 추가되면 목록에 추가
          const newSlide = { ...slide, id: result.data.id };
          handleSlidesChange([...slides, newSlide]);
          alert('배너가 추가되었습니다.');
        } else {
          alert(result.message || '배너 추가에 실패했습니다.');
        }
      }
      setIsEditModalOpen(false);
      setIsAddModalOpen(false);
      setEditingSlide(null);
    } catch (error) {
      console.error('배너 저장 실패:', error);
      alert('배너 저장 중 오류가 발생했습니다.');
    }
  };

  const handleCancelEdit = () => {
    setIsEditModalOpen(false);
    setIsAddModalOpen(false);
    setEditingSlide(null);
  };

  const handleAddBanner = () => {
    setEditingSlide(null);
    setIsAddModalOpen(true);
  };

  if (bannerLoading) {
    return (
      <div className='home'>
        <section className='main-hero'>
          <div className='hero-slider'>
            <div className='loading-container'>
              <div className='loading-spinner'></div>
              <p>배너를 불러오는 중...</p>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className='home'>
      <section className='main-hero'>
        <div className='hero-slider'>
          {isAdmin() && (
            <div className='banner-admin-controls'>
              <button
                className='banner-add-btn'
                onClick={handleAddBanner}
                title='새 배너 추가'
              >
                ➕ 배너 추가
              </button>
            </div>
          )}
          <div
            className='slides-container'
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {slides.map((slide, index) => (
              <div key={slide.id} className='slide'>
                {isAdmin() && (
                  <div className='slide-admin-controls'>
                    <button
                      className='slide-edit-btn'
                      onClick={() => handleEditSlide(slide)}
                      title='배너 수정'
                    >
                      수정
                    </button>
                    <button
                      className='slide-delete-btn'
                      onClick={() => handleDeleteSlide(slide.id)}
                      title='배너 삭제'
                    >
                      삭제
                    </button>
                  </div>
                )}
                <div className='hero-content'>
                  <div className='hero-left'>
                    <h1>{slide.title}</h1>
                    <p>{slide.content}</p>
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
          {slides.length > 1 && (
            <>
              <button className='slider-nav prev' onClick={prevSlide}>
                ❮
              </button>
              <button className='slider-nav next' onClick={nextSlide}>
                ❯
              </button>
            </>
          )}
          {slides.length > 1 && (
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
          )}
        </div>
      </section>
      
      {(isEditModalOpen || isAddModalOpen) && (
        <BannerEditModal
          slide={editingSlide}
          onSave={handleSaveSlide}
          onCancel={handleCancelEdit}
        />
      )}
      <section className='content-sections'>
        <div className='container'>
          <div className='sections-grid-two'>
            <ContentSection
              title='센터소식'
              linkPath='/news'
              posts={newsPosts}
              loading={loading}
              categories={API_CONFIG.newsCategories}
              categoryType='news'
            />
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
