import './ExpandButton.css';

interface ExpandButtonProps {
  onClick: () => void;
  rotated?: boolean;
  width: string;
  height: string;
}

function ExpandButton({ onClick, rotated, width, height }: ExpandButtonProps) {
  return (
    <div
      className="task-card-expand"
      onClick={onClick}
      style={{
        transform: rotated ? 'rotate(180deg)' : 'rotate(0deg)',
        transition: 'transform 0.2s',
      }}
    >
      <svg
        width={width}
        height={height}
        viewBox="0 0 67 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect
          x="7.07104"
          width="46"
          height="10"
          rx="5"
          transform="rotate(45 7.07104 0)"
          fill="currentColor"
        />
        <rect
          x="26.6533"
          y="32.8551"
          width="46"
          height="10"
          rx="5"
          transform="rotate(-45 26.6533 32.8551)"
          fill="currentColor"
        />
      </svg>
    </div>
  );
}

export default ExpandButton;
