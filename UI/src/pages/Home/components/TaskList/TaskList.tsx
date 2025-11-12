import './TaskList.css';
import { useGetAllUserTasks } from '../../../../services/TaskService';
import { useAuthStore } from '../../../../stores/authStore';
import TaskCard from '../TaskCard/TaskCard';

function TaskList() {
  const userEmail = useAuthStore((state: { userEmail?: string }) => state.userEmail);
  const { data, error } = useGetAllUserTasks(userEmail || '');
  if (error) return <pre>Error: {error.message}</pre>;
  if (!userEmail) return <div>Please log in to view your tasks.</div>;
  return (
    <div className="task-list-container">
      {data && data.map((task) => <TaskCard key={task.id} task={task} />)}
    </div>
  );
}

export default TaskList;
