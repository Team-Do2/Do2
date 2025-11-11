import './HomePage.css';
import { useGetAllUserTasks } from './services/TaskService';
import TaskCard from './components/TaskCard/TaskCard';

function HomePage() {
  function TaskList() {
    const { data, error } = useGetAllUserTasks('nnn10219@gmail.com');
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
      <h1>Welcome back!</h1>
      <TaskList />
    </>
  );
}

export default HomePage;
