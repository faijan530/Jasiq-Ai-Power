import { create } from "zustand";
import { persist } from "zustand/middleware";

export type UserRole = "STUDENT" | "ADMIN" | "PLACEMENT_OFFICER" | "RECRUITER";

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  tenantId?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  role: UserRole | null;
  isAuthenticated: boolean;

  setAuth: (data: { user: User; token: string }) => void;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      role: null,
      isAuthenticated: false,

      setAuth: (data) =>
        set({
          user: data.user,
          token: data.token,
          role: data.user.role,
          isAuthenticated: true,
        }),

      logout: () =>
        set({
          user: null,
          token: null,
          role: null,
          isAuthenticated: false,
        }),

      updateUser: (userData) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...userData } : null,
        })),
    }),
    {
      name: "jasiq-auth-storage",
    }
  )
);
