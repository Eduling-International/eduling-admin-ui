import { AuthenticationService } from '@/api';
import { JwtClaims } from '@/models';
import { HttpStatusCode } from 'axios';
import { jwtDecode } from 'jwt-decode';
import { getServerSession, NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

function isValidJwt(obj: any): obj is JwtClaims {
  return (
    typeof obj.id === 'string' &&
    typeof obj.sub === 'string' &&
    typeof obj.role === 'string' &&
    typeof obj.iss === 'string' &&
    typeof obj.iat === 'number' &&
    typeof obj.exp === 'number' &&
    typeof obj.lcp === 'number'
  );
}

function decodeJwt(token: string): JwtClaims | null {
  const claims = jwtDecode<JwtClaims>(token);
  return isValidJwt(claims) ? claims : null;
}

const nextAuthOptions: NextAuthOptions = {
  session: {
    strategy: 'jwt',
    maxAge: 86400,
  },
  pages: {
    signIn: '/auth/sign-in',
    signOut: '/auth/sign-out',
  },
  providers: [
    CredentialsProvider({
      id: 'credentials',
      name: 'Credentials',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const ERROR_MESSAGE = 'Username or password is incorrect.';
        if (!credentials) {
          throw new Error(ERROR_MESSAGE);
        }
        const authService = new AuthenticationService();
        const res = await authService.login({
          username: credentials.username,
          password: credentials.password,
        });
        const data = res.data;
        if (res.status === HttpStatusCode.Ok && data?.accessToken) {
          const accessToken = data.accessToken;
          const claims = decodeJwt(accessToken);
          if (claims) {
            return {
              id: claims.id,
              name: claims.sub,
              email: claims.sub,
              role: claims.role,
              accessToken: accessToken,
            };
          }
        }
        throw new Error(ERROR_MESSAGE);
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      Object.assign(token, {
        id: user?.id ?? token.id,
        name: user?.name ?? token.name,
        email: user?.email ?? token.email,
        role: user?.role ?? token.role,
        accessToken: user?.accessToken ?? token.accessToken,
      });
      return token;
    },
    async session({ session, token }) {
      Object.assign(session.user, {
        id: token?.id ?? session.user.id,
        name: token?.name ?? session.user.name,
        email: token?.email ?? session.user.email,
        role: token?.role ?? session.user.role,
        accessToken: token?.accessToken ?? session.user.accessToken,
      });
      return session;
    },
  },
};

const getServerAuthSession = () => getServerSession(nextAuthOptions);

export { nextAuthOptions, getServerAuthSession };
