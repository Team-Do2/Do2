import './SettingsPage.css';
import { useAuthStore } from '../../stores/authStore';
import { useQueryClient } from '@tanstack/react-query';

function SettingsPage() {
  const logOut = useAuthStore((state) => state.logOut);
  const queryClient = useQueryClient();

  const handleLogout = () => {
    logOut();
    queryClient.removeQueries({ queryKey: ['getTasks'] });
  };

  return (
    <>
      <p>Settings Page Works!</p>
      <button onClick={handleLogout}>Log Out</button>
    </>
  );
}

export default SettingsPage;
