import './SettingsPage.css';

import { useAuthStore } from '../../stores/authStore';
import { useQueryClient } from '@tanstack/react-query';
import TagList from './components/TagList/TagList';
import AddEditTagModal from './components/AddEditTagModal/AddEditTagModal';
import ChangeEmailModal from './components/ChangeEmailModal/ChangeEmailModal';
import ChangePasswordModal from './components/ChangePasswordModal/ChangePasswordModal';
import { useState, useEffect } from 'react';
import { useCreateTag } from '../../services/TagService';
import { useGetUser } from '../../services/UserService';
import { useUpdateEmail, useChangePassword } from '../../services/UserService';
import { useNavigate } from 'react-router-dom';

function SettingsPage() {
  const logOut = useAuthStore((state) => state.logOut);
  const queryClient = useQueryClient();
  const userEmail = useAuthStore((state) => state.userEmail || '');
  const [isTagModalOpen, setIsTagModalOpen] = useState(false);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const createTagMutation = useCreateTag();
  const userData = useGetUser(userEmail);
  const updateEmailMutation = useUpdateEmail();
  const changePasswordMutation = useChangePassword();
  const navigate = useNavigate();
  const [theme, setTheme] = useState('light');
  const [retentionDays, setRetentionDays] = useState(7);
  const [retentionHours, setRetentionHours] = useState(0);

  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  const handleThemeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTheme(e.target.value);
  };

  const handleRetentionDaysChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRetentionDays(Number(e.target.value));
  };

  const handleRetentionHoursChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRetentionHours(Number(e.target.value));
  };

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
      <a className="back-link" onClick={() => navigate('/')}>
        {'< Back to Tasks'}
      </a>
      <div className="settings-page-container">
        <h1 className="settings-header">User Settings</h1>
        <h2 className="current-user-info">
          <u>Currently Logged in as:</u> <br />
          {userData.data?.email}({userData.data?.firstName + ' ' + userData.data?.lastName})
        </h2>
        <button className="logout-button" onClick={handleLogout}>
          Log Out
        </button>
        <div className="account-settings">
          <h2>Account Details</h2>
          <button className="change-email-button" onClick={() => setIsEmailModalOpen(true)}>
            Change Email
          </button>
          <button className="change-password-button" onClick={() => setIsPasswordModalOpen(true)}>
            Change Password
          </button>
        </div>
        <div className="theme-section">
          <h2>Theme</h2>
          <select value={theme} onChange={handleThemeChange}>
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
        </div>
        <div className="retention-time-section">
          <h2>Completed Task Retention Time</h2>
          <label>Days: </label>
          <input
            type="number"
            value={retentionDays}
            onChange={handleRetentionDaysChange}
            min="0"
            max="365"
          />
          <label>Hours: </label>
          <input
            type="number"
            value={retentionHours}
            onChange={handleRetentionHoursChange}
            min="0"
            max="23"
          />
        </div>
        <div>
          <h2 className="user-tags-header">User Tags</h2>
          <TagList />
          <button className="add-tag-button" onClick={() => setIsTagModalOpen(true)}>
            Add Tag
          </button>
        </div>
        <AddEditTagModal
          isOpen={isTagModalOpen}
          onRequestClose={() => setIsTagModalOpen(false)}
          userEmail={userEmail}
          onSave={(tag) => {
            createTagMutation.mutate(tag);
          }}
        />
        <ChangeEmailModal
          isOpen={isEmailModalOpen}
          onRequestClose={() => setIsEmailModalOpen(false)}
          currentEmail={userEmail}
          onSave={async (data) => {
            await updateEmailMutation.mutateAsync(data);
          }}
          onSuccess={() => {
            handleLogout();
            navigate('/login');
          }}
        />
        <ChangePasswordModal
          isOpen={isPasswordModalOpen}
          onRequestClose={() => setIsPasswordModalOpen(false)}
          email={userEmail}
          onSave={async (data) => {
            await changePasswordMutation.mutateAsync(data);
          }}
          onSuccess={() => {
            handleLogout();
            navigate('/login');
          }}
        />
      </div>
    </>
  );
}

export default SettingsPage;
