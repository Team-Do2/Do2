import { useRef, useState, useEffect } from 'react';
import './TaskTitle.css';
import ErrorModal from '../ErrorModal/ErrorModal';

interface TaskTitleProps {
  value: string;
  onBlur: (value: string) => void;
}

function TaskTitle({ value, onBlur }: TaskTitleProps) {
  const divRef = useRef<HTMLDivElement>(null);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const initialValueRef = useRef(value);

  useEffect(() => {
    // Update initial value when prop changes externally
    if (!isEditing) {
      initialValueRef.current = value;
    }
  }, [value, isEditing]);

  const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
    const newValue = e.currentTarget.textContent || '';
    if (newValue.length > 32) {
      // Truncate without disrupting cursor
      const selection = window.getSelection();
      if (!selection || !selection.rangeCount) return;

      const range = selection.getRangeAt(0);
      const cursorOffset = range.startOffset;

      e.currentTarget.textContent = newValue.slice(0, 32);

      // Restore cursor
      try {
        const newRange = document.createRange();
        const textNode = e.currentTarget.firstChild;
        if (textNode) {
          const newOffset = Math.min(cursorOffset, 32);
          newRange.setStart(textNode, newOffset);
          newRange.collapse(true);
          selection.removeAllRanges();
          selection.addRange(newRange);
        }
      } catch {
        // Fallback: place cursor at end
        const newRange = document.createRange();
        newRange.selectNodeContents(e.currentTarget);
        newRange.collapse(false);
        selection.removeAllRanges();
        selection.addRange(newRange);
      }

      setShowModal(true);
    }
  };

  const handleFocus = () => {
    setIsEditing(true);
  };

  const handleBlur = () => {
    setIsEditing(false);
    const currentValue = divRef.current?.textContent || '';
    if (currentValue.trim() && currentValue !== initialValueRef.current) {
      onBlur(currentValue);
    } else {
      if (divRef.current) {
        divRef.current.textContent = initialValueRef.current;
      }
    }
  };

  return (
    <div className="task-title-container">
      <div
        ref={divRef}
        contentEditable
        onInput={handleInput}
        onFocus={handleFocus}
        onBlur={handleBlur}
        className="task-title-input"
        suppressContentEditableWarning={true}
        spellCheck={false}
      >
        {value}
      </div>
      <ErrorModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        message="Title must be 32 characters or less. Excess text has been removed."
      />
    </div>
  );
}

export default TaskTitle;
