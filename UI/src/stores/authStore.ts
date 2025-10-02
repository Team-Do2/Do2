import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { PersistOptions } from "zustand/middleware";

interface AuthState {
  isLoggedIn: boolean;
  logIn: () => void;
  logOut: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isLoggedIn: false,
      logIn: () => set({ isLoggedIn: true }),
      logOut: () => set({ isLoggedIn: false }),
    }),
    {
      name: "auth-storage",
    } as PersistOptions<AuthState>
  )
);
