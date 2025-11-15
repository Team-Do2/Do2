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
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter task name"
        />
      </div>
      <div className="form-group">
        <label htmlFor="task-description">Description:</label>
        <textarea
          id="task-description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter task description"
          rows={4}
        />
      </div>
      <div className="modal-actions">
        <button onClick={handleSubmit} disabled={createTaskMutation.isPending || !name.trim()}>
          {createTaskMutation.isPending ? 'Adding...' : 'Add Task'}
        </button>
        <button onClick={onRequestClose}>Cancel</button>
      </div>
    </Modal>
  );
};

export default AddTaskModal;
