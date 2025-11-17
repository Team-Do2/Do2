import './HomePage.css';

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PinnedTaskBar from './components/PinnedTaskBar/PinnedTaskBar';
import TaskList from './components/TaskList/TaskList';
import AddTaskButton from './components/AddTaskButton/AddTaskButton';
import AddEditTaskModal from './components/AddEditTaskModal/AddEditTaskModal';
import type { Task } from '../../models/Task';
import { useAuthStore } from '../../stores/authStore';
import SettingsButton from './components/SettingsButton/SettingsButton';
import CollapseButton from './components/CollapseButton/CollapseButton';

function HomePage() {
  const navigate = useNavigate();
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [collapseAll, setCollapseAll] = useState(0);
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
      <CollapseButton onClick={() => setCollapseAll((c) => c + 1)} />
      <SettingsButton onClick={() => navigate('/settings')} />
      <AddTaskButton onClick={() => setIsAddTaskModalOpen(true)} />
      <PinnedTaskBar onEditTask={handleEditTask} collapseAll={collapseAll} />
      <div className="home-page-main">
        {userName ? (
          <h1 className="home-page-title">Welcome back, {userName}!</h1>
        ) : (
          <h1 className="home-page-title">Welcome back!</h1>
        )}
        <TaskList onEditTask={handleEditTask} collapseAll={collapseAll} />
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
