import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { PostForm } from '../../components/shared';

// Mock test data
const testCategories = ['공지사항', '참고자료', '센터소식'];

const createMockCreatePostRequest = () => ({
  title: '테스트 제목',
  content: '테스트 내용',
  category: '공지사항',
  short_description: '테스트 설명',
});

describe('PostForm Component', () => {
  const defaultProps = {
    isOpen: true,
    onClose: jest.fn(),
    onSubmit: jest.fn(),
    type: 'news' as const,
    categories: testCategories,
    title: '새 게시글 작성',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('폼이 올바르게 렌더링된다', () => {
    render(<PostForm {...defaultProps} />);

    expect(screen.getByTestId('title-input')).toBeInTheDocument();
    expect(screen.getByTestId('content-textarea')).toBeInTheDocument();
    expect(screen.getByTestId('category-select')).toBeInTheDocument();
    expect(screen.getByTestId('short-description-input')).toBeInTheDocument();
    expect(screen.getByText('저장')).toBeInTheDocument();
    expect(screen.getByText('취소')).toBeInTheDocument();
  });

  test('초기값이 있을 때 폼이 올바르게 채워진다', () => {
    const initialData = createMockCreatePostRequest();
    render(<PostForm {...defaultProps} initialData={initialData} />);

    expect(screen.getByDisplayValue(initialData.title)).toBeInTheDocument();
    expect(screen.getByDisplayValue(initialData.content)).toBeInTheDocument();
    expect(screen.getByDisplayValue(initialData.category)).toBeInTheDocument();
    expect(
      screen.getByDisplayValue(initialData.short_description)
    ).toBeInTheDocument();
  });

  test('유효한 데이터로 폼 제출이 가능하다', async () => {
    const handleSubmit = jest.fn();
    render(<PostForm {...defaultProps} onSubmit={handleSubmit} />);

    fireEvent.change(screen.getByTestId('title-input'), {
      target: { value: '테스트 제목' },
    });
    fireEvent.change(screen.getByTestId('content-textarea'), {
      target: { value: '테스트 내용' },
    });
    fireEvent.change(screen.getByTestId('category-select'), {
      target: { value: '공지사항' },
    });
    fireEvent.change(screen.getByTestId('short-description-input'), {
      target: { value: '테스트 요약' },
    });

    fireEvent.click(screen.getByText('저장'));

    await waitFor(() => {
      expect(handleSubmit).toHaveBeenCalledWith({
        title: '테스트 제목',
        content: '테스트 내용',
        category: '공지사항',
        short_description: '테스트 요약',
        image_url: '',
      });
    });
  });

  test('필수 필드가 비어있을 때 에러 메시지가 표시된다', async () => {
    render(<PostForm {...defaultProps} />);

    fireEvent.click(screen.getByText('저장'));

    await waitFor(() => {
      expect(screen.getByText('제목을 입력해주세요.')).toBeInTheDocument();
    });
    expect(screen.getByText('내용을 입력해주세요.')).toBeInTheDocument();
    // 카테고리는 기본값이 있어서 선택 필수가 아님
  });

  test('취소 버튼 클릭 시 onClose가 호출된다', () => {
    render(<PostForm {...defaultProps} />);

    fireEvent.click(screen.getByText('취소'));
    expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
  });

  test('이미지 업로드가 정상적으로 작동한다', async () => {
    render(<PostForm {...defaultProps} />);

    const fileInput = screen.getByTestId(
      'image-upload-input'
    ) as HTMLInputElement;
    const file = new File(['test image'], 'test.jpg', { type: 'image/jpeg' });

    fireEvent.change(fileInput, { target: { files: [file] } });

    await waitFor(() => {
      expect(screen.getByText('제거')).toBeInTheDocument();
    });
  });

  test('카테고리 옵션이 올바르게 렌더링된다', () => {
    render(<PostForm {...defaultProps} />);

    const categorySelect = screen.getByTestId(
      'category-select'
    ) as HTMLSelectElement;
    expect(categorySelect).toBeInTheDocument();
    testCategories.forEach(category => {
      expect(screen.getByText(category)).toBeInTheDocument();
    });
  });

  test('폼 로딩 상태일 때 버튼이 비활성화된다', async () => {
    // Mock the onSubmit to simulate a slow operation
    const slowSubmit = jest
      .fn()
      .mockImplementation(
        () => new Promise(resolve => setTimeout(resolve, 100))
      );
    render(<PostForm {...defaultProps} onSubmit={slowSubmit} />);

    // Fill out form and submit to trigger loading state
    fireEvent.change(screen.getByTestId('title-input'), {
      target: { value: '테스트 제목' },
    });
    fireEvent.change(screen.getByTestId('content-textarea'), {
      target: { value: '테스트 내용' },
    });

    fireEvent.click(screen.getByText('저장'));

    // During upload, the button should show loading text
    await waitFor(() => {
      expect(screen.getByText('게시글 저장 중...')).toBeInTheDocument();
    });
  });

  test('제목 길이 제한이 적용된다', async () => {
    render(<PostForm {...defaultProps} />);

    const longTitle = 'a'.repeat(101); // 100자 초과
    fireEvent.change(screen.getByTestId('title-input'), {
      target: { value: longTitle },
    });

    fireEvent.click(screen.getByText('저장'));

    await waitFor(() => {
      expect(
        screen.getByText('제목은 100자 이내로 입력해주세요.')
      ).toBeInTheDocument();
    });
  });
});
