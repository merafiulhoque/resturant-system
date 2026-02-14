// src/app/layout.tsx

import type { Metadata } from 'next';
import { APP_CONFIG } from '@/constants';
import './globals.css';

export const metadata: Metadata = {
  title: APP_CONFIG.APP_NAME,
  description: APP_CONFIG.APP_TAGLINE,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        {children}
      </body>
    </html>
  );
}