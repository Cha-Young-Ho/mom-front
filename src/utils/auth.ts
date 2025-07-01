import Cookies from 'js-cookie';
import { mockAPI } from './mockAPI';

// 개발 환경에서 mock API 사용 여부
const USE_MOCK_API = process.env.NODE_ENV === 'development';

export interface AuthResponse {
  success: boolean;
  token?: string;
  message?: string;
  user?: {
    username: string;
    role: string;
  };
}

export const authAPI = {
  // 로그인
  login: async (username: string, password: string): Promise<AuthResponse> => {
    try {
      if (USE_MOCK_API) {
        // 개발 환경에서 mock API 사용
        return await mockAPI.admin.login(username, password);
      }

      // 프로덕션 환경에서 실제 API 호출
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        return {
          success: true,
          token: data.token,
          user: data.user,
        };
      } else {
        return {
          success: false,
          message: data.message || '로그인에 실패했습니다.',
        };
      }
    } catch (error) {
      console.error('Login API error:', error);
      return {
        success: false,
        message: '서버 연결에 실패했습니다.',
      };
    }
  },

  // 토큰 검증 및 사용자 정보 조회
  getMe: async (): Promise<AuthResponse> => {
    try {
      const token = Cookies.get('admin_token');
      
      if (!token) {
        return {
          success: false,
          message: '토큰이 없습니다.',
        };
      }

      if (USE_MOCK_API) {
        // 개발 환경에서 mock API 사용
        return await mockAPI.admin.getMe(token);
      }

      // 프로덕션 환경에서 실제 API 호출
      const response = await fetch('/api/admin/me', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        return {
          success: true,
          user: data,
        };
      } else {
        return {
          success: false,
          message: data.message || '인증에 실패했습니다.',
        };
      }
    } catch (error) {
      console.error('Auth verification error:', error);
      return {
        success: false,
        message: '서버 연결에 실패했습니다.',
      };
    }
  },

  // 로그아웃
  logout: () => {
    Cookies.remove('admin_token');
  },

  // 토큰 존재 여부 확인
  hasToken: (): boolean => {
    return !!Cookies.get('admin_token');
  },

  // 인증된 요청을 위한 헤더
  getAuthHeaders: (): Record<string, string> => {
    const token = Cookies.get('admin_token');
    const headers: Record<string, string> = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  },
};

// JWT 토큰 디코딩 유틸리티 (간단한 페이로드 확인용)
export const decodeJWT = (token: string) => {
  try {
    const payload = token.split('.')[1];
    const decoded = JSON.parse(atob(payload));
    return decoded;
  } catch (error) {
    console.error('JWT decode error:', error);
    return null;
  }
};

// 토큰 만료 확인
export const isTokenExpired = (token: string): boolean => {
  try {
    const decoded = decodeJWT(token);
    if (!decoded || !decoded.exp) return true;
    
    const currentTime = Math.floor(Date.now() / 1000);
    return decoded.exp < currentTime;
  } catch (error) {
    return true;
  }
};
