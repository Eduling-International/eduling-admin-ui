// next-auth.d.ts
import NextAuth, { DefaultSession, DefaultUser } from 'next-auth';
import { JWT } from 'next-auth/jwt';

declare module 'next-auth' {
  export interface Session {
    user: {
      id: string;
      role: string;
      accessToken: string;
    } & DefaultSession['user'];
  }

  export interface User extends DefaultUser {
    id: string;
    role: string;
    accessToken: string;
  }
}

declare module 'next-auth/jwt' {
  export interface JWT {
    id: string;
    role: string;
    accessToken: string;
  }
}
