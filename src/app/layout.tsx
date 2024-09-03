import * as React from 'react';
import type { Viewport } from 'next';

import '@/styles/global.css';

import { UserProvider } from '@/contexts/user-context';
import { LocalizationProvider } from '@/components/core/localization-provider';
import { ThemeProvider } from '@/components/core/theme-provider/theme-provider';
import SessionWrapper from '@/components/auth/SessionProvider';
import AuthProvider from '@/core/contexts/AuthContext';
import { Roboto } from 'next/font/google';

const roboto = Roboto({
  subsets: ["latin", "vietnamese"],
  weight: ["300"],
})

export const viewport = {
  width: 'device-width',
  initialScale: 1,
} satisfies Viewport;

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps): React.JSX.Element {
  return (
    <html lang="en" className={roboto.className}>
      <body className={roboto.className}>
        <SessionWrapper>
          <LocalizationProvider>
            <AuthProvider>
              <UserProvider>
                <ThemeProvider>
                  {children}
                </ThemeProvider>
              </UserProvider>
            </AuthProvider>
          </LocalizationProvider>
        </SessionWrapper>
      </body>
    </html>
  );
}
