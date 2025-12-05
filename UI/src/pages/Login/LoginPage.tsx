import './LoginPage.css';

import { useState } from 'react';
import { useLogin } from '../../services/LoginService';
import { useAuthStore } from '../../stores/authStore';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { type Settings } from '../../services/SettingsService';
import axios from 'axios';

function LoginPage() {
  const logIn = useAuthStore((state) => state.logIn);
  const setSiteTheme = useAuthStore((state) => state.setSiteTheme);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { mutate, isPending, isError, error, data } = useLogin();
  const queryClient = useQueryClient();

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleLogin = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!isValidEmail(email)) {
      setEmailError('Please enter a valid email address');
      return;
    }
    setEmailError(null);
    mutate(
      { Email: email, Password: password },
      {
        onSuccess: async (result) => {
          if (result.success && result.user) {
            logIn(email.toLowerCase(), result.user.firstName);
            try {
              const settings = await queryClient.fetchQuery<Settings>({
                queryKey: ['userSettings', email.toLowerCase()],
                queryFn: async () => {
                  const response = await axios.get<Settings>(
                    `${import.meta.env.VITE_API_URL}/api/settings/${encodeURIComponent(email.toLowerCase())}`,
                    { withCredentials: true }
                  );
                  return response.data;
                },
              });
              setSiteTheme(settings.theme);
            } catch {
              setSiteTheme('light');
            }
            navigate('/');
          }
        },
      }
    );
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h1 className="brand">
          <img src="src\assets\logo.png" alt="Do2 Logo" />
        </h1>
        <h2 className="title">Login</h2>

        <form className="login-form" onSubmit={handleLogin}>
          <label className="field">
            <span className="field-label">Email Address</span>
            <input
              type="email"
              placeholder="email"
              className="login-input"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setEmailError(null);
              }}
            />
          </label>

          <label className="field">
            <span className="field-label">Password</span>
            <input
              type="password"
              placeholder="password"
              className="login-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>

          {emailError && <div className="error">{emailError}</div>}

          <button
            className="login-button"
            type="submit"
            disabled={isPending || !isValidEmail(email) || !password}
          >
            {isPending ? 'Logging in...' : 'Log In'}
          </button>
        </form>

        {isError && (
          <div className="error">{error instanceof Error ? error.message : 'Login failed'}</div>
        )}
        {data && !data.success && <div className="error">Incorrect email or password provided</div>}

        <div className="signup-link">
          First time here?{' '}
          <a className="signup-link-button" onClick={() => navigate('/signup')}>
            Sign Up
          </a>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
