import PinnedTaskList from '../PinnedTaskList/PinnedTaskList';
import SearchBar from '../SearchBar/SearchBar';
import { useState, useEffect, useRef } from 'react';
import './PinnedTaskBar.css';
import FilteredTaskList from '../FilteredTaskList/FilteredTaskList';
import type { Task } from '../../../../models/Task';

function PinnedTaskBar({ onEditTask }: { onEditTask: (task: Task) => void }) {
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState(search);

  const prevSearchRef = useRef(search);
  useEffect(() => {
    if (prevSearchRef.current !== search) {
      const handler = setTimeout(() => {
        setDebouncedSearch(search);
        prevSearchRef.current = search;
      }, 300); // debounce time
      return () => clearTimeout(handler);
    }
  }, [search]);

  return (
    <div className="pinned-task-bar">
      <SearchBar value={search} onChange={(e) => setSearch(e.target.value)} />
      {debouncedSearch ? (
        <FilteredTaskList search={debouncedSearch} onEditTask={onEditTask} />
      ) : (
        <PinnedTaskList onEditTask={onEditTask} />
      )}
    </div>
  );
}

export default PinnedTaskBar;
