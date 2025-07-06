import { render, screen, waitFor } from '@testing-library/react';
import Notice from '../../pages/Notice/Notice';
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

describe('Notice Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGalleryAPI.getGallery.mockResolvedValue({
      posts: [
        {
          id: '1',
          title: '공지사항 테스트',
          content: '공지사항 내용',
          category: '공지사항',
          created_at: '2025-07-06T10:00:00Z',
          status: 'published',
          short_description: '공지사항 요약',
        },
      ],
      total: 1,
    });
  });

  test('공지사항 페이지가 올바르게 렌더링된다', async () => {
    render(<Notice />);

    // 헤더가 렌더링되는지 확인 - 제목만 선택
    expect(
      screen.getByRole('heading', { name: '공지사항' })
    ).toBeInTheDocument();
    expect(
      screen.getByText('센터의 다양한 소식과 프로그램 정보를 확인하세요.')
    ).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('공지사항 테스트')).toBeInTheDocument();
    });
  });

  test('공지사항 카테고리 필터가 작동한다', async () => {
    render(<Notice />);

    await waitFor(() => {
      expect(screen.getAllByText('공지사항')[0]).toBeInTheDocument();
    });

    // 카테고리 필터링 확인
    expect(screen.getByText('참고자료')).toBeInTheDocument();
    expect(screen.getByText('질문')).toBeInTheDocument();
  });

  test('API 호출 실패 시 fallback 데이터가 표시된다', async () => {
    mockGalleryAPI.getGallery.mockRejectedValue(new Error('Network Error'));

    render(<Notice />);

    await waitFor(() => {
      // getAllByText를 사용하여 중복 텍스트 처리
      const elements = screen.getAllByText('센터 운영 시간 변경 안내');
      expect(elements.length).toBeGreaterThan(0);
    });
  });

  test('관리자일 때 공지사항 작성 버튼이 표시된다', async () => {
    const { isAdmin } = require('../../utils/auth');
    isAdmin.mockReturnValue(true);

    render(<Notice />);

    await waitFor(() => {
      expect(screen.getByText('새 공지사항 작성')).toBeInTheDocument();
    });
  });

  test('공지사항이 없을 때 적절한 메시지가 표시된다', async () => {
    mockGalleryAPI.getGallery.mockResolvedValue({ posts: [], total: 0 });

    render(<Notice />);

    await waitFor(() => {
      expect(screen.getByText('공지사항이 없습니다.')).toBeInTheDocument();
    });
  });
});
