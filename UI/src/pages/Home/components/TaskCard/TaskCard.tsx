import type { Task } from '../../../../models/Task';
import {
  useUpdateTaskPinned,
  useUpdateTaskDone,
  useUpdateTaskDescription,
  useDeleteTask,
} from '../../services/TaskService';
import './TaskCard.css';
import PinButton from '../PinButton/PinButton';
import CheckboxButton from '../CheckboxButton/CheckboxButton';
import ExpandButton from '../ExpandButton/ExpandButton';
import DeleteButton from '../DeleteButton/DeleteButton';
import TagButton from '../TagButton/TagButton';
import { useState } from 'react';
import TaskDescription from '../TaskDescription/TaskDescription';

interface TaskCardProps {
  task: Task;
}

function TaskCard({ task }: TaskCardProps) {
  const updateTaskDone = useUpdateTaskDone();
  const updateTaskPinned = useUpdateTaskPinned();
  const updateTaskDescription = useUpdateTaskDescription();
  const deleteTask = useDeleteTask();
  const [isExpanded, setIsExpanded] = useState(false);

  const handleCheckboxClick = () => {
    updateTaskDone.mutate({ id: task.id, isDone: !task.isDone });
  };

  const handlePinClick = () => {
    updateTaskPinned.mutate({ id: task.id, isPinned: !task.isPinned });
  };

  const handleDescriptionChange = (value: string) => {
    updateTaskDescription.mutate({ id: task.id, description: value });
  };

  const handleDeleteClick = () => {
    deleteTask.mutate(task.id);
  };

  const handleTagClick = (taskId: number) => {
    console.log(`Tag button clicked for task ID: ${taskId}`);
  };

  return (
    <div className={'task-card'}>
      <PinButton isPinned={task.isPinned} onClick={handlePinClick} />
      <div className={`task-card-content ${isExpanded ? 'task-card-content-expanded' : ''}`}>
        <CheckboxButton checked={task.isDone} onClick={handleCheckboxClick} />
        <span className="task-card-title">{task.name}</span>
        <ExpandButton onClick={() => setIsExpanded(!isExpanded)} rotated={isExpanded} />
      </div>
      {isExpanded && (
        <div className="task-card-footer">
          <TaskDescription
            value={task.description}
            onBlur={(value) => {
              handleDescriptionChange(value);
            }}
          />
          <TagButton
            onClick={() => {
              handleTagClick(task.id);
            }}
          />
          <DeleteButton
            onClick={() => {
              handleDeleteClick();
            }}
          />
        </div>
      )}
    </div>
  );
}

export default TaskCard;
