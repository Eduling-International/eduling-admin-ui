import { create } from 'zustand';
import { User } from 'next-auth';

interface AuthStoreState {
  user?: User;
  setSession: (user?: User) => void;
}

const useAuthStore = create<AuthStoreState>((set) => ({
  user: undefined,
  setSession: function (user?: User) {
    set(() => ({ user: user }));
  },
}));

export { useAuthStore };
