import { useRef, useState, useEffect } from 'react';
import './TaskDescription.css';

interface TaskDescriptionProps {
  value: string | undefined;
  onBlur: (value: string) => void;
}

function TaskDescription({ value, onBlur }: TaskDescriptionProps) {
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [localValue, setLocalValue] = useState(value ?? '');

  // Sync localValue with prop value when not focused
  useEffect(() => {
    if (document.activeElement !== inputRef.current) {
      setLocalValue(value ?? '');
    }
  }, [value]);

  return (
    <textarea
      ref={inputRef}
      value={localValue}
      onChange={(e) => setLocalValue(e.target.value)}
      onBlur={(e) => onBlur(e.target.value)}
      className="task-description-input"
      placeholder={!localValue ? 'Enter description...' : undefined}
    />
  );
}

export default TaskDescription;
