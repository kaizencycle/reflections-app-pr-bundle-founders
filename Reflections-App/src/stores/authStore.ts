import { create } from "zustand";
import { onAuth, getUser, isAuthenticated, logout, login } from "@/lib/auth";

type AuthState = {
  authenticated: boolean;
  user: { id: string; email: string; name?: string | null; roles?: string[] } | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  hasRole: (role: string) => boolean;
};

export const useAuth = create<AuthState>((set, get) => {
  set({ authenticated: isAuthenticated(), user: getUser(), login: async()=>{}, logout: async()=>{}, hasRole: ()=>false });

  onAuth("change", ({ authenticated, user }: any) => set({ authenticated, user }));
  onAuth("login",  ({ user }: any) => set({ authenticated: true, user }));
  onAuth("logout", () => set({ authenticated: false, user: null }));

  return {
    authenticated: isAuthenticated(),
    user: getUser(),
    login: async (email, password) => { await login({ email, password }); },
    logout: async () => { await logout(); },
    hasRole: (role: string) => !!get().user?.roles?.includes(role),
  };
});
