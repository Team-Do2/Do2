import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { PersistOptions } from 'zustand/middleware';

interface AuthState {
  isLoggedIn: boolean;
  logIn: (email: string, name: string) => void;
  logOut: () => void;
  userEmail?: string;
  userName?: string;
  theme: 'light' | 'dark';
  setSiteTheme: (theme: 'light' | 'dark') => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isLoggedIn: false,
      logIn: (email: string, name: string) =>
        set({ isLoggedIn: true, userEmail: email, userName: name }),
      logOut: () => set({ isLoggedIn: false, userEmail: undefined, userName: undefined }),
      theme: 'light',
      setSiteTheme: (theme: 'light' | 'dark') => {
        document.body.setAttribute('app-theme', theme);
        set({ theme });
      },
    }),
    {
      name: 'auth-storage',
      onRehydrateStorage: () => (state) => {
        if (state) {
          document.body.setAttribute('app-theme', state.theme);
        }
      },
    } as PersistOptions<AuthState>
  )
);
