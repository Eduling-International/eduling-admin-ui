import * as React from 'react';
import type { Metadata } from 'next';
import { Layout } from '@/components/auth/layout';
import { SignInForm } from '@/components/auth';

export const metadata = {
  title: `Eduling Dashboard | Sign in`,
} satisfies Metadata;

export default function Page(): React.JSX.Element {
  return (
    <Layout>
      <SignInForm />
    </Layout>
  );
}
