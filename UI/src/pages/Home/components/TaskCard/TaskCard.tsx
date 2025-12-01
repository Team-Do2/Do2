import type { Task } from '../../../../models/Task';
import {
  useUpdateTaskPinned,
  useUpdateTaskDone,
  useUpdateTaskDescription,
  useUpdateTaskName,
  useDeleteTask,
} from '../../../../services/TaskService';
import './TaskCard.css';
import PinButton from './Components/PinButton/PinButton';
import CheckboxButton from './Components/CheckboxButton/CheckboxButton';
import ExpandButton from './Components/ExpandButton/ExpandButton';
import DeleteButton from './Components/DeleteButton/DeleteButton';
import TagButton from './Components/TagButton/TagButton';
import EditButton from './Components/EditButton/EditButton';
import { useState, useEffect } from 'react';
import TaskDescription from './Components/TaskDescription/TaskDescription';
import TaskTitle from './Components/TaskTitle/TaskTitle';
import ManageTagsModal from '../ManageTagsModal/ManageTagsModal';
import TagComponent from '../../../Settings/components/TagComponent/TagComponent';

function TaskCard({
  task,
  onEdit,
  collapseAll,
}: {
  task: Task;
  onEdit: (task: Task) => void;
  collapseAll: number;
}) {
  const updateTaskDone = useUpdateTaskDone();
  const updateTaskPinned = useUpdateTaskPinned();
  const updateTaskDescription = useUpdateTaskDescription();
  const updateTaskName = useUpdateTaskName();
  const deleteTask = useDeleteTask();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isTagsModalOpen, setIsTagsModalOpen] = useState(false);

  useEffect(() => {
    setIsExpanded(false);
  }, [collapseAll]);

  const handleCheckboxClick = () => {
    updateTaskDone.mutate({ id: task.id, isDone: !task.isDone });
  };

  const handlePinClick = () => {
    updateTaskPinned.mutate({ id: task.id, isPinned: !task.isPinned });
  };

  const handleDescriptionChange = (value: string) => {
    updateTaskDescription.mutate({ id: task.id, description: value });
  };

  const handleTitleChange = (value: string) => {
    updateTaskName.mutate({ id: task.id, name: value });
  };

  const handleDeleteClick = () => {
    deleteTask.mutate(task.id);
  };

  const handleEditClick = () => {
    onEdit(task);
  };

  const handleTagClick = () => {
    setIsTagsModalOpen(true);
  };

  return (
    <div
      className={'task-card'}
      onDoubleClick={(e) => {
        e.stopPropagation();
        setIsExpanded((prev) => !prev);
      }}
    >
      <PinButton isPinned={task.isPinned} onClick={handlePinClick} width="1.5rem" height="1.5rem" />
      <div className={`task-card-content ${isExpanded ? 'task-card-content-expanded' : ''}`}>
        <CheckboxButton
          checked={task.isDone}
          onClick={handleCheckboxClick}
          width="1.75rem"
          height="1.75rem"
        />
        <div className="title-and-tags">
          <TaskTitle value={task.name} onBlur={handleTitleChange} />
          {task.tags && (
            <div className="task-card-tags">
              {task.tags.map((tag) => (
                <TagComponent key={tag.id} tag={tag} />
              ))}
            </div>
          )}
        </div>
        <ExpandButton
          onClick={() => setIsExpanded(!isExpanded)}
          rotated={isExpanded}
          width="1.5rem"
          height="1.5rem"
        />
      </div>
      {isExpanded && (
        <div className="task-card-expanded-content">
          <TaskDescription
            value={task.description}
            onBlur={(value) => {
              handleDescriptionChange(value);
            }}
          />
          <div className="task-card-edit-button">
            <EditButton
              onClick={() => {
                handleEditClick();
              }}
              width="1.75rem"
              height="1.75rem"
            />
          </div>
          <TagButton
            onClick={() => {
              handleTagClick();
            }}
            width="2rem"
            height="2rem"
          />
          <div className="task-card-delete-button">
            <DeleteButton
              onClick={() => {
                handleDeleteClick();
              }}
              width="1.5rem"
              height="2rem"
            />
          </div>
        </div>
      )}
      {isExpanded && task.subtasks && task.subtasks.length > 0 && (
        <div className="task-card-subtasks">
          {task.subtasks.map((subtask) => (
            <TaskCard key={subtask.id} task={subtask} onEdit={onEdit} collapseAll={collapseAll} />
          ))}
        </div>
      )}
      <div className="task-card-footer">
        {task.dueDate && (
          <span className="task-due-date">Due: {new Date(task.dueDate).toLocaleDateString()}</span>
        )}
        {task.subtasks && task.subtasks.length > 0 && (
          <span className="task-subtask-count">Subtasks: {task.subtasks.length}</span>
        )}
      </div>

      <ManageTagsModal
        isOpen={isTagsModalOpen}
        onRequestClose={() => setIsTagsModalOpen(false)}
        taskId={task.id}
        currentTags={task.tags || []}
      />
    </div>
  );
}

export default TaskCard;
