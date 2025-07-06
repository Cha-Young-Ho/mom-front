import { render, screen, waitFor } from '@testing-library/react';
import Gallery from '../../pages/Gallery/Gallery';
import { galleryAPI } from '../../services/api';

// Mock the galleryAPI and getCategoryColor
jest.mock('../../services/api', () => ({
  galleryAPI: {
    getGallery: jest.fn(),
    createGalleryItem: jest.fn(),
    deleteGalleryItem: jest.fn(),
  },
  getCategoryColor: jest.fn(() => 'blue'),
}));

// Mock isAdmin utility
jest.mock('../../utils/auth', () => ({
  isAdmin: jest.fn(() => false),
}));

const mockGalleryAPI = galleryAPI as jest.Mocked<typeof galleryAPI>;

describe('Gallery Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGalleryAPI.getGallery.mockResolvedValue({
      posts: [
        {
          id: '1',
          title: '주요정보 테스트',
          content: '주요정보 내용',
          category: '공지사항',
          created_at: '2025-07-06T10:00:00Z',
          status: 'published',
          short_description: '주요정보 요약',
        },
      ],
      total: 1,
    });
  });

  test('갤러리 페이지가 올바르게 렌더링된다', async () => {
    render(<Gallery />);

    expect(screen.getByText('주요정보')).toBeInTheDocument();
    expect(
      screen.getByText('센터의 자료와 정보를 확인하세요.')
    ).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('주요정보 테스트')).toBeInTheDocument();
    });
  });

  test('갤러리 카테고리 필터가 작동한다', async () => {
    render(<Gallery />);

    await waitFor(() => {
      expect(screen.getByText('공지사항')).toBeInTheDocument();
    });

    // 카테고리 필터링 확인
    expect(screen.getByText('참고자료')).toBeInTheDocument();
    expect(screen.getByText('질문')).toBeInTheDocument();
  });

  test('API 호출 실패 시 fallback 데이터가 표시된다', async () => {
    mockGalleryAPI.getGallery.mockRejectedValue(new Error('Network Error'));

    render(<Gallery />);

    await waitFor(() => {
      expect(
        screen.getByText('2025년 가족상담 프로그램 신청 안내')
      ).toBeInTheDocument();
    });
  });

  test('관리자일 때 항목 추가 버튼이 표시된다', async () => {
    const { isAdmin } = require('../../utils/auth');
    isAdmin.mockReturnValue(true);

    render(<Gallery />);

    await waitFor(() => {
      expect(screen.getByText('새 항목 추가')).toBeInTheDocument();
    });
  });

  test('갤러리 항목이 없을 때 적절한 메시지가 표시된다', async () => {
    mockGalleryAPI.getGallery.mockResolvedValue({ posts: [], total: 0 });

    render(<Gallery />);

    await waitFor(() => {
      expect(screen.getByText('갤러리 항목이 없습니다.')).toBeInTheDocument();
    });
  });
});
