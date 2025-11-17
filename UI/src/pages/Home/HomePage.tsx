import './HomePage.css';

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PinnedTaskBar from './components/PinnedTaskBar/PinnedTaskBar';
import TaskList from './components/TaskList/TaskList';
import AddTaskButton from './components/AddTaskButton/AddTaskButton';
import AddEditTaskModal from './components/AddEditTaskModal/AddEditTaskModal';
import type { Task } from '../../models/Task';
import { useAuthStore } from '../../stores/authStore';

function HomePage() {
  const navigate = useNavigate();
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const userName = useAuthStore((state) => state.userName);

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
  };

  const handleCloseModal = () => {
    setIsAddTaskModalOpen(false);
    setEditingTask(null);
  };

  return (
    <div className="home-page-container" style={{ position: 'relative' }}>
      <button
        style={{
          position: 'absolute',
          top: 16,
          right: 16,
          zIndex: 10,
          padding: '8px 16px',
          borderRadius: 6,
          border: 'none',
          background: '#eee',
          cursor: 'pointer',
          fontWeight: 500,
        }}
        onClick={() => navigate('/settings')}
        aria-label="Go to settings"
      >
        Settings
      </button>
      <AddTaskButton onClick={() => setIsAddTaskModalOpen(true)} />
      <PinnedTaskBar onEditTask={handleEditTask} />
      <div className="home-page-main">
        {userName ? (
          <h1 className="home-page-title">Welcome back, {userName}!</h1>
        ) : (
          <h1 className="home-page-title">Welcome back!</h1>
        )}
        <TaskList onEditTask={handleEditTask} />
      </div>
      <AddEditTaskModal
        isOpen={isAddTaskModalOpen || !!editingTask}
        onRequestClose={handleCloseModal}
        task={editingTask || undefined}
      />
    </div>
  );
}

export default HomePage;
