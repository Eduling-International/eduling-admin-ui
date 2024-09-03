'use client';

import { paths } from '@/paths';
import { useAuthStore } from '@/store';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import React, { createContext, useEffect } from 'react';

interface AuthContextProps {
  children: React.ReactNode;
}

const AuthContext = createContext(undefined);

const AuthProvider: React.FC<AuthContextProps> = ({ children }) => {
  const { data: session, status } = useSession();
  const { setSession } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push(paths.auth.signIn);
      router.refresh();
    } else if (status === "authenticated") {
      setSession(session?.user);
    }
  }, [router, session?.user, setSession, status]);

  return (
    <AuthContext.Provider value={undefined}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;
