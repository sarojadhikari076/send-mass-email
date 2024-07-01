import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Footer from '@/components/Footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Email Sender',
  description: 'Send emails with ease',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} bg-gray-200 max-w-md mx-auto p-5 flex flex-col gap-4 items-center justify-center min-h-screen`}
      >
        {children}
        <Footer />
      </body>
    </html>
  );
}
