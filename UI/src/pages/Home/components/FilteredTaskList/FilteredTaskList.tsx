import './FilteredTaskList.css';
import { useGetUserTasksBySearch } from '../../../../services/TaskService';
import { useAuthStore } from '../../../../auth/authStore';
import TaskCard from '../TaskCard/TaskCard';
import type { Task } from '../../../../models/Task';

function TaskList({
  search,
  onEditTask,
  collapseAll,
}: {
  search: string;
  onEditTask: (task: Task) => void;
  collapseAll: number;
}) {
  const userEmail = useAuthStore((state: { userEmail?: string }) => state.userEmail);
  const { data, error } = useGetUserTasksBySearch(userEmail || '', search);
  if (error) return <pre>Error: {error.message}</pre>;
  if (!userEmail) return <div>Please log in to search your tasks.</div>;
  return (
    <div className="filtered-task-list-container">
      {data?.map((task) => (
        <TaskCard key={task.id} task={task} onEdit={onEditTask} collapseAll={collapseAll} />
      ))}
    </div>
  );
}

export default TaskList;
