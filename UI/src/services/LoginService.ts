import axios from 'axios';
import { useMutation } from '@tanstack/react-query';
import type { User } from '../models/User';

export interface LoginRequest {
  Email: string;
  Password: string;
}

export interface SignupRequest {
  Email: string;
  Password: string;
  FirstName: string;
  LastName: string;
}

async function loginRequest(
  request: LoginRequest
): Promise<{ success: boolean; error?: string; user?: User }> {
  try {
    const response = await axios.post(
      import.meta.env.VITE_API_URL + '/api/Authentication/AuthenticateUser',
      request,
      {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true,
      }
    );
    if (response.status === 200) {
      const userRes = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/User?email=${encodeURIComponent(request.Email)}`,
        { withCredentials: true }
      );
      return { success: true, user: userRes.data };
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

async function signupRequest(
  request: SignupRequest
): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await axios.post(
      import.meta.env.VITE_API_URL + '/api/User/CreateUserCredentials',
      request,
      {
        headers: { 'Content-Type': 'application/json' },
      }
    );
    if (response.status === 200) {
      return { success: true };
    } else {
      return { success: false, error: 'Signup failed' };
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.message || error.message || 'Network error';
      return { success: false, error: message };
    }
    return { success: false, error: 'Network error' };
  }
}

export function useSignup() {
  return useMutation({
    mutationFn: signupRequest,
  });
}
