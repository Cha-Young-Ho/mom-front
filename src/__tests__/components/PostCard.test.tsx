import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import { PostCard } from '../../components/shared';

// Mock the API functions including getCategoryColor
jest.mock('../../services/api', () => ({
  getCategoryColor: jest.fn(() => 'blue'),
}));

// Mock the auth utility
jest.mock('../../utils/auth', () => ({
  isAdmin: jest.fn(() => false),
}));

// Mock window.confirm
Object.defineProperty(window, 'confirm', {
  writable: true,
  value: jest.fn(() => true),
});

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

describe('PostCard Component', () => {
  const defaultProps = {
    post: mockPosts[0],
    categoryType: 'news' as const,
    onClick: jest.fn(),
    onDelete: jest.fn(),
    showAdminActions: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    // Reset window.confirm mock
    (window.confirm as jest.Mock).mockReturnValue(true);
  });

  test('게시글 정보가 올바르게 렌더링된다', () => {
    render(<PostCard {...defaultProps} />);

    expect(screen.getByText(mockPosts[0].title)).toBeInTheDocument();
    expect(
      screen.getByText(mockPosts[0].short_description!)
    ).toBeInTheDocument();
    expect(screen.getByText(mockPosts[0].category)).toBeInTheDocument();
  });

  test('카드 클릭 시 onClick이 호출된다', () => {
    const handleClick = jest.fn();
    render(<PostCard {...defaultProps} onClick={handleClick} />);

    fireEvent.click(screen.getByTestId('post-card'));
    expect(handleClick).toHaveBeenCalledWith(mockPosts[0]);
  });

  test('이미지가 있을 때 이미지가 렌더링된다', () => {
    render(<PostCard {...defaultProps} />);

    const image = screen.getByAltText(mockPosts[0].title);
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', mockPosts[0].image_url);
  });

  test('이미지가 없을 때 기본 이미지가 렌더링된다', () => {
    const postWithoutImage = { ...mockPosts[0], image_url: undefined };
    render(<PostCard {...defaultProps} post={postWithoutImage} />);

    const image = screen.getByAltText(postWithoutImage.title);
    expect(image).toHaveAttribute('src', '/images/default-post.svg');
  });

  test('관리자 액션이 표시될 때 삭제 버튼이 렌더링된다', () => {
    render(<PostCard {...defaultProps} showAdminActions={true} />);

    expect(screen.getByLabelText('게시글 삭제')).toBeInTheDocument();
  });

  test('삭제 버튼 클릭 시 onDelete가 호출된다', () => {
    const handleDelete = jest.fn();
    render(
      <PostCard
        {...defaultProps}
        showAdminActions={true}
        onDelete={handleDelete}
      />
    );

    fireEvent.click(screen.getByLabelText('게시글 삭제'));
    expect(handleDelete).toHaveBeenCalledWith(mockPosts[0].id);
  });

  test('삭제 버튼 클릭 시 카드 클릭 이벤트가 전파되지 않는다', () => {
    const handleClick = jest.fn();
    const handleDelete = jest.fn();
    render(
      <PostCard
        {...defaultProps}
        onClick={handleClick}
        showAdminActions={true}
        onDelete={handleDelete}
      />
    );

    fireEvent.click(screen.getByLabelText('게시글 삭제'));
    expect(handleDelete).toHaveBeenCalled();
    expect(handleClick).not.toHaveBeenCalled();
  });

  test('날짜가 올바른 형식으로 표시된다', () => {
    render(<PostCard {...defaultProps} />);

    // 날짜 형식: YYYY.MM.DD
    expect(screen.getByText(/2025\.07\.06/)).toBeInTheDocument();
  });

  test('카테고리 색상이 올바르게 적용된다', () => {
    render(<PostCard {...defaultProps} />);

    const categoryBadge = screen.getByText(mockPosts[0].category);
    expect(categoryBadge).toHaveClass('category-badge');
  });

  test('관리자가 아닐 때 삭제 버튼이 표시되지 않는다', () => {
    render(<PostCard {...defaultProps} showAdminActions={false} />);

    expect(screen.queryByLabelText('게시글 삭제')).not.toBeInTheDocument();
  });
});
