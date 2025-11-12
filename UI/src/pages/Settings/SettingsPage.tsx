import './SettingsPage.css';

import { useAuthStore } from '../../stores/authStore';
import { useQueryClient } from '@tanstack/react-query';

function SettingsPage() {
  const logOut = useAuthStore((state) => state.logOut);
  const queryClient = useQueryClient();

  const handleLogout = () => {
    // Clear user state
    logOut();
    queryClient.removeQueries({ queryKey: ['getTasks'] });

    // Remove AuthToken cookie (set to expired)
    document.cookie = 'AuthToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
  };

  return (
    <>
      <p>Settings Page Works!</p>
      <button onClick={handleLogout}>Log Out</button>
    </>
  );
}

export default SettingsPage;
