import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { PersistOptions } from 'zustand/middleware';

// Note: user will need to be included here eventually

interface AuthState {
  isLoggedIn: boolean;
  logIn: (email: string) => void;
  logOut: () => void;
  userEmail?: string;
  userName?: string;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isLoggedIn: false,
      logIn: (email: string) => set({ isLoggedIn: true, userEmail: email }),
      logOut: () => set({ isLoggedIn: false, userEmail: undefined }),
    }),
    {
      name: 'auth-storage',
    } as PersistOptions<AuthState>
  )
);
