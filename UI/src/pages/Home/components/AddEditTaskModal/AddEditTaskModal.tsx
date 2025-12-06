import Modal from 'react-modal';
import { useState, useEffect } from 'react';
import {
  useCreateTask,
  useUpdateTaskName,
  useUpdateTaskDescription,
  useUpdateTaskSupertask,
  useUpdateTaskDueDate,
  useGetAllUserTasks,
} from '../../../../services/TaskService';
import { useAuthStore } from '../../../../stores/authStore';
import type { Task } from '../../../../models/Task';
import './AddEditTaskModal.css';

Modal.setAppElement('#root');

const AddEditTaskModal = ({
  isOpen,
  onRequestClose,
  task,
}: {
  isOpen: boolean;
  onRequestClose: () => void;
  task?: Task;
}) => {
  const { userEmail } = useAuthStore();
  const createTaskMutation = useCreateTask();
  const updateNameMutation = useUpdateTaskName();
  const updateDescriptionMutation = useUpdateTaskDescription();
  const updateSupertaskMutation = useUpdateTaskSupertask();
  const updateDueDateMutation = useUpdateTaskDueDate();
  const { data: allTasks } = useGetAllUserTasks(userEmail || '');

  const isEdit = !!task;

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [parentTaskId, setParentTaskId] = useState<number | null>(null);
  const [nameError, setNameError] = useState('');
  const [descriptionError, setDescriptionError] = useState('');

  useEffect(() => {
    if (isEdit && task) {
      setName(task.name);
      setDescription(task.description || '');
      setDueDate(task.dueDate ? task.dueDate.split('T')[0] : '');
      setParentTaskId(task.supertaskId || null);
    } else {
      setName('');
      setDescription('');
      setDueDate('');
      setParentTaskId(null);
    }
  }, [isEdit, task]);

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

  const handleDueDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDueDate(e.target.value);
  };

  const handleParentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setParentTaskId(value ? parseInt(value) : null);
  };

  const handleSubmit = () => {
    if (name.trim()) {
      if (isEdit && task) {
        // Update existing task
        if (name !== task.name) {
          updateNameMutation.mutate({ id: task.id, name });
        }
        if (description !== (task.description || '')) {
          updateDescriptionMutation.mutate({ id: task.id, description });
        }
        const originalDueDate = task.dueDate ? task.dueDate.split('T')[0] : '';
        if (dueDate !== originalDueDate) {
          updateDueDateMutation.mutate({ id: task.id, dueDate: dueDate || null });
        }
        if (parentTaskId !== (task.supertaskId || null)) {
          updateSupertaskMutation.mutate({ id: task.id, supertaskId: parentTaskId });
        }
        onRequestClose();
      } else {
        // Create new task
        createTaskMutation.mutate({
          name,
          description,
          userEmail: userEmail || '',
          supertaskId: parentTaskId,
          dueDate: dueDate || null,
        });
        setName('');
        setDescription('');
        setDueDate('');
        setParentTaskId(null);
        onRequestClose();
      }
    }
  };

  const isPending =
    createTaskMutation.isPending ||
    updateNameMutation.isPending ||
    updateDescriptionMutation.isPending ||
    updateSupertaskMutation.isPending ||
    updateDueDateMutation.isPending;

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel={isEdit ? 'Edit Task' : 'Add Task'}
      className="popup-modal-content"
      overlayClassName="popup-modal-overlay"
    >
      <div className="form-group">
        <label htmlFor="task-name">Name:</label>
        <input
          style={{ color: '#9998ab' }}
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
      <div className="form-group">
        <label htmlFor="task-due-date">Due Date:</label>
        <input
          style={{ color: '#9998ab' }}
          id="task-due-date"
          type="date"
          value={dueDate}
          onChange={handleDueDateChange}
        />
      </div>
      <div className="form-group">
        <label htmlFor="task-parent">Parent Task:</label>
        <select
          style={{ color: '#9998ab' }}
          id="task-parent"
          value={parentTaskId || ''}
          onChange={handleParentChange}
        >
          <option value="">No parent</option>
          {allTasks
            ?.filter((t) => t.id !== task?.id)
            .map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
        </select>
      </div>
      <div className="modal-actions">
        <button
          onClick={handleSubmit}
          disabled={isPending || !name.trim() || !!nameError || !!descriptionError}
        >
          {isPending ? (isEdit ? 'Updating...' : 'Adding...') : isEdit ? 'Update Task' : 'Add Task'}
        </button>
        <button onClick={onRequestClose}>Cancel</button>
      </div>
    </Modal>
  );
};

export default AddEditTaskModal;
