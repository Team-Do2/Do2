import './TaskList.css';
import { useGetAllUserTasks } from '../../../../services/TaskService';
import { useAuthStore } from '../../../../auth/authStore';
import TaskCard from '../TaskCard/TaskCard';
import type { Task } from '../../../../models/Task';
import { useEffect, useMemo, useState } from 'react';

function TaskList({
  onEditTask,
  collapseAll,
}: {
  onEditTask: (task: Task) => void;
  collapseAll: number;
}) {
  const userEmail = useAuthStore((state: { userEmail?: string }) => state.userEmail);
  const { data, error } = useGetAllUserTasks(userEmail || '');
  const [newTaskIds, setNewTaskIds] = useState<number[]>([]);

  const sortedTasks = useMemo(
    () => (data ? [...data].sort((a, b) => (a.isDone === b.isDone ? 0 : a.isDone ? 1 : -1)) : []),
    [data]
  );

  useEffect(() => {
    if (!data) return;
    const existingIds = sortedTasks.map((t) => t.id);
    const newIds = existingIds.filter((id) => !newTaskIds.includes(id));
    if (newIds.length > 0) {
      setNewTaskIds((prev) => [...prev, ...newIds]);

      const timer = setTimeout(() => {
        setNewTaskIds((prev) => prev.filter((id) => !newIds.includes(id)));
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [data, sortedTasks, newTaskIds]);

  if (error) return <pre>Error: {error.message}</pre>;
  if (!userEmail) return <div>Please log in to view your tasks.</div>;

  return (
    <div className="task-list-container">
      {sortedTasks.map((task) => (
        <div
          key={task.id}
          className={`task-card-wrapper ${newTaskIds.includes(task.id) ? 'task-card-enter' : ''}`}
        >
          <TaskCard task={task} onEdit={onEditTask} collapseAll={collapseAll} />
        </div>
      ))}
    </div>
  );
}

export default TaskList;
