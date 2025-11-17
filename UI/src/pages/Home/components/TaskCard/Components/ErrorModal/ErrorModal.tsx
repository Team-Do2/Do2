import Modal from 'react-modal';
import './ErrorModal.css';

Modal.setAppElement('#root');

interface ErrorModalProps {
  isOpen: boolean;
  onClose: () => void;
  message: string;
}

function ErrorModal({ isOpen, onClose, message }: ErrorModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Error"
      className="error-modal-content"
      overlayClassName="error-modal-overlay"
    >
      <h2>Error</h2>
      <p>{message}</p>
      <button onClick={onClose}>OK</button>
    </Modal>
  );
}

export default ErrorModal;
