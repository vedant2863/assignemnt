import { create } from "zustand";

const useAuthStore = create((set) => ({
  isAuthenticated: false, // Initial state
  setIsAuthenticated: (authState) => set({ isAuthenticated: authState }),
  logout: () => set({ isAuthenticated: false }),
}));

export default useAuthStore;
