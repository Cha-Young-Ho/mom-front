// API 설정 파일
export const API_CONFIG = {
  // 환경별 API URL 설정
  baseURL: process.env.REACT_APP_API_URL || 'https://your-api-server.com',

  // API 엔드포인트
  endpoints: {
    // 뉴스 API
    news: '/news',
    newsRecent: '/news/recent',

    // 갤러리 API
    gallery: '/gallery',
    galleryRecent: '/gallery/recent',

    // 파일 업로드 API
    uploadPresigned: '/upload/presigned',
  },

  // 센터소식 카테고리 (news)
  newsCategories: ['센터소식', '프로그램소식', '행사소식', '생활정보', '기타'],

  // 주요정보 카테고리 (gallery)
  galleryCategories: [
    '공지사항',
    '질문',
    '건의',
    '참고자료',
    '기타',
    '세미나',
    '일정',
  ],

  // 기본 설정
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
};

// 환경별 설정
export const getEnvironment = () => {
  return process.env.REACT_APP_ENVIRONMENT || 'development';
};

// API URL 생성 헬퍼
export const getApiUrl = (endpoint: string) => {
  return `${API_CONFIG.baseURL}${endpoint}`;
};

// 기본 헤더 (인증이 필요한 경우 개별적으로 처리)
export const getAuthHeaders = () => {
  return API_CONFIG.headers;
};
