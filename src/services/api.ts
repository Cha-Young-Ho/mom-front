import { API_CONFIG, getApiUrl, getAuthHeaders } from '../config/api';
import { apiCache } from '../utils/cache';

// 공통 타입 정의
export interface Post {
  id: string;
  title: string;
  content: string;
  category: string;
  created_at: string;
  updated_at?: string;
  status: 'published' | 'draft';
  image_url?: string;
  short_description?: string;
}

export interface PostsResponse {
  posts: Post[];
  total: number;
  category_filter?: string[];
}

export interface CreatePostRequest {
  title: string;
  content: string;
  category: string;
  image_url?: string;
  short_description?: string;
}

// API 에러 클래스
class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

// 백엔드 응답을 프론트엔드 형식으로 변환하는 헬퍼 함수
function transformApiResponse(response: any): PostsResponse {
  // 백엔드가 {success: true, data: [...]} 형식으로 반환하는 경우
  if (response.success && response.data) {
    return {
      posts: response.data,
      total: response.total || response.data.length,
      category_filter: response.category_filter,
    };
  }

  // 이미 올바른 형식인 경우
  if (response.posts) {
    return response;
  }

  // 기본 형식으로 변환
  return {
    posts: Array.isArray(response) ? response : [],
    total: Array.isArray(response) ? response.length : 0,
  };
}

// 공통 fetch 함수
async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = getApiUrl(endpoint);
  const response = await fetch(url, {
    ...options,
    headers: {
      ...API_CONFIG.headers,
      ...options.headers,
    },
  });

  if (!response.ok) {
    throw new ApiError(
      response.status,
      `API Error: ${response.status} ${response.statusText}`
    );
  }

  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    return response.json();
  } else {
    // JSON이 아닌 응답의 경우 텍스트로 반환
    const text = await response.text();
    throw new ApiError(response.status, `Invalid response format: ${text}`);
  }
}

// 뉴스 API
export const newsAPI = {
  // 뉴스 목록 조회
  async getNews(categories?: string[]): Promise<PostsResponse> {
    const cacheKey = `news_posts_${categories?.join(',') || 'all'}`;

    // 캐시 확인
    const cachedData = apiCache.get<PostsResponse>(cacheKey);
    if (cachedData) {
      return cachedData;
    }

    const params =
      categories && categories.length > 0
        ? `?categories=${categories.join(',')}`
        : '';
    const rawResult = await apiFetch<any>(
      `${API_CONFIG.endpoints.news}${params}`
    );

    // 백엔드 응답을 프론트엔드 형식으로 변환
    const result = transformApiResponse(rawResult);

    // 캐시 저장 (1시간)
    apiCache.set(cacheKey, result, 3600000);
    return result;
  },

  // 최근 뉴스 5개 조회
  async getRecentNews(categories?: string[]): Promise<PostsResponse> {
    const cacheKey = `news_recent_${categories?.join(',') || 'all'}`;

    // 캐시 확인
    const cachedData = apiCache.get<PostsResponse>(cacheKey);
    if (cachedData) {
      return cachedData;
    }

    const params =
      categories && categories.length > 0
        ? `?categories=${categories.join(',')}`
        : '';
    const rawResult = await apiFetch<any>(
      `${API_CONFIG.endpoints.newsRecent}${params}`
    );

    // 백엔드 응답을 프론트엔드 형식으로 변환
    const result = transformApiResponse(rawResult);

    // 캐시 저장 (1시간)
    apiCache.set(cacheKey, result, 3600000);
    return result;
  },

  // 뉴스 상세 조회
  async getNewsItem(id: string): Promise<Post> {
    return apiFetch<Post>(`${API_CONFIG.endpoints.news}/${id}`);
  },

  // 뉴스 생성 (관리자 전용)
  async createNews(data: CreatePostRequest): Promise<Post> {
    return apiFetch<Post>(API_CONFIG.endpoints.news, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
  },

  // 뉴스 수정 (관리자 전용)
  async updateNews(
    id: string,
    data: Partial<CreatePostRequest>
  ): Promise<Post> {
    return apiFetch<Post>(`${API_CONFIG.endpoints.news}/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
  },

  // 뉴스 삭제 (관리자 전용)
  async deleteNews(id: string): Promise<void> {
    return apiFetch<void>(`${API_CONFIG.endpoints.news}/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
  },
};

// 갤러리 API
export const galleryAPI = {
  // 갤러리 목록 조회
  async getGallery(categories?: string[]): Promise<PostsResponse> {
    const cacheKey = `gallery_posts_${categories?.join(',') || 'all'}`;

    // 캐시 확인
    const cachedData = apiCache.get<PostsResponse>(cacheKey);
    if (cachedData) {
      return cachedData;
    }

    const params =
      categories && categories.length > 0
        ? `?categories=${categories.join(',')}`
        : '';
    const rawResult = await apiFetch<any>(
      `${API_CONFIG.endpoints.gallery}${params}`
    );

    // 백엔드 응답을 프론트엔드 형식으로 변환
    const result = transformApiResponse(rawResult);

    // 캐시 저장 (1시간)
    apiCache.set(cacheKey, result, 3600000);
    return result;
  },

  // 최근 갤러리 5개 조회
  async getRecentGallery(categories?: string[]): Promise<PostsResponse> {
    const cacheKey = `gallery_recent_${categories?.join(',') || 'all'}`;

    // 캐시 확인
    const cachedData = apiCache.get<PostsResponse>(cacheKey);
    if (cachedData) {
      return cachedData;
    }

    const params =
      categories && categories.length > 0
        ? `?categories=${categories.join(',')}`
        : '';
    const rawResult = await apiFetch<any>(
      `${API_CONFIG.endpoints.galleryRecent}${params}`
    );

    // 백엔드 응답을 프론트엔드 형식으로 변환
    const result = transformApiResponse(rawResult);

    // 캐시 저장 (1시간)
    apiCache.set(cacheKey, result, 3600000);
    return result;
  },

  // 갤러리 상세 조회
  async getGalleryItem(id: string): Promise<Post> {
    return apiFetch<Post>(`${API_CONFIG.endpoints.gallery}/${id}`);
  },

  // 갤러리 생성 (관리자 전용)
  async createGalleryItem(data: CreatePostRequest): Promise<Post> {
    return apiFetch<Post>(API_CONFIG.endpoints.gallery, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
  },

  // 갤러리 수정 (관리자 전용)
  async updateGalleryItem(
    id: string,
    data: Partial<CreatePostRequest>
  ): Promise<Post> {
    return apiFetch<Post>(`${API_CONFIG.endpoints.gallery}/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
  },

  // 갤러리 삭제 (관리자 전용)
  async deleteGalleryItem(id: string): Promise<void> {
    return apiFetch<void>(`${API_CONFIG.endpoints.gallery}/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
  },
};

// S3 업로드 관련 타입
export interface PresignedUrlRequest {
  content_type: string;
}

export interface PresignedUrlResponse {
  upload_url: string;
  file_url: string;
  file_key: string;
  expires_in: number;
  expires_at: string;
}

// News용 Presigned URL API
export const newsUploadAPI = {
  // News용 Presigned URL 요청
  async getPresignedUrl(contentType: string): Promise<PresignedUrlResponse> {
    const response = await apiFetch<any>(
      `${API_CONFIG.endpoints.news}/upload-url`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content_type: contentType,
        }),
      }
    );

    return response.data;
  },

  // S3에 파일 업로드
  async uploadToS3(uploadUrl: string, file: File): Promise<void> {
    const response = await fetch(uploadUrl, {
      method: 'PUT',
      body: file,
      headers: {
        'Content-Type': file.type,
      },
    });

    if (!response.ok) {
      throw new Error(
        `S3 업로드 실패: ${response.status} ${response.statusText}`
      );
    }
  },

  // 전체 업로드 프로세스
  async uploadFile(file: File): Promise<string> {
    const presignedData = await this.getPresignedUrl(file.type);
    await this.uploadToS3(presignedData.upload_url, file);
    return presignedData.file_url;
  },
};

// Gallery용 Presigned URL API
export const galleryUploadAPI = {
  // Gallery용 Presigned URL 요청
  async getPresignedUrl(contentType: string): Promise<PresignedUrlResponse> {
    const response = await apiFetch<any>(
      `${API_CONFIG.endpoints.gallery}/upload-url`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content_type: contentType,
        }),
      }
    );

    return response.data;
  },

  // S3에 파일 업로드
  async uploadToS3(uploadUrl: string, file: File): Promise<void> {
    const response = await fetch(uploadUrl, {
      method: 'PUT',
      body: file,
      headers: {
        'Content-Type': file.type,
      },
    });

    if (!response.ok) {
      throw new Error(
        `S3 업로드 실패: ${response.status} ${response.statusText}`
      );
    }
  },

  // 전체 업로드 프로세스
  async uploadFile(file: File): Promise<string> {
    const presignedData = await this.getPresignedUrl(file.type);
    await this.uploadToS3(presignedData.upload_url, file);
    return presignedData.file_url;
  },
};

// S3 업로드 API (기존 - 호환성 유지)
export const uploadAPI = {
  // S3 Presigned URL 요청
  async getPresignedUrl(
    data: PresignedUrlRequest
  ): Promise<PresignedUrlResponse> {
    return apiFetch<PresignedUrlResponse>(
      API_CONFIG.endpoints.uploadPresigned,
      {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      }
    );
  },

  // 파일을 S3에 직접 업로드
  async uploadToS3(uploadUrl: string, file: File): Promise<void> {
    const response = await fetch(uploadUrl, {
      method: 'PUT',
      body: file,
      headers: {
        'Content-Type': file.type,
      },
    });

    if (!response.ok) {
      throw new Error(
        `S3 업로드 실패: ${response.status} ${response.statusText}`
      );
    }
  },

  // 전체 업로드 프로세스 (Presigned URL 요청 + S3 업로드)
  async uploadFile(file: File): Promise<string> {
    // 1. Presigned URL 요청
    const presignedData = await this.getPresignedUrl({
      content_type: file.type,
    });

    // 2. S3에 파일 업로드
    await this.uploadToS3(presignedData.upload_url, file);

    // 3. 업로드된 파일의 URL 반환
    return presignedData.file_url;
  },
};

// 카테고리별 색상 매핑 (UI용)
export const getCategoryColor = (
  category: string,
  type: 'news' | 'gallery' = 'gallery'
) => {
  const colorMaps = {
    news: {
      센터소식: 'blue',
      프로그램소식: 'red',
      행사소식: 'green',
      생활정보: 'orange',
      기타: 'gray',
    } as Record<string, string>,
    gallery: {
      공지사항: 'red',
      질문: 'orange',
      건의: 'green',
      참고자료: 'blue',
      기타: 'gray',
      세미나: 'purple',
      일정: 'teal',
    } as Record<string, string>,
  };

  return colorMaps[type][category] || 'gray';
};
