import type { Task } from '../../../../models/Task';
import { useUpdateTaskPinned, useUpdateTaskDone } from '../../services/TaskService';
import './TaskCard.css';
import PinButton from '../PinButton/PinButton';
import CheckboxButton from '../CheckboxButton/CheckboxButton';

interface TaskCardProps {
  task: Task;
}

function TaskCard({ task }: TaskCardProps) {
  const updateTaskDone = useUpdateTaskDone();
  const updateTaskPinned = useUpdateTaskPinned();

  const handleCheckboxClick = () => {
    updateTaskDone.mutate({ id: task.id, isDone: !task.isDone });
  };

  const handlePinClick = () => {
    updateTaskPinned.mutate({ id: task.id, isPinned: !task.isPinned });
  };

  return (
    <div className="task-card">
      <PinButton isPinned={task.isPinned} onClick={handlePinClick} />
      <div className="task-card-content">
        <CheckboxButton checked={task.isDone} onClick={handleCheckboxClick} />
        <span className="task-card-title">{task.name}</span>
      </div>
      <div className="task-card-description">{task.description}</div>
    </div>
  );
}

export default TaskCard;
