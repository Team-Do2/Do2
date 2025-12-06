import Modal from 'react-modal';
import { useState, useEffect } from 'react';
import './AddEditTagModal.css';

Modal.setAppElement('#root');

interface AddEditTagModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  tagToEdit?: {
    id: number;
    name: string;
    color: string;
  } | null;
  userEmail: string;
  onSave: (tag: { id?: number; name: string; color: string; userEmail: string }) => void;
}

const AddEditTagModal: React.FC<AddEditTagModalProps> = ({
  isOpen,
  onRequestClose,
  tagToEdit,
  userEmail,
  onSave,
}) => {
  const [name, setName] = useState('');
  const [color, setColor] = useState('');
  const [nameError, setNameError] = useState('');

  useEffect(() => {
    if (tagToEdit) {
      setName(tagToEdit.name);
      setColor(tagToEdit.color);
    } else {
      setName('');
      setColor('#000000');
    }
  }, [tagToEdit, isOpen]);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setName(value);
    if (value.length > 32) {
      setNameError('Name must be 32 characters or less');
    } else {
      setNameError('');
    }
  };

  const handleSave = () => {
    if (!name.trim()) return;
    onSave({
      id: tagToEdit?.id,
      name: name.trim(),
      color,
      userEmail,
    });
    onRequestClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel={tagToEdit ? 'Edit Tag' : 'Add Tag'}
      className="popup-modal-content"
      overlayClassName="popup-modal-overlay"
    >
      <h2>{tagToEdit ? 'Edit Tag' : 'Add Tag'}</h2>
      <div>
        <label>
          Name:
          <input
            style={{ color: '#9998ab' }}
            type="text"
            value={name}
            onChange={handleNameChange}
            placeholder="Tag name"
          />
        </label>
      </div>
      {nameError && <p className="error">{nameError}</p>}
      <div>
        <label>
          Color:
          <input type="color" value={color} onChange={(e) => setColor(e.target.value)} />
        </label>
      </div>
      <button onClick={handleSave} disabled={!name.trim() || !!nameError}>
        {tagToEdit ? 'Update' : 'Create'}
      </button>
      <button onClick={onRequestClose}>Cancel</button>
    </Modal>
  );
};

export default AddEditTagModal;
