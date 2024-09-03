'use client';

import React from 'react';
import { SessionProvider } from 'next-auth/react';

interface SessionProviderProp {
  children: React.ReactNode;
}

const SessionWrapper: React.FC<SessionProviderProp> = ({ children }) => <SessionProvider>{children}</SessionProvider>;

SessionWrapper.displayName = 'SessionWrapper';

export default SessionWrapper;
