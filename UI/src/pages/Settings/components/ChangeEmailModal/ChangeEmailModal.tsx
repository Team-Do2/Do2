import Modal from 'react-modal';
import { useState, useEffect } from 'react';
import './ChangeEmailModal.css';

Modal.setAppElement('#root');

interface ChangeEmailModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  currentEmail: string;
  onSave: (data: { currentEmail: string; newEmail: string; password: string }) => Promise<void>;
  onSuccess: () => void;
}

const ChangeEmailModal: React.FC<ChangeEmailModalProps> = ({
  isOpen,
  onRequestClose,
  currentEmail,
  onSave,
  onSuccess,
}) => {
  const [newEmail, setNewEmail] = useState('');
  const [password, setPassword] = useState('');
  const [newEmailError, setNewEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isOpen) {
      setNewEmail('');
      setPassword('');
      setNewEmailError('');
      setPasswordError('');
      setError('');
    }
  }, [isOpen]);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleNewEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNewEmail(value);
    if (!validateEmail(value)) {
      setNewEmailError('Please enter a valid email address');
    } else {
      setNewEmailError('');
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);
    if (value.length < 6) {
      setPasswordError('Password must be at least 6 characters');
    } else {
      setPasswordError('');
    }
  };

  const handleSave = async () => {
    if (!newEmail.trim() || !password.trim() || newEmailError || passwordError) return;

    try {
      await onSave({ currentEmail, newEmail: newEmail.trim(), password });
      onSuccess();
      onRequestClose();
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'response' in err) {
        const axiosError = err as { response?: { data?: string } };
        setError(axiosError.response?.data || 'Failed to update email');
      } else {
        setError('Failed to update email');
      }
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Change Email"
      className="popup-modal-content"
      overlayClassName="popup-modal-overlay"
    >
      <h2>Change Email</h2>
      <div>
        <label>
          Current Email:
          <input style={{ color: '#9998ab' }} type="text" value={currentEmail} readOnly />
        </label>
      </div>
      <div>
        <label>
          New Email:
          <input
            style={{ color: '#9998ab' }}
            type="email"
            value={newEmail}
            onChange={handleNewEmailChange}
            placeholder="newemail@example.com"
          />
        </label>
        {newEmailError && <p className="error">{newEmailError}</p>}
      </div>
      <div>
        <label>
          Password:
          <input
            style={{ color: '#9998ab' }}
            type="password"
            value={password}
            onChange={handlePasswordChange}
            placeholder="Enter your password"
          />
        </label>
        {passwordError && <p className="error">{passwordError}</p>}
      </div>
      {error && <p className="error">{error}</p>}
      <button
        onClick={handleSave}
        disabled={!newEmail.trim() || !password.trim() || !!newEmailError || !!passwordError}
      >
        Update Email
      </button>
      <button onClick={onRequestClose}>Cancel</button>
    </Modal>
  );
};

export default ChangeEmailModal;
