import type { Task } from '../../../../models/Task';

interface TaskCardProps {
  task: Task;
}

function TaskCard({ task }: TaskCardProps) {
  return (
    <div className="task-card">
      <input type="checkbox" checked={task.isCompleted} readOnly />
      <span>{task.name}</span>
    </div>
  );
}

export default TaskCard;
