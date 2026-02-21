"use client";

import { AuthProvider } from '@/context/AuthContext';
import { SessionProvider } from "next-auth/react";
import { Toaster } from 'react-hot-toast';
import "./globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <SessionProvider>
          <AuthProvider>
            {children}
            <Toaster position="top-right" />
          </AuthProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
