import { Component, type ReactNode } from 'react';
import type { AxiosError } from 'axios';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
}

/**
 * Error boundary that catches authentication errors (401) and renders
 * a fallback UI instead of crashing. The axios interceptor handles
 * logging out the user, this boundary just prevents the error from
 * bubbling up and crashing the app.
 */
class AuthErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error | AxiosError): State {
    // Check if this is an auth-related error
    const axiosError = error as AxiosError;
    if (axiosError?.response?.status === 401) {
      return { hasError: true };
    }
    return { hasError: true };
  }

  componentDidCatch(error: Error | AxiosError, errorInfo: React.ErrorInfo) {
    const axiosError = error as AxiosError;
    // Only log non-401 errors as they are expected during auth transitions
    if (axiosError?.response?.status !== 401) {
      console.error('AuthErrorBoundary caught an error:', error, errorInfo);
    }
  }

  render() {
    if (this.state.hasError) {
      // Return fallback UI or null - the app will redirect to login
      return this.props.fallback ?? null;
    }

    return this.props.children;
  }
}

export default AuthErrorBoundary;
