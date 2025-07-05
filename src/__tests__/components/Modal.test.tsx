import { fireEvent, render, screen } from '@testing-library/react';
import { Modal } from '../../components/shared';

describe('Modal Component', () => {
  test('isOpen이 true일 때 모달이 렌더링된다', () => {
    render(
      <Modal isOpen={true} onClose={jest.fn()} title='테스트 모달'>
        <p>모달 내용</p>
      </Modal>
    );

    expect(screen.getByText('테스트 모달')).toBeInTheDocument();
    expect(screen.getByText('모달 내용')).toBeInTheDocument();
  });

  test('isOpen이 false일 때 모달이 렌더링되지 않는다', () => {
    render(
      <Modal isOpen={false} onClose={jest.fn()} title='테스트 모달'>
        <p>모달 내용</p>
      </Modal>
    );

    expect(screen.queryByText('테스트 모달')).not.toBeInTheDocument();
    expect(screen.queryByText('모달 내용')).not.toBeInTheDocument();
  });

  test('닫기 버튼 클릭 시 onClose가 호출된다', () => {
    const handleClose = jest.fn();
    render(
      <Modal isOpen={true} onClose={handleClose} title='테스트 모달'>
        <p>모달 내용</p>
      </Modal>
    );

    fireEvent.click(screen.getByLabelText('닫기'));
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  test('오버레이 클릭 시 onClose가 호출된다', () => {
    const handleClose = jest.fn();
    render(
      <Modal isOpen={true} onClose={handleClose} title='테스트 모달'>
        <p>모달 내용</p>
      </Modal>
    );

    fireEvent.click(screen.getByText('테스트 모달').closest('.modal-overlay')!);
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  test('ESC 키 누름 시 onClose가 호출된다', () => {
    const handleClose = jest.fn();
    render(
      <Modal isOpen={true} onClose={handleClose} title='테스트 모달'>
        <p>모달 내용</p>
      </Modal>
    );

    fireEvent.keyDown(document, { key: 'Escape' });
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  test('모달 내용 클릭 시 onClose가 호출되지 않는다', () => {
    const handleClose = jest.fn();
    render(
      <Modal isOpen={true} onClose={handleClose} title='테스트 모달'>
        <p>모달 내용</p>
      </Modal>
    );

    fireEvent.click(screen.getByText('모달 내용'));
    expect(handleClose).not.toHaveBeenCalled();
  });

  test('size prop이 올바른 클래스를 적용한다', () => {
    const { rerender } = render(
      <Modal isOpen={true} onClose={jest.fn()} title='테스트 모달' size='small'>
        <p>작은 모달</p>
      </Modal>
    );
    expect(screen.getByTestId('modal-content')).toHaveClass('modal-small');

    rerender(
      <Modal isOpen={true} onClose={jest.fn()} title='테스트 모달' size='large'>
        <p>큰 모달</p>
      </Modal>
    );
    expect(screen.getByTestId('modal-content')).toHaveClass('modal-large');
  });
});
