import { useRef, useState, useEffect } from 'react';
import './TaskDescription.css';
import ErrorModal from '../ErrorModal/ErrorModal';

interface TaskDescriptionProps {
  value: string | undefined;
  onBlur: (value: string) => void;
}

function TaskDescription({ value, onBlur }: TaskDescriptionProps) {
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [localValue, setLocalValue] = useState(value ?? '');
  const [showModal, setShowModal] = useState(false);

  // Sync localValue with prop value when not focused
  useEffect(() => {
    if (document.activeElement !== inputRef.current) {
      setLocalValue(value ?? '');
    }
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    if (newValue.length > 140) {
      const truncated = newValue.slice(0, 140);
      setLocalValue(truncated);
      setShowModal(true);
    } else {
      setLocalValue(newValue);
    }
  };

  const handleBlur = () => {
    if (localValue !== (value ?? '')) {
      onBlur(localValue);
    }
  };

  return (
    <div className="task-description-container">
      <textarea
        ref={inputRef}
        value={localValue}
        onChange={handleChange}
        onBlur={handleBlur}
        className="task-description-input"
        placeholder={!localValue ? 'Enter description...' : undefined}
        spellCheck={false}
      />
      <ErrorModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        message="Description must be 140 characters or less. Excess text has been removed."
      />
    </div>
  );
}

export default TaskDescription;
