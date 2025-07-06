import { galleryAPI, newsAPI } from '../../services/api';
import { apiCache } from '../../utils/cache';

// Mock posts for testing
const mockPosts = [
  {
    id: '1',
    title: '테스트 게시글 1',
    content: '테스트 게시글 1의 내용입니다.',
    category: '공지사항',
    created_at: '2025-07-06T10:00:00Z',
    status: 'published' as const,
    short_description: '테스트 게시글 1 요약',
    image_url: '/images/test1.jpg',
  },
];

// Mock fetch
global.fetch = jest.fn();
const mockFetch = fetch as jest.MockedFunction<typeof fetch>;

describe('API Services', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Clear API cache before each test
    apiCache.clear();
  });

  describe('newsAPI', () => {
    describe('getNews', () => {
      test('뉴스 목록을 성공적으로 가져온다', async () => {
        mockFetch.mockResolvedValueOnce({
          ok: true,
          headers: {
            get: jest.fn().mockReturnValue('application/json'),
          },
          json: () => Promise.resolve({ posts: mockPosts }),
        } as any);

        const result = await newsAPI.getNews();
        expect(result).toEqual({ posts: mockPosts });
        expect(mockFetch).toHaveBeenCalledWith('http://localhost:3001/news', {
          headers: { 'Content-Type': 'application/json' },
        });
      });

      test('카테고리 필터와 함께 뉴스를 가져온다', async () => {
        mockFetch.mockResolvedValueOnce({
          ok: true,
          headers: {
            get: jest.fn().mockReturnValue('application/json'),
          },
          json: () => Promise.resolve({ posts: mockPosts }),
        } as any);

        const result = await newsAPI.getNews(['공지사항']);
        expect(result).toEqual({ posts: mockPosts });
        expect(mockFetch).toHaveBeenCalledWith(
          'http://localhost:3001/news?categories=공지사항',
          {
            headers: { 'Content-Type': 'application/json' },
          }
        );
      });

      test('API 호출 실패 시 에러를 발생시킨다', async () => {
        mockFetch.mockResolvedValueOnce({
          ok: false,
          status: 500,
          statusText: 'Internal Server Error',
          headers: {
            get: jest.fn().mockReturnValue('application/json'),
          },
        } as any);

        await expect(newsAPI.getNews()).rejects.toThrow(
          'API Error: 500 Internal Server Error'
        );
      });

      test('네트워크 에러 시 에러를 발생시킨다', async () => {
        mockFetch.mockRejectedValueOnce(new Error('Network Error'));

        await expect(newsAPI.getNews()).rejects.toThrow('Network Error');
      });
    });

    describe('createNews', () => {
      test('뉴스를 성공적으로 생성한다', async () => {
        const newPost = mockPosts[0];
        mockFetch.mockResolvedValueOnce({
          ok: true,
          headers: {
            get: jest.fn().mockReturnValue('application/json'),
          },
          json: () => Promise.resolve(newPost),
        } as any);

        const postData = {
          title: '새 뉴스',
          content: '새 뉴스 내용',
          category: '공지사항',
          short_description: '새 뉴스 요약',
        };

        const result = await newsAPI.createNews(postData);
        expect(result).toEqual(newPost);
        expect(mockFetch).toHaveBeenCalledWith('http://localhost:3001/news', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(postData),
        });
      });

      test('뉴스 생성 실패 시 에러를 발생시킨다', async () => {
        mockFetch.mockResolvedValueOnce({
          ok: false,
          status: 400,
          statusText: 'Bad Request',
        } as any);

        const postData = {
          title: '새 뉴스',
          content: '새 뉴스 내용',
          category: '공지사항',
          short_description: '새 뉴스 요약',
        };

        await expect(newsAPI.createNews(postData)).rejects.toThrow(
          'API Error: 400 Bad Request'
        );
      });
    });

    describe('deleteNews', () => {
      test('뉴스를 성공적으로 삭제한다', async () => {
        mockFetch.mockResolvedValueOnce({
          ok: true,
          headers: {
            get: jest.fn().mockReturnValue('application/json'),
          },
          json: () => Promise.resolve({ success: true }),
        } as any);

        await newsAPI.deleteNews('1');
        expect(mockFetch).toHaveBeenCalledWith('http://localhost:3001/news/1', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
        });
      });

      test('뉴스 삭제 실패 시 에러를 발생시킨다', async () => {
        mockFetch.mockResolvedValueOnce({
          ok: false,
          status: 404,
          statusText: 'Not Found',
        } as any);

        await expect(newsAPI.deleteNews('1')).rejects.toThrow(
          'API Error: 404 Not Found'
        );
      });
    });
  });

  describe('galleryAPI', () => {
    describe('getGallery', () => {
      test('갤러리 목록을 성공적으로 가져온다', async () => {
        mockFetch.mockResolvedValueOnce({
          ok: true,
          headers: {
            get: jest.fn().mockReturnValue('application/json'),
          },
          json: () => Promise.resolve({ posts: mockPosts }),
        } as any);

        const result = await galleryAPI.getGallery();
        expect(result).toEqual({ posts: mockPosts });
        expect(mockFetch).toHaveBeenCalledWith(
          'http://localhost:3001/gallery',
          {
            headers: { 'Content-Type': 'application/json' },
          }
        );
      });

      test('카테고리 필터와 함께 갤러리를 가져온다', async () => {
        mockFetch.mockResolvedValueOnce({
          ok: true,
          headers: {
            get: jest.fn().mockReturnValue('application/json'),
          },
          json: () => Promise.resolve({ posts: mockPosts }),
        } as any);

        const result = await galleryAPI.getGallery(['공지사항']);
        expect(result).toEqual({ posts: mockPosts });
        expect(mockFetch).toHaveBeenCalledWith(
          'http://localhost:3001/gallery?categories=공지사항',
          {
            headers: { 'Content-Type': 'application/json' },
          }
        );
      });
    });

    describe('createGalleryItem', () => {
      test('갤러리 항목을 성공적으로 생성한다', async () => {
        const newItem = mockPosts[0];
        mockFetch.mockResolvedValueOnce({
          ok: true,
          headers: {
            get: jest.fn().mockReturnValue('application/json'),
          },
          json: () => Promise.resolve(newItem),
        } as any);

        const itemData = {
          title: '새 갤러리 항목',
          content: '새 갤러리 내용',
          category: '공지사항',
          short_description: '새 갤러리 요약',
        };

        const result = await galleryAPI.createGalleryItem(itemData);
        expect(result).toEqual(newItem);
      });
    });

    describe('deleteGalleryItem', () => {
      test('갤러리 항목을 성공적으로 삭제한다', async () => {
        mockFetch.mockResolvedValueOnce({
          ok: true,
          headers: {
            get: jest.fn().mockReturnValue('application/json'),
          },
          json: () => Promise.resolve({ success: true }),
        } as any);

        await galleryAPI.deleteGalleryItem('1');
        expect(mockFetch).toHaveBeenCalledWith(
          'http://localhost:3001/gallery/1',
          {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );
      });
    });
  });
});
