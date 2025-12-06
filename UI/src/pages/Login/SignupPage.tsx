import './SignupPage.css';

import { useState } from 'react';
import { useSignup } from '../../services/LoginService';
import { useNavigate } from 'react-router-dom';

function SignupPage() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [verifyPassword, setVerifyPassword] = useState('');
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { mutate, isPending, isError, error, data } = useSignup();

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSignup = (e?: React.FormEvent) => {
    e?.preventDefault();
    let valid = true;

    if (!isValidEmail(email)) {
      setEmailError('Please enter a valid email address');
      valid = false;
    } else {
      setEmailError(null);
    }

    if (password !== verifyPassword) {
      setPasswordError('Passwords do not match');
      valid = false;
    } else if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      valid = false;
    } else {
      setPasswordError(null);
    }

    if (!valid) return;

    mutate(
      { Email: email, Password: password, FirstName: firstName, LastName: lastName },
      {
        onSuccess: (result) => {
          if (result.success) {
            navigate('/login');
          }
        },
      }
    );
  };

  return (
    <div className="signup-page">
      <div className="signup-card">
        <h1 className="brand">
          <img src="src\assets\logo.png" alt="Do2 Logo" />
        </h1>
        <h2 className="title">Sign Up</h2>

        <form className="signup-form" onSubmit={handleSignup}>
          <label className="field">
            <span className="field-label">First Name</span>
            <input
              type="text"
              placeholder="first name"
              className="signup-input"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
          </label>

          <label className="field">
            <span className="field-label">Last Name</span>
            <input
              type="text"
              placeholder="last name"
              className="signup-input"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </label>

          <label className="field">
            <span className="field-label">Email Address</span>
            <input
              type="email"
              placeholder="email"
              className="signup-input"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setEmailError(null);
              }}
              required
            />
          </label>

          <label className="field">
            <span className="field-label">Password</span>
            <input
              type="password"
              placeholder="password"
              className="signup-input"
              value={password}
              onChange={(e) => {
                const newPass = e.target.value;
                setPassword(newPass);
                if (newPass && newPass.length < 6) {
                  setPasswordError('Password must be at least 6 characters');
                } else if (verifyPassword && newPass !== verifyPassword) {
                  setPasswordError('Passwords do not match');
                } else {
                  setPasswordError(null);
                }
              }}
              required
            />
          </label>

          <label className="field">
            <span className="field-label">Verify Password</span>
            <input
              type="password"
              placeholder="verify password"
              className="signup-input"
              value={verifyPassword}
              onChange={(e) => {
                const newVerify = e.target.value;
                setVerifyPassword(newVerify);
                if (password && newVerify !== password) {
                  setPasswordError('Passwords do not match');
                } else if (password && password.length < 6) {
                  setPasswordError('Password must be at least 6 characters');
                } else {
                  setPasswordError(null);
                }
              }}
              required
            />
          </label>

          {emailError && <div className="error">{emailError}</div>}
          {passwordError && <div className="error">{passwordError}</div>}

          <button
            className="signup-button"
            type="submit"
            disabled={
              isPending ||
              !firstName ||
              !lastName ||
              !isValidEmail(email) ||
              !password ||
              !verifyPassword ||
              password.length < 6
            }
          >
            {isPending ? 'Signing up...' : 'Sign Up'}
          </button>
        </form>

        {isError && (
          <div className="error">{error instanceof Error ? error.message : 'Signup failed'}</div>
        )}
        {data && !data.success && <div className="error">{data.error || 'Signup failed'}</div>}

        <div className="login-link">
          Already have an account?{' '}
          <a className="login-link-button" onClick={() => navigate('/login')}>
            Log In
          </a>
        </div>
      </div>
    </div>
  );
}

export default SignupPage;
