import { fireEvent, render, screen } from '@testing-library/react';
import { Modal } from '../../components/shared';

describe('Modal Component', () => {
  test('모달이 열린 상태일 때 title과 children이 렌더링된다', () => {
    render(
      <Modal isOpen={true} onClose={() => {}} title='테스트 모달'>
        <p>모달 내용</p>
      </Modal>
    );

    expect(screen.getByText('테스트 모달')).toBeInTheDocument();
    expect(screen.getByText('모달 내용')).toBeInTheDocument();
  });

  test('모달이 닫힌 상태일 때 렌더링되지 않는다', () => {
    render(
      <Modal isOpen={false} onClose={() => {}} title='테스트 모달'>
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

    const modalOverlay = screen.getByTestId('modal-overlay');
    fireEvent.click(modalOverlay);
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  test('ESC 키 누름 시 onClose가 호출된다', () => {
    const handleClose = jest.fn();
    render(
      <Modal isOpen={true} onClose={handleClose} title='테스트 모달'>
        <p>모달 내용</p>
      </Modal>
    );

    fireEvent.keyDown(document, { key: 'Escape', code: 'Escape' });
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

  test('다양한 크기의 모달이 올바르게 렌더링된다', () => {
    const { rerender } = render(
      <Modal isOpen={true} onClose={() => {}} title='작은 모달' size='small'>
        <p>작은 모달 내용</p>
      </Modal>
    );

    expect(screen.getByText('작은 모달')).toBeInTheDocument();

    rerender(
      <Modal isOpen={true} onClose={() => {}} title='큰 모달' size='large'>
        <p>큰 모달 내용</p>
      </Modal>
    );

    expect(screen.getByText('큰 모달')).toBeInTheDocument();
  });

  test('커스텀 className이 적용된다', () => {
    render(
      <Modal
        isOpen={true}
        onClose={() => {}}
        title='커스텀 모달'
        className='custom-modal'
      >
        <p>커스텀 모달 내용</p>
      </Modal>
    );

    expect(screen.getByText('커스텀 모달')).toBeInTheDocument();
  });
});
