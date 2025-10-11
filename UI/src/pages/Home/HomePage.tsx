import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ExampleModal from './components/ExampleModal/ExampleModal';
import reactLogo from '../../assets/react.svg';
import viteLogo from '/vite.svg';
import './HomePage.css';
import { useGetTasks } from './services/ExampleService';
import TaskCard from './components/TaskCard/TaskCard';

function HomePage() {
  const [count, setCount] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();

  function BackendResultDisplay() {
    const { data, error } = useGetTasks();
    if (error) return <pre>Error: {error.message}</pre>;
    return (
      <>
        {data.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
      </>
    );
  }

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React = Do2</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>count is {count}</button>
        <button style={{ marginLeft: '1rem' }} onClick={() => setModalOpen(true)}>
          Show Popup
        </button>
        <button style={{ marginLeft: '1rem' }} onClick={() => navigate('/settings')}>
          Go to Settings
        </button>
        <p>
          Edit <code>src/pages/Home/HomePage.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">Click on the Vite and React logos to learn more</p>
      <div style={{ marginTop: '2rem' }}>
        <h2>Backend Response:</h2>
        <BackendResultDisplay />
      </div>
      <ExampleModal isOpen={modalOpen} onRequestClose={() => setModalOpen(false)} />
    </>
  );
}

export default HomePage;
