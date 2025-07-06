import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import { Pagination } from '../../components/shared';

describe('Pagination Component', () => {
  const defaultProps = {
    currentPage: 1,
    totalPages: 10,
    onPageChange: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('페이지네이션이 올바르게 렌더링된다', () => {
    render(<Pagination {...defaultProps} />);

    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByLabelText('이전 페이지')).toBeInTheDocument();
    expect(screen.getByLabelText('다음 페이지')).toBeInTheDocument();
  });

  test('현재 페이지가 활성 상태로 표시된다', () => {
    render(<Pagination {...defaultProps} currentPage={3} />);

    const currentPageButton = screen.getByText('3');
    expect(currentPageButton).toHaveClass('active');
  });

  test('페이지 번호 클릭 시 onPageChange가 호출된다', () => {
    const handlePageChange = jest.fn();
    render(<Pagination {...defaultProps} onPageChange={handlePageChange} />);

    fireEvent.click(screen.getByText('2'));
    expect(handlePageChange).toHaveBeenCalledWith(2);
  });

  test('다음 페이지 버튼 클릭 시 onPageChange가 호출된다', () => {
    const handlePageChange = jest.fn();
    render(<Pagination {...defaultProps} onPageChange={handlePageChange} />);

    fireEvent.click(screen.getByLabelText('다음 페이지'));
    expect(handlePageChange).toHaveBeenCalledWith(2);
  });

  test('이전 페이지 버튼 클릭 시 onPageChange가 호출된다', () => {
    const handlePageChange = jest.fn();
    render(
      <Pagination
        {...defaultProps}
        currentPage={3}
        onPageChange={handlePageChange}
      />
    );

    fireEvent.click(screen.getByLabelText('이전 페이지'));
    expect(handlePageChange).toHaveBeenCalledWith(2);
  });

  test('첫 번째 페이지에서 이전 버튼이 비활성화된다', () => {
    render(<Pagination {...defaultProps} currentPage={1} />);

    const prevButton = screen.getByLabelText('이전 페이지');
    expect(prevButton).toBeDisabled();
  });

  test('마지막 페이지에서 다음 버튼이 비활성화된다', () => {
    render(<Pagination {...defaultProps} currentPage={10} />);

    const nextButton = screen.getByLabelText('다음 페이지');
    expect(nextButton).toBeDisabled();
  });

  test('페이지가 5개 이하일 때 모든 페이지가 표시된다', () => {
    render(<Pagination {...defaultProps} totalPages={3} />);

    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  test('페이지가 많을 때 축약 표시가 된다', () => {
    render(<Pagination {...defaultProps} currentPage={6} totalPages={20} />);

    const ellipsisElements = screen.getAllByText('...');
    expect(ellipsisElements.length).toBeGreaterThan(0);
  });

  test('첫 페이지와 마지막 페이지로 이동하는 버튼이 작동한다', () => {
    const handlePageChange = jest.fn();
    render(
      <Pagination
        {...defaultProps}
        currentPage={6}
        totalPages={20}
        onPageChange={handlePageChange}
      />
    );

    fireEvent.click(screen.getByLabelText('첫 페이지'));
    expect(handlePageChange).toHaveBeenCalledWith(1);

    fireEvent.click(screen.getByLabelText('마지막 페이지'));
    expect(handlePageChange).toHaveBeenCalledWith(20);
  });

  test('총 페이지가 1일 때 페이지네이션이 표시되지 않는다', () => {
    render(<Pagination {...defaultProps} totalPages={1} />);

    expect(screen.queryByLabelText('이전 페이지')).not.toBeInTheDocument();
    expect(screen.queryByLabelText('다음 페이지')).not.toBeInTheDocument();
  });
});
