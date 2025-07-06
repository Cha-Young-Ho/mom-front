import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { PostPage } from '../../components/shared';

// Mock test data
const testCategories = ['공지사항', '참고자료', '센터소식'];

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

const mockAPI = {
  getPosts: jest.fn(),
  createPost: jest.fn(),
  deletePost: jest.fn(),
  loadPosts: jest.fn(),
};

// Mock isAdmin utility
jest.mock('../../utils/auth', () => ({
  isAdmin: jest.fn(() => false),
}));

// Mock window.confirm
const mockConfirm = jest.fn();
Object.defineProperty(window, 'confirm', {
  writable: true,
  value: mockConfirm,
});

describe('PostPage Component', () => {
  const defaultProps = {
    title: '테스트 페이지',
    description: '테스트 페이지 설명',
    categoryType: 'news' as const,
    categories: testCategories,
    loadPosts: mockAPI.loadPosts,
    createPost: mockAPI.createPost,
    deletePost: mockAPI.deletePost,
    fallbackPosts: mockPosts,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockConfirm.mockClear();
  });

  test('페이지가 올바르게 렌더링된다', async () => {
    render(<PostPage {...defaultProps} />);

    expect(screen.getByText('테스트 페이지')).toBeInTheDocument();
    expect(screen.getByText('테스트 페이지 설명')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('테스트 게시글 1')).toBeInTheDocument();
    });
  });

  test('로딩 상태가 표시된다', () => {
    mockAPI.loadPosts.mockImplementation(() => new Promise(() => {})); // Never resolves
    render(<PostPage {...defaultProps} />);

    expect(screen.getByText('데이터를 불러오는 중...')).toBeInTheDocument();
  });

  test('게시글이 없을 때 빈 메시지가 표시된다', async () => {
    mockAPI.loadPosts.mockResolvedValue({ posts: [] });
    render(<PostPage {...defaultProps} emptyMessage='게시글이 없습니다.' />);

    await waitFor(() => {
      expect(screen.getByText('게시글이 없습니다.')).toBeInTheDocument();
    });
  });

  test('카테고리 필터가 작동한다', async () => {
    render(<PostPage {...defaultProps} />);

    await waitFor(() => {
      expect(screen.getByText('공지사항')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('공지사항'));

    await waitFor(() => {
      // 마지막 호출에서 올바른 카테고리 배열이 전달되었는지 확인
      const lastCall =
        mockAPI.loadPosts.mock.calls[mockAPI.loadPosts.mock.calls.length - 1];
      expect(lastCall[0]).toEqual([['공지사항']]);
    });
  });

  test('게시글 카드 클릭 시 모달이 열린다', async () => {
    render(<PostPage {...defaultProps} />);

    await waitFor(() => {
      expect(screen.getByText('테스트 게시글 1')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('테스트 게시글 1'));

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });
  });

  test('페이지네이션이 작동한다', async () => {
    const manyPosts = Array.from({ length: 20 }, (_, i) => ({
      ...mockPosts[0],
      id: `${i + 1}`,
      title: `테스트 게시글 ${i + 1}`,
    }));

    mockAPI.loadPosts.mockResolvedValue({ posts: manyPosts });
    render(<PostPage {...defaultProps} itemsPerPage={9} />);

    await waitFor(() => {
      expect(screen.getByText('2')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('2'));

    // 페이지 변경 후 올바른 게시글들이 표시되는지 확인
    await waitFor(() => {
      expect(screen.getByText('테스트 게시글 10')).toBeInTheDocument();
    });
  });

  test('API 호출 실패 시 fallback 데이터가 표시된다', async () => {
    mockAPI.loadPosts.mockRejectedValue(new Error('API Error'));
    render(<PostPage {...defaultProps} />);

    await waitFor(() => {
      expect(screen.getByText('테스트 게시글 1')).toBeInTheDocument();
    });
  });

  test('관리자일 때 생성 버튼이 표시된다', async () => {
    const { isAdmin } = require('../../utils/auth');
    isAdmin.mockReturnValue(true);

    render(<PostPage {...defaultProps} createButtonText='새 게시글 작성' />);

    await waitFor(() => {
      expect(screen.getByText('새 게시글 작성')).toBeInTheDocument();
    });
  });

  test('게시글 생성이 정상적으로 작동한다', async () => {
    const { isAdmin } = require('../../utils/auth');
    isAdmin.mockReturnValue(true);

    render(<PostPage {...defaultProps} createButtonText='새 게시글 작성' />);

    await waitFor(() => {
      expect(screen.getByText('새 게시글 작성')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('새 게시글 작성'));

    await waitFor(() => {
      expect(screen.getByTestId('title-input')).toBeInTheDocument();
    });

    // 폼 작성
    fireEvent.change(screen.getByTestId('title-input'), {
      target: { value: '새 게시글' },
    });
    fireEvent.change(screen.getByTestId('content-textarea'), {
      target: { value: '새 게시글 내용' },
    });
    fireEvent.change(screen.getByTestId('category-select'), {
      target: { value: '공지사항' },
    });
    fireEvent.change(screen.getByTestId('short-description-input'), {
      target: { value: '새 게시글 요약' },
    });

    fireEvent.click(screen.getByText('저장'));

    await waitFor(() => {
      expect(mockAPI.createPost).toHaveBeenCalledWith({
        title: '새 게시글',
        content: '새 게시글 내용',
        category: '공지사항',
        short_description: '새 게시글 요약',
        image_url: '',
      });
    });
  });

  test('게시글 삭제가 정상적으로 작동한다', async () => {
    const { isAdmin } = require('../../utils/auth');
    isAdmin.mockReturnValue(true);
    mockConfirm.mockReturnValue(true);

    render(<PostPage {...defaultProps} />);

    await waitFor(() => {
      expect(screen.getByTestId('post-card')).toBeInTheDocument();
    });

    // 삭제 버튼을 찾기 위해 aria-label로 찾기
    const deleteButton = screen.getByLabelText('게시글 삭제');
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(mockAPI.deletePost).toHaveBeenCalledWith('1');
    });
  });
});
