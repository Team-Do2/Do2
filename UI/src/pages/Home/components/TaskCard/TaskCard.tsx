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
      <PinButton isPinned={task.isPinned} onClick={handlePinClick} width="1.5rem" height="1.5rem" />
      <div className={`task-card-content ${isExpanded ? 'task-card-content-expanded' : ''}`}>
        <CheckboxButton
          checked={task.isDone}
          onClick={handleCheckboxClick}
          width="1.75rem"
          height="1.75rem"
        />
        <h1 className="task-card-title">{task.name}</h1>
        <ExpandButton
          onClick={() => setIsExpanded(!isExpanded)}
          rotated={isExpanded}
          width="1.5rem"
          height="1.5rem"
        />
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
            width="2rem"
            height="2rem"
          />
          <DeleteButton
            onClick={() => {
              handleDeleteClick();
            }}
            width="1.5rem"
            height="2rem"
          />
        </div>
      )}
    </div>
  );
}

export default TaskCard;
