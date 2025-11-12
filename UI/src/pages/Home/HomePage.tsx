import './HomePage.css';
import PinnedTaskBar from './components/PinnedTaskBar/PinnedTaskBar';
import TaskList from './components/TaskList/TaskList';

function HomePage() {
  return (
    <div className="home-page-container">
      <PinnedTaskBar />
      <div className="home-page-main">
        <h1 className="home-page-title">Welcome back!</h1>
        <TaskList />
      </div>
    </div>
  );
}

export default HomePage;
