import Modal from 'react-modal';
import { useState, useEffect } from 'react';
import './ChangePasswordModal.css';

Modal.setAppElement('#root');

interface ChangePasswordModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  email: string;
  onSave: (data: { email: string; currentPassword: string; newPassword: string }) => Promise<void>;
  onSuccess: () => void;
}

const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({
  isOpen,
  onRequestClose,
  email,
  onSave,
  onSuccess,
}) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [currentPasswordError, setCurrentPasswordError] = useState('');
  const [newPasswordError, setNewPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isOpen) {
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setCurrentPasswordError('');
      setNewPasswordError('');
      setConfirmPasswordError('');
      setError('');
    }
  }, [isOpen]);

  const handleCurrentPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCurrentPassword(value);
    if (value.length < 6) {
      setCurrentPasswordError('Password must be at least 6 characters');
    } else {
      setCurrentPasswordError('');
    }
  };

  const handleNewPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNewPassword(value);
    if (value.length < 6) {
      setNewPasswordError('Password must be at least 6 characters');
    } else {
      setNewPasswordError('');
    }
    // Also check confirm
    if (confirmPassword && value !== confirmPassword) {
      setConfirmPasswordError('Passwords do not match');
    } else {
      setConfirmPasswordError('');
    }
  };

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setConfirmPassword(value);
    if (value !== newPassword) {
      setConfirmPasswordError('Passwords do not match');
    } else {
      setConfirmPasswordError('');
    }
  };

  const handleSave = async () => {
    if (
      !currentPassword.trim() ||
      !newPassword.trim() ||
      !confirmPassword.trim() ||
      currentPasswordError ||
      newPasswordError ||
      confirmPasswordError
    )
      return;

    try {
      await onSave({ email, currentPassword, newPassword });
      onSuccess();
      onRequestClose();
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'response' in err) {
        const axiosError = err as { response?: { data?: string } };
        setError(axiosError.response?.data || 'Failed to change password');
      } else {
        setError('Failed to change password');
      }
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Change Password"
      className="popup-modal-content"
      overlayClassName="popup-modal-overlay"
    >
      <h2>Change Password</h2>
      <div>
        <label>
          Current Password:
          <input
            style={{ color: '#9998ab' }}
            type="password"
            value={currentPassword}
            onChange={handleCurrentPasswordChange}
            placeholder="Enter current password"
          />
        </label>
        {currentPasswordError && <p className="error">{currentPasswordError}</p>}
      </div>
      <div>
        <label>
          New Password:
          <input
            style={{ color: '#9998ab' }}
            type="password"
            value={newPassword}
            onChange={handleNewPasswordChange}
            placeholder="Enter new password"
          />
        </label>
        {newPasswordError && <p className="error">{newPasswordError}</p>}
      </div>
      <div>
        <label>
          Confirm New Password:
          <input
            style={{ color: '#9998ab' }}
            type="password"
            value={confirmPassword}
            onChange={handleConfirmPasswordChange}
            placeholder="Confirm new password"
          />
        </label>
        {confirmPasswordError && <p className="error">{confirmPasswordError}</p>}
      </div>
      {error && <p className="error">{error}</p>}
      <button
        onClick={handleSave}
        disabled={
          !currentPassword.trim() ||
          !newPassword.trim() ||
          !confirmPassword.trim() ||
          !!currentPasswordError ||
          !!newPasswordError ||
          !!confirmPasswordError
        }
      >
        Change Password
      </button>
      <button onClick={onRequestClose}>Cancel</button>
    </Modal>
  );
};

export default ChangePasswordModal;
