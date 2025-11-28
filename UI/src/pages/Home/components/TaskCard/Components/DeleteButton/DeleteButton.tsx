import './DeleteButton.css';

function DeleteButton({
  onClick,
  width,
  height,
}: {
  onClick: () => void;
  width: string;
  height: string;
}) {
  return (
    <button className="delete-button" onClick={onClick}>
      <svg
        width={width}
        height={height}
        viewBox="0 0 49 70"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ display: 'block' }}
      >
        <g filter="url(#filter0_d_1_41)">
          <rect
            x="4.25"
            y="5.25"
            width="40.5"
            height="5.97368"
            rx="2.98684"
            fill="currentColor"
            stroke="var(--btn-center)"
            strokeWidth="0.5"
          />
          <rect
            x="4.25"
            y="12.1974"
            width="40.5"
            height="49.1316"
            rx="5.75"
            fill="currentColor"
            stroke="var(--btn-center)"
            strokeWidth="0.5"
          />
          <rect
            x="23.421"
            y="22.7368"
            width="2.15789"
            height="25.8947"
            rx="1.07895"
            fill="var(--btn-center)"
          />
          <rect
            x="14.7894"
            y="22.7368"
            width="2.15789"
            height="25.8947"
            rx="1.07895"
            fill="var(--btn-center)"
          />
          <rect
            x="32.0526"
            y="22.7368"
            width="2.15789"
            height="25.8947"
            rx="1.07895"
            fill="var(--btn-center)"
          />
          <rect
            x="21.25"
            y="0.25"
            width="5.97368"
            height="3.81579"
            rx="1.75"
            fill="currentColor"
            stroke="var(--btn-center)"
            strokeWidth="0.5"
          />
        </g>
      </svg>
    </button>
  );
}

export default DeleteButton;
