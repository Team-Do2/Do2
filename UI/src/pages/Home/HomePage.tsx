import './HomePage.css';

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PinnedTaskBar from './components/PinnedTaskBar/PinnedTaskBar';
import TaskList from './components/TaskList/TaskList';
import AddTaskButton from './components/AddTaskButton/AddTaskButton';
import AddTaskModal from './components/AddTaskModal/AddTaskModal';

function HomePage() {
  const navigate = useNavigate();
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);

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
      <PinnedTaskBar />
      <div className="home-page-main">
        <h1 className="home-page-title">Welcome back!</h1>
        <TaskList />
      </div>
      <AddTaskModal
        isOpen={isAddTaskModalOpen}
        onRequestClose={() => setIsAddTaskModalOpen(false)}
      />
    </div>
  );
}

export default HomePage;
