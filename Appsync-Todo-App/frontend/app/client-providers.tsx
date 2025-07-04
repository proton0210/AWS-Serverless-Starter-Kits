'use client';

import { AuthProvider } from '@/lib/auth-context';
import '@/lib/amplify-client';

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>;
}