import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { PersistOptions } from "zustand/middleware";

// Note: user will need to be included here eventually
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
