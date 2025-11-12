import './FilteredTaskList.css';
import { useGetUserTasksBySearch } from '../../services/TaskService';
import TaskCard from '../TaskCard/TaskCard';

function TaskList({ search }: { search: string }) {
  const { data, error } = useGetUserTasksBySearch('nnn10219@gmail.com', search);
  if (error) return <pre>Error: {error.message}</pre>;
  return (
    <div className="filtered-task-list-container">
      {data?.map((task) => (
        <TaskCard key={task.id} task={task} />
      ))}
    </div>
  );
}

export default TaskList;
