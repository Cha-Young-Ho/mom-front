import { fireEvent, render, screen } from '@testing-library/react';
import { Button } from '../../components/shared';

describe('Button Component', () => {
  test('기본 버튼이 렌더링된다', () => {
    render(<Button>테스트 버튼</Button>);
    expect(
      screen.getByRole('button', { name: '테스트 버튼' })
    ).toBeInTheDocument();
  });

  test('클릭 이벤트가 정상적으로 실행된다', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>클릭 테스트</Button>);

    fireEvent.click(screen.getByRole('button', { name: '클릭 테스트' }));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  test('disabled 상태일 때 클릭이 방지된다', () => {
    const handleClick = jest.fn();
    render(
      <Button onClick={handleClick} disabled>
        비활성화 버튼
      </Button>
    );

    const button = screen.getByRole('button', { name: '비활성화 버튼' });
    expect(button).toBeDisabled();

    fireEvent.click(button);
    expect(handleClick).not.toHaveBeenCalled();
  });

  test('variant prop이 올바른 클래스를 적용한다', () => {
    const { rerender } = render(<Button variant='primary'>Primary</Button>);
    expect(screen.getByRole('button')).toHaveClass('btn-primary');

    rerender(<Button variant='secondary'>Secondary</Button>);
    expect(screen.getByRole('button')).toHaveClass('btn-secondary');

    rerender(<Button variant='danger'>Danger</Button>);
    expect(screen.getByRole('button')).toHaveClass('btn-danger');
  });

  test('size prop이 올바른 클래스를 적용한다', () => {
    const { rerender } = render(<Button size='small'>Small</Button>);
    expect(screen.getByRole('button')).toHaveClass('btn-small');

    rerender(<Button size='medium'>Medium</Button>);
    expect(screen.getByRole('button')).toHaveClass('btn-medium');

    rerender(<Button size='large'>Large</Button>);
    expect(screen.getByRole('button')).toHaveClass('btn-large');
  });

  test('커스텀 className이 추가된다', () => {
    render(<Button className='custom-class'>커스텀 버튼</Button>);
    expect(screen.getByRole('button')).toHaveClass('custom-class');
  });

  test('로딩 상태일 때 올바른 텍스트를 표시한다', () => {
    render(<Button loading>로딩 버튼</Button>);
    expect(screen.getByText('로딩 중...')).toBeInTheDocument();
  });
});
