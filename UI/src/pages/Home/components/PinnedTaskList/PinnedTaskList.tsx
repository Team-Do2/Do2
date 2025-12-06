import './PinnedTaskList.css';
import { useGetPinnedUserTasks } from '../../../../services/TaskService';
import { useAuthStore } from '../../../../auth/authStore';
import TaskCard from '../TaskCard/TaskCard';
import type { Task } from '../../../../models/Task';

function TaskList({
  onEditTask,
  collapseAll,
}: {
  onEditTask: (task: Task) => void;
  collapseAll: number;
}) {
  const userEmail = useAuthStore((state: { userEmail?: string }) => state.userEmail);
  const { data, error } = useGetPinnedUserTasks(userEmail || '');
  if (error) return <pre>Error: {error.message}</pre>;
  if (!userEmail) return <div>Please log in to view your pinned tasks.</div>;

  const sortedTasks = data
    ? [...data].sort((a, b) => {
        if (a.isDone === b.isDone) return 0;
        return a.isDone ? 1 : -1;
      })
    : [];

  return (
    <div className="pinned-task-list-container">
      {sortedTasks.map((task) => (
        <TaskCard key={task.id} task={task} onEdit={onEditTask} collapseAll={collapseAll} />
      ))}
    </div>
  );
}

export default TaskList;
