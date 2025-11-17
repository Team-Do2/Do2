import './SettingsPage.css';

import { useAuthStore } from '../../stores/authStore';
import { useQueryClient } from '@tanstack/react-query';
import TagList from './components/TagList/TagList';
import AddEditTagModal from './components/AddEditTagModal/AddEditTagModal';
import { useState } from 'react';
import { useCreateTag } from '../../services/TagService';
import { useGetUser } from '../../services/UserService';
import { useNavigate } from 'react-router-dom';

function SettingsPage() {
  const logOut = useAuthStore((state) => state.logOut);
  const queryClient = useQueryClient();
  const userEmail = useAuthStore((state) => state.userEmail || '');
  const [isTagModalOpen, setIsTagModalOpen] = useState(false);
  const createTagMutation = useCreateTag();
  const userData = useGetUser(userEmail);
  const navigate = useNavigate();

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
    <div className="settings-page-container">
      <a className="back-link" onClick={() => navigate('/')}>
        {'< Back to Tasks'}
      </a>
      <h1 className="settings-header">User Settings</h1>
      <h2>
        <u>Currently Logged in as:</u> <br />
        {userData.data?.email}({userData.data?.firstName + ' ' + userData.data?.lastName})
      </h2>
      <button className="logout-button" onClick={handleLogout}>
        Log Out
      </button>
      <AddEditTagModal
        isOpen={isTagModalOpen}
        onRequestClose={() => setIsTagModalOpen(false)}
        userEmail={userEmail}
        onSave={(tag) => {
          createTagMutation.mutate(tag);
        }}
      />

      <div>
        <h2 className="user-tags-header">User Tags</h2>
        <TagList />
        <button className="add-tag-button" onClick={() => setIsTagModalOpen(true)}>
          Add Tag
        </button>
      </div>
    </div>
  );
}

export default SettingsPage;
