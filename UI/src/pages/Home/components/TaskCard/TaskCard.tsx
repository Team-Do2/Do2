import type { Task } from '../../../../models/Task';
import { useUpdateTask } from '../../services/TaskService';
import './TaskCard.css';
import PinButton from '../PinButton/PinButton';

interface TaskCardProps {
  task: Task;
}

function TaskCard({ task }: TaskCardProps) {
  const updateTask = useUpdateTask();

  const handleCheckboxChange = () => {
    const updatedTask = { ...task, isDone: !task.isDone };
    updateTask.mutate(updatedTask);
  };

  return (
    <div className="task-card">
      <div className="task-card-header">
        <PinButton />
        <input type="checkbox" checked={task.isDone} onChange={handleCheckboxChange} />
        <span className="task-card-title">{task.name}</span>
      </div>

      <div className="task-card-description">{task.description}</div>
    </div>
  );
}

export default TaskCard;
