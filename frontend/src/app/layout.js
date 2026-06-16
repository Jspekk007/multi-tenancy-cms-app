import '@/assets/scss/tokens/main.scss';
import { Inter } from 'next/font/google';
import { AuthProvider } from '@/components/AuthProvider';
import { TRPCProvider } from '../trpc/TRPCProvider';
const inter = Inter({ subsets: ['latin'] });
export const metadata = {
    title: 'Atlas CMS - Multi-Tenant Content Management System',
    description: 'A multi-tenant content management system',
    icons: {
        icon: { url: '/favicon.svg', type: 'image/svg+xml' },
    },
};
export default function RootLayout({ children }) {
    return (<html lang="en">
      <body className={inter.className}>
        <TRPCProvider>
          <AuthProvider>{children}</AuthProvider>
        </TRPCProvider>
      </body>
    </html>);
}
//# sourceMappingURL=layout.js.map