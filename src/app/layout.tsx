import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from 'sonner';
import { Header } from '@/components/header';
import { AuthenticatedSidebar } from '@/components/sidebar/components/authenticated-sidebar';
import { ThemeProvider } from '@/components/theme/theme-provider';
import { ReactQueryProvider } from './_providers/react-query/react-query-provider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'The Road to Next',
  description: 'My Road to Next application ...',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html suppressHydrationWarning lang="en">
      <body className={inter.className}>
        <ThemeProvider>
          <ReactQueryProvider>
            <Header />
            <div className="flex h-screen overflow-hidden border-collapse">
              <AuthenticatedSidebar />
              <main className="flex flex-col flex-1 min-h-screen px-8 py-24 overflow-x-hidden overflow-y-auto bg-secondary/20">
                {children}
              </main>
            </div>
            <Toaster expand />
          </ReactQueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
