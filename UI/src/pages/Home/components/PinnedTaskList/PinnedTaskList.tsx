import './PinnedTaskList.css';
import { useGetPinnedUserTasks } from '../../services/TaskService';
import TaskCard from '../TaskCard/TaskCard';

function TaskList() {
  const { data, error } = useGetPinnedUserTasks('nnn10219@gmail.com');
  if (error) return <pre>Error: {error.message}</pre>;
  return (
    <div className="pinned-task-list-container">
      {data.map((task) => (
        <TaskCard key={task.id} task={task} />
      ))}
    </div>
  );
}

export default TaskList;
