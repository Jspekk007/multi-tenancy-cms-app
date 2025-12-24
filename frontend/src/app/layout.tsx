import '@/assets/scss/tokens/main.scss';

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { TRPCProvider } from 'trpc/TRPCProvider';

import { AuthProvider } from '@/components/AuthProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Atlas CMS - Multi-Tenant Content Management System',
  description: 'A multi-tenant content management system',
  icons: {
    icon: { url: '/favicon.svg', type: 'image/svg+xml' },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }): JSX.Element {
  return (
    <html lang="en">
      <body className={inter.className}>
        <TRPCProvider>
          <AuthProvider>{children}</AuthProvider>
        </TRPCProvider>
      </body>
    </html>
  );
}
