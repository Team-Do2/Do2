import './FilteredTaskList.css';
import { useGetUserTasksBySearch } from '../../services/TaskService';
import { useAuthStore } from '../../../../stores/authStore';
import TaskCard from '../TaskCard/TaskCard';

function TaskList({ search }: { search: string }) {
  const userEmail = useAuthStore((state: { userEmail?: string }) => state.userEmail);
  const { data, error } = useGetUserTasksBySearch(userEmail || '', search);
  if (error) return <pre>Error: {error.message}</pre>;
  if (!userEmail) return <div>Please log in to search your tasks.</div>;
  return (
    <div className="filtered-task-list-container">
      {data?.map((task) => (
        <TaskCard key={task.id} task={task} />
      ))}
    </div>
  );
}

export default TaskList;
