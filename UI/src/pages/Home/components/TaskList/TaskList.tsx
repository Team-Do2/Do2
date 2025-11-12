import './TaskList.css';
import { useGetAllUserTasks } from '../../services/TaskService';
import TaskCard from '../TaskCard/TaskCard';

function TaskList() {
  const { data, error } = useGetAllUserTasks('nnn10219@gmail.com');
  if (error) return <pre>Error: {error.message}</pre>;
  return (
    <div className="task-list-container">
      {data.map((task) => (
        <TaskCard key={task.id} task={task} />
      ))}
    </div>
  );
}

export default TaskList;
