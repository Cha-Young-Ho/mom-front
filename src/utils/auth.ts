import Cookies from 'js-cookie';

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
    // Mock API - 실제 구현 시 서버로 요청
    return new Promise<{ success: boolean; token?: string; message?: string }>(
      resolve => {
        setTimeout(() => {
          if (username === 'admin' && password === 'admin123') {
            const mockToken = 'mock-jwt-token-' + Date.now();
            resolve({
              success: true,
              token: mockToken,
            });
          } else {
            resolve({
              success: false,
              message: '아이디 또는 비밀번호가 잘못되었습니다.',
            });
          }
        }, 1000); // 네트워크 지연 시뮬레이션
      }
    );
  },

  // 사용자 정보 조회
  async getMe() {
    return new Promise<{ success: boolean; user?: any }>(resolve => {
      setTimeout(() => {
        const token = Cookies.get('admin_token');
        if (token) {
          resolve({
            success: true,
            user: {
              username: 'admin',
              role: 'administrator',
            },
          });
        } else {
          resolve({
            success: false,
          });
        }
      }, 500);
    });
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
