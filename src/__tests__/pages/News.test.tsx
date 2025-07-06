import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import News from '../../pages/News/News';
import { newsAPI } from '../../services/api';

// Mock the newsAPI and getCategoryColor
jest.mock('../../services/api', () => ({
  newsAPI: {
    getNews: jest.fn(),
    createNews: jest.fn(),
    deleteNews: jest.fn(),
  },
  getCategoryColor: jest.fn(() => 'blue'),
}));

// Mock isAdmin utility
jest.mock('../../utils/auth', () => ({
  isAdmin: jest.fn(() => false),
}));

const mockNewsAPI = newsAPI as jest.Mocked<typeof newsAPI>;

describe('News Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockNewsAPI.getNews.mockResolvedValue({
      posts: [
        {
          id: '1',
          title: '센터 소식 테스트',
          content: '센터 소식 내용',
          category: '센터소식',
          created_at: '2025-07-06T10:00:00Z',
          status: 'published',
          short_description: '센터 소식 요약',
        },
      ],
      total: 1,
    });
  });

  test('뉴스 페이지가 올바르게 렌더링된다', async () => {
    render(<News />);

    expect(screen.getAllByText('센터소식')[0]).toBeInTheDocument();
    expect(
      screen.getByText('센터의 다양한 소식과 프로그램 정보를 확인하세요.')
    ).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('센터 소식 테스트')).toBeInTheDocument();
    });
  });

  test('뉴스 카테고리 필터가 작동한다', async () => {
    render(<News />);

    await waitFor(() => {
      expect(screen.getAllByText('센터소식')[0]).toBeInTheDocument();
    });

    // 카테고리 필터링 확인
    expect(screen.getByText('행사소식')).toBeInTheDocument();
    expect(screen.getByText('생활정보')).toBeInTheDocument();
  });

  test('API 호출 실패 시 fallback 데이터가 표시된다', async () => {
    mockNewsAPI.getNews.mockRejectedValue(new Error('Network Error'));

    render(<News />);

    await waitFor(() => {
      expect(
        screen.getByText('2025년 가족상담 프로그램 운영 안내')
      ).toBeInTheDocument();
    });
  });

  test('관리자일 때 뉴스 작성 버튼이 표시된다', async () => {
    const { isAdmin } = require('../../utils/auth');
    isAdmin.mockReturnValue(true);

    render(<News />);

    await waitFor(() => {
      expect(screen.getByText('새 뉴스 작성')).toBeInTheDocument();
    });
  });

  test('뉴스가 없을 때 적절한 메시지가 표시된다', async () => {
    mockNewsAPI.getNews.mockResolvedValue({ posts: [], total: 0 });

    render(<News />);

    await waitFor(() => {
      expect(screen.getByText('뉴스가 없습니다.')).toBeInTheDocument();
    });
  });
});
