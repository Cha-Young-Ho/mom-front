import { authAPI, isAdmin } from '../../utils/auth';

// Mock Cookies
const mockCookies = {
  get: jest.fn(),
  set: jest.fn(),
  remove: jest.fn(),
};

jest.mock('js-cookie', () => mockCookies);

// Mock fetch
global.fetch = jest.fn();
const mockFetch = fetch as jest.MockedFunction<typeof fetch>;

describe('Auth Utils', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockCookies.get.mockReturnValue(undefined);
  });

  describe('isAdmin', () => {
    test('쿠키에 admin_token이 있으면 true를 반환한다', () => {
      mockCookies.get.mockReturnValue('admin-token');
      expect(isAdmin()).toBe(true);
    });

    test('쿠키에 admin_token이 없으면 false를 반환한다', () => {
      mockCookies.get.mockReturnValue(undefined);
      expect(isAdmin()).toBe(false);
    });

    test('쿠키에 빈 문자열이 있으면 false를 반환한다', () => {
      mockCookies.get.mockReturnValue('');
      expect(isAdmin()).toBe(false);
    });
  });

  describe('authAPI.login', () => {
    test('올바른 로그인 정보로 로그인하면 성공을 반환한다', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            success: true,
            token: 'test-token',
          }),
      } as Response);

      const result = await authAPI.login('admin', 'admin123');
      expect(result.success).toBe(true);
      expect(result.token).toBe('test-token');
    });

    test('잘못된 로그인 정보로 로그인하면 실패를 반환한다', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        json: () =>
          Promise.resolve({
            success: false,
            message: '잘못된 로그인 정보입니다.',
          }),
      } as Response);

      const result = await authAPI.login('admin', 'wrongpassword');
      expect(result.success).toBe(false);
      expect(result.message).toBe('잘못된 로그인 정보입니다.');
    });

    test('네트워크 에러 시 실패를 반환한다', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network Error'));

      const result = await authAPI.login('admin', 'admin123');
      expect(result.success).toBe(false);
      expect(result.message).toBe('서버 연결에 실패했습니다.');
    });
  });

  describe('authAPI.logout', () => {
    test('로그아웃하면 쿠키에서 admin_token을 삭제한다', () => {
      authAPI.logout();
      expect(mockCookies.remove).toHaveBeenCalledWith('admin_token');
    });
  });

  describe('authAPI.hasToken', () => {
    test('토큰이 있으면 true를 반환한다', () => {
      mockCookies.get.mockReturnValue('test-token');
      expect(authAPI.hasToken()).toBe(true);
    });

    test('토큰이 없으면 false를 반환한다', () => {
      mockCookies.get.mockReturnValue(undefined);
      expect(authAPI.hasToken()).toBe(false);
    });
  });

  describe('authAPI.getAuthHeaders', () => {
    test('토큰이 있으면 Authorization 헤더를 반환한다', () => {
      mockCookies.get.mockReturnValue('test-token');
      const headers = authAPI.getAuthHeaders();
      expect(headers).toEqual({ Authorization: 'Bearer test-token' });
    });

    test('토큰이 없으면 빈 객체를 반환한다', () => {
      mockCookies.get.mockReturnValue(undefined);
      const headers = authAPI.getAuthHeaders();
      expect(headers).toEqual({});
    });
  });
});
