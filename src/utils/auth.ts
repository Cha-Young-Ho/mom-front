import Cookies from 'js-cookie';
import { getApiUrl } from '../config/api';

// Admin 권한 관련 함수들
export const isAdmin = (): boolean => {
  // 실제 토큰 확인 (개발/프로덕션 공통)
  const token = Cookies.get('admin_token');
  return !!token;
};

export const logout = () => {
  Cookies.remove('admin_token');
};

// 관리자 로그인 API (Mock 구현)
export const authAPI = {
  // 토큰 확인
  hasToken(): boolean {
    return !!Cookies.get('admin_token');
  },

  // 로그인 API
  async login(username: string, password: string) {
    try {
      const response = await fetch(getApiUrl('/auth/login'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        return {
          success: true,
          token: data.token,
        };
      } else {
        return {
          success: false,
          message: data.message || '로그인에 실패했습니다.',
        };
      }
    } catch (error) {
      console.error('Login request failed:', error);
      return {
        success: false,
        message: '서버 연결에 실패했습니다.',
      };
    }
  },

  // 사용자 정보 조회
  async getMe() {
    try {
      const token = Cookies.get('admin_token');
      if (!token) {
        return { success: false };
      }

      const response = await fetch(getApiUrl('/auth/me'), {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (response.ok && data.success) {
        return {
          success: true,
          user: data.user,
        };
      } else {
        return { success: false };
      }
    } catch (error) {
      console.error('Get user info failed:', error);
      return { success: false };
    }
  },

  // 로그아웃
  logout() {
    Cookies.remove('admin_token');
  },

  // 인증 헤더 생성
  getAuthHeaders() {
    const token = Cookies.get('admin_token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  },
};
