import './LoginPage.css';

import { useState } from 'react';
import { useLogin } from './services/LoginService';
import { useAuthStore } from '../../stores/authStore';
import { useNavigate } from 'react-router-dom';

function LoginPage() {
  const logIn = useAuthStore((state) => state.logIn);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { mutate, isPending, isError, error, data } = useLogin();

  const handleLogin = () => {
    mutate(
      { Email: email, Password: password },
      {
        onSuccess: (result) => {
          if (result.success) {
            logIn(email);
            navigate('/');
          }
        },
      }
    );
  };

  return (
    <>
      <p>Login Page Works!</p>
      <input
        type="email"
        placeholder="Email"
        className="login-input"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        className="login-input"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin} disabled={isPending}>
        {isPending ? 'Logging in...' : 'Log In'}
      </button>
      {isError && (
        <div style={{ color: 'red', marginTop: 8 }}>
          {error instanceof Error ? error.message : 'Login failed'}
        </div>
      )}
      {data && !data.success && (
        <div style={{ color: 'red', marginTop: 8 }}>{data.error || 'Login failed'}</div>
      )}
    </>
  );
}

export default LoginPage;
