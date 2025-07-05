import { fireEvent, render, screen } from '@testing-library/react';
import { CategoryFilter } from '../../components/shared';

// Mock test categories data
const testCategories = ['공지사항', '참고자료', '센터소식'];

describe('CategoryFilter Component', () => {
  const defaultProps = {
    categories: testCategories,
    selectedCategories: [],
    onCategoryChange: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('모든 카테고리가 렌더링된다', () => {
    render(<CategoryFilter {...defaultProps} />);

    testCategories.forEach(category => {
      expect(screen.getByText(category)).toBeInTheDocument();
    });
  });

  test('전체 버튼이 렌더링된다', () => {
    render(<CategoryFilter {...defaultProps} />);
    expect(screen.getByText('전체')).toBeInTheDocument();
  });

  test('카테고리 클릭 시 onCategoryChange가 호출된다', () => {
    const handleCategoryChange = jest.fn();
    render(
      <CategoryFilter
        {...defaultProps}
        onCategoryChange={handleCategoryChange}
      />
    );

    fireEvent.click(screen.getByText('공지사항'));
    expect(handleCategoryChange).toHaveBeenCalledWith(['공지사항']);
  });

  test('선택된 카테고리가 활성 상태로 표시된다', () => {
    render(
      <CategoryFilter {...defaultProps} selectedCategories={['공지사항']} />
    );

    const selectedButton = screen.getByText('공지사항');
    expect(selectedButton).toHaveClass('active');
  });

  test('전체 버튼 클릭 시 모든 카테고리가 해제된다', () => {
    const handleCategoryChange = jest.fn();
    render(
      <CategoryFilter
        {...defaultProps}
        selectedCategories={['공지사항', '센터소식']}
        onCategoryChange={handleCategoryChange}
      />
    );

    fireEvent.click(screen.getByText('전체'));
    expect(handleCategoryChange).toHaveBeenCalledWith([]);
  });

  test('이미 선택된 카테고리 클릭 시 해제된다', () => {
    const handleCategoryChange = jest.fn();
    render(
      <CategoryFilter
        {...defaultProps}
        selectedCategories={['공지사항']}
        onCategoryChange={handleCategoryChange}
      />
    );

    fireEvent.click(screen.getByText('공지사항'));
    expect(handleCategoryChange).toHaveBeenCalledWith([]);
  });

  test('여러 카테고리 선택이 가능하다', () => {
    const handleCategoryChange = jest.fn();
    render(
      <CategoryFilter
        {...defaultProps}
        selectedCategories={['공지사항']}
        onCategoryChange={handleCategoryChange}
      />
    );

    fireEvent.click(screen.getByText('센터소식'));
    expect(handleCategoryChange).toHaveBeenCalledWith(['공지사항', '센터소식']);
  });

  test('선택된 카테고리가 없을 때 전체 버튼이 활성 상태다', () => {
    render(<CategoryFilter {...defaultProps} />);

    const allButton = screen.getByText('전체');
    expect(allButton).toHaveClass('active');
  });
});
