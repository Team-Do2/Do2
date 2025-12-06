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
import {
  useGetUserSettings,
  useUpdateTheme,
  useUpdateTimeToDelete,
} from '../../services/SettingsService';

function SettingsPage() {
  const logOut = useAuthStore((state) => state.logOut);
  const setSiteTheme = useAuthStore((state) => state.setSiteTheme);
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
  const { data: settings } = useGetUserSettings(userEmail);
  const updateThemeMutation = useUpdateTheme();
  const updateTimeToDeleteMutation = useUpdateTimeToDelete();

  useEffect(() => {
    if (settings) {
      setTheme(settings.theme);
      setRetentionDays(settings.timeToDelete);
    }
  }, [settings]);

  const handleThemeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newTheme = e.target.value as 'light' | 'dark';
    setTheme(newTheme);
    setSiteTheme(newTheme);
    updateThemeMutation.mutate({ email: userEmail, theme: newTheme });
  };

  const handleRetentionDaysChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDays = Number(e.target.value);
    setRetentionDays(newDays);
    updateTimeToDeleteMutation.mutate({ email: userEmail, timeToDelete: newDays });
  };

  const handleLogout = () => {
    logOut();
    queryClient.removeQueries({ queryKey: ['getTasks'] });
    queryClient.removeQueries({ queryKey: ['getPinnedTasks'] });
    queryClient.removeQueries({ queryKey: ['getTasksBySearch'] });
    document.cookie = 'AuthToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
  };

  return (
    <>
      <a className="back-link" onClick={() => navigate('/')}>
        {'< Back to Tasks'}
      </a>
      <h1 className="settings-header">User Settings</h1>
      <div className="settings-page-container">
        <div className="current-user-row">
          <div className="current-user-info">
            <u>Currently Logged in as:</u> <br />
            {userData.data?.email} ({userData.data?.firstName} {userData.data?.lastName})
          </div>
          <button className="logout-button" onClick={handleLogout}>
            Log Out
          </button>
        </div>

        <hr className="divider" />

        <div className="account-settings">
          <h2>Account Details</h2>
          <button className="change-email-button" onClick={() => setIsEmailModalOpen(true)}>
            Change Email
          </button>
          <button className="change-password-button" onClick={() => setIsPasswordModalOpen(true)}>
            Change Password
          </button>
        </div>

        <hr className="divider" />

        <div className="theme-section">
          <h2>Theme</h2>
          <select value={theme} onChange={handleThemeChange}>
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
        </div>

        <hr className="divider" />

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
        </div>

        <hr className="divider" />

        <div className="user-tags-section">
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
