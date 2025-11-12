import axios from 'axios';
import { useMutation } from '@tanstack/react-query';

export interface LoginRequest {
  Email: string;
  Password: string;
}

async function loginRequest(request: LoginRequest): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await axios.post(
      'http://localhost:5015/api/Authentication/AuthenticateUser',
      request,
      {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true,
      }
    );
    if (response.status === 200) {
      return { success: true };
    } else {
      return { success: false, error: 'Invalid credentials' };
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.message || error.message || 'Network error';
      return { success: false, error: message };
    }
    return { success: false, error: 'Network error' };
  }
}

export function useLogin() {
  return useMutation({
    mutationFn: loginRequest,
  });
}
