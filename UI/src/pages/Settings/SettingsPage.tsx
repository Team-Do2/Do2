import './SettingsPage.css';

import { useAuthStore } from '../../stores/authStore';
import { useQueryClient } from '@tanstack/react-query';
import TagList from './components/TagList/TagList';
import AddEditTagModal from './components/AddEditTagModal/AddEditTagModal';
import { useState } from 'react';
import { useCreateTag } from '../../services/TagService';

function SettingsPage() {
  const logOut = useAuthStore((state) => state.logOut);
  const queryClient = useQueryClient();
  const userEmail = useAuthStore((state) => state.userEmail || '');
  const [isTagModalOpen, setIsTagModalOpen] = useState(false);
  const createTagMutation = useCreateTag();

  const handleLogout = () => {
    // Clear user state
    logOut();
    queryClient.removeQueries({ queryKey: ['getTasks'] });
    queryClient.removeQueries({ queryKey: ['getPinnedTasks'] });
    queryClient.removeQueries({ queryKey: ['getTasksBySearch'] });

    // Remove AuthToken cookie (set to expired)
    document.cookie = 'AuthToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
  };

  return (
    <>
      <AddEditTagModal
        isOpen={isTagModalOpen}
        onRequestClose={() => setIsTagModalOpen(false)}
        userEmail={userEmail}
        onSave={(tag) => {
          createTagMutation.mutate(tag);
        }}
      />
      <p>Settings Page Works!</p>
      <button onClick={handleLogout}>Log Out</button>
      <div>
        <h1>User Tags:</h1>
        <TagList />
        <button onClick={() => setIsTagModalOpen(true)}>Add New Tag</button>
      </div>
    </>
  );
}

export default SettingsPage;
