import { getApiUrl } from '../config/api';

// 새로운 Banner API 스펙에 맞는 인터페이스
export interface Banner {
  id: string;
  title: string;
  content: string;
  image_url: string;
  created_at: string;
  updated_at: string;
}

export interface BannerSlide {
  id: string;
  image: string;
  title: string;
  content: string;
}

export interface BannerListResponse {
  success: boolean;
  data: {
    banners: Banner[];
    total: number;
    page: number;
    limit: number;
    has_next: boolean;
  };
}

export interface BannerAllResponse {
  success: boolean;
  data: {
    banners: Banner[];
    total: number;
  };
}

export interface BannerDetailResponse {
  success: boolean;
  data: {
    banner: Banner;
  };
}

export interface BannerCreateRequest {
  title: string;
  content: string;
  image_url: string;
}

export interface BannerUpdateRequest {
  title?: string;
  content?: string;
  image_url?: string;
}

export interface BannerCreateResponse {
  success: boolean;
  message: string;
  data: {
    id: string;
  };
}

export interface BannerUpdateResponse {
  success: boolean;
  message: string;
  data: {
    id: string;
  };
}

export interface BannerDeleteResponse {
  success: boolean;
  message: string;
  data: {
    id: string;
  };
}

export const bannerAPI = {
  // 배너 목록 조회 (페이지네이션)
  async getBanners(page: number = 1, limit: number = 10): Promise<BannerListResponse> {
    try {
      const response = await fetch(getApiUrl(`/banner?page=${page}&limit=${limit}`), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('배너 목록 조회 실패:', error);
      throw error;
    }
  },

  // 모든 배너 조회 (페이지네이션 없음)
  async getAllBanners(limit?: number): Promise<BannerAllResponse> {
    try {
      const url = limit 
        ? getApiUrl(`/banner/all?limit=${limit}`)
        : getApiUrl('/banner/all');
        
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('모든 배너 조회 실패:', error);
      throw error;
    }
  },

  // 배너 상세 조회
  async getBanner(bannerId: string): Promise<BannerDetailResponse> {
    try {
      const response = await fetch(getApiUrl(`/banner/${bannerId}`), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('배너 상세 조회 실패:', error);
      throw error;
    }
  },

  // 배너 생성 (관리자 전용)
  async createBanner(
    bannerData: BannerCreateRequest,
    token: string
  ): Promise<BannerCreateResponse> {
    try {
      const response = await fetch(getApiUrl('/banner'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token,
        },
        body: JSON.stringify(bannerData),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('배너 생성 실패:', error);
      throw error;
    }
  },

  // 배너 수정 (관리자 전용)
  async updateBanner(
    bannerId: string,
    bannerData: BannerUpdateRequest,
    token: string
  ): Promise<BannerUpdateResponse> {
    try {
      const response = await fetch(getApiUrl(`/banner/${bannerId}`), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token,
        },
        body: JSON.stringify(bannerData),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('배너 수정 실패:', error);
      throw error;
    }
  },

  // 배너 삭제 (관리자 전용)
  async deleteBanner(
    bannerId: string,
    token: string
  ): Promise<BannerDeleteResponse> {
    try {
      const response = await fetch(getApiUrl(`/banner/${bannerId}`), {
        method: 'DELETE',
        headers: {
          'Authorization': token,
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('배너 삭제 실패:', error);
      throw error;
    }
  },

  // 슬라이더용 배너 데이터 변환 (기존 호환성 유지)
  async getActiveBanners(): Promise<BannerSlide[]> {
    try {
      const response = await this.getAllBanners();
      
      if (response.success && response.data.banners) {
        // API 응답을 슬라이더용 데이터로 변환
        return response.data.banners.map((banner: Banner) => ({
          id: banner.id,
          image: banner.image_url,
          title: banner.title,
          content: banner.content,
        }));
      } else {
        return [];
      }
    } catch (error) {
      console.error('활성 배너 조회 실패:', error);
      return [];
    }
  },
};
