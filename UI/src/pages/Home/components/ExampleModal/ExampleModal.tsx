import Modal from "react-modal";
import "./ExampleModal.css";

Modal.setAppElement("#root");

interface ExampleModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
}

const ExampleModal: React.FC<ExampleModalProps> = ({
  isOpen,
  onRequestClose,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Example Modal"
      className="popup-modal-content"
      overlayClassName="popup-modal-overlay"
    >
      <h2>Example Modal</h2>
      <div>This is a dismissable popup using react-modal!</div>
      <button onClick={onRequestClose}>Close</button>
    </Modal>
  );
};

export default ExampleModal;
