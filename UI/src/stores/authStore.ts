import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { PersistOptions } from 'zustand/middleware';

// Note: user will need to be included here eventually

interface AuthState {
  isLoggedIn: boolean;
  logIn: (email: string, name: string) => void;
  logOut: () => void;
  userEmail?: string;
  userName?: string;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isLoggedIn: false,
      logIn: (email: string, name: string) =>
        set({ isLoggedIn: true, userEmail: email, userName: name }),
      logOut: () => set({ isLoggedIn: false, userEmail: undefined, userName: undefined }),
    }),
    {
      name: 'auth-storage',
    } as PersistOptions<AuthState>
  )
);
