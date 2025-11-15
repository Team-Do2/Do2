import Modal from 'react-modal';
import { useState } from 'react';
import { useCreateTask } from '../../../../services/TaskService';
import { useAuthStore } from '../../../../stores/authStore';
import './AddTaskModal.css';

Modal.setAppElement('#root');

interface AddTaskModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
}

const AddTaskModal: React.FC<AddTaskModalProps> = ({ isOpen, onRequestClose }) => {
  const { userEmail } = useAuthStore();
  const createTaskMutation = useCreateTask();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [nameError, setNameError] = useState('');
  const [descriptionError, setDescriptionError] = useState('');

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setName(value);
    if (value.length > 32) {
      setNameError('Name must be 32 characters or less');
    } else {
      setNameError('');
    }
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setDescription(value);
    if (value.length > 140) {
      setDescriptionError('Description must be 140 characters or less');
    } else {
      setDescriptionError('');
    }
  };

  const handleSubmit = () => {
    if (name.trim()) {
      createTaskMutation.mutate({ name, description, userEmail: userEmail || '' });
      setName('');
      setDescription('');
      onRequestClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Add Task"
      className="popup-modal-content"
      overlayClassName="popup-modal-overlay"
    >
      <h2>Add New Task</h2>
      <div className="form-group">
        <label htmlFor="task-name">Name:</label>
        <input
          id="task-name"
          type="text"
          value={name}
          onChange={handleNameChange}
          placeholder="Enter task name"
        />
      </div>
      {nameError && <p className="error">{nameError}</p>}
      <div className="form-group">
        <label htmlFor="task-description">Description:</label>
        <textarea
          id="task-description"
          value={description}
          onChange={handleDescriptionChange}
          placeholder="Enter task description"
          rows={4}
        />
      </div>
      {descriptionError && <p className="error">{descriptionError}</p>}
      <div className="modal-actions">
        <button
          onClick={handleSubmit}
          disabled={
            createTaskMutation.isPending || !name.trim() || !!nameError || !!descriptionError
          }
        >
          {createTaskMutation.isPending ? 'Adding...' : 'Add Task'}
        </button>
        <button onClick={onRequestClose}>Cancel</button>
      </div>
    </Modal>
  );
};

export default AddTaskModal;
