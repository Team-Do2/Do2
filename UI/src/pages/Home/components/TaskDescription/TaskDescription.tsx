import { useRef } from 'react';
import './TaskDescription.css';

interface TaskDescriptionProps {
  value: string | undefined;
  onBlur: (value: string) => void;
}

function TaskDescription({ value, onBlur }: TaskDescriptionProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <input
      ref={inputRef}
      type="text"
      defaultValue={value}
      onBlur={(e) => onBlur(e.target.value)}
      className="task-description-input"
      placeholder={!value ? 'Enter description...' : undefined}
    />
  );
}

export default TaskDescription;
