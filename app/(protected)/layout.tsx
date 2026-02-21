'use client';

/**
 * (protected)/layout.tsx
 *
 * This layout wraps both:
 * 1. The candidate home page (/page.tsx) — uses AuthContext (custom code-based login via next-auth credentials)
 * 2. The admin Studio pages — use AdminHeader + next-auth session
 *
 * AuthContext.AuthProvider already contains SessionProvider internally, so we
 * don't need a separate AuthProvider from components/AuthProvider.tsx here.
 */

import { AuthProvider as AuthContextProvider } from '@/context/AuthContext';
import { Header } from '@/components/AdminHeader';
import { useSession } from 'next-auth/react';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, ReactNode } from 'react';

function AdminGuard({ children }: { children: ReactNode }) {
  const { status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  const isAdminPath = pathname?.startsWith('/admin/studio') ||
    pathname?.startsWith('/admin/candidates');

  useEffect(() => {
    // Only enforce redirect for protected admin paths, not candidate home
    if (isAdminPath && status === 'unauthenticated') {
      router.push('/admin/sign-in');
    }
  }, [status, isAdminPath, router]);

  // Show spinner only when loading admin paths
  if (isAdminPath && (status === 'loading' || (status === 'unauthenticated'))) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-sofka-gray">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-sofka-light-blue/30 border-t-sofka-light-blue rounded-full animate-spin mx-auto" />
          <p className="mt-4 font-medium text-sofka-dark-gray text-sm">Cargando...</p>
        </div>
      </div>
    );
  }

  // For admin paths: show AdminHeader + main content
  if (isAdminPath) {
    return (
      <div className="flex flex-col min-h-screen bg-sofka-gray">
        <Header />
        <main className="flex-grow container mx-auto px-4 md:px-8 py-8">
          {children}
        </main>
        <footer className="bg-white border-t border-gray-100 py-4 text-sm text-gray-400">
          <div className="container mx-auto px-4 text-center">
            © {new Date().getFullYear()} Sofka Technologies. All Rights Reserved.
          </div>
        </footer>
      </div>
    );
  }

  // For candidate home (/) — render children directly, no admin header
  return <>{children}</>;
}

export default function ProtectedLayout({ children }: { children: ReactNode }) {
  return (
    <AuthContextProvider>
      <AdminGuard>
        {children}
      </AdminGuard>
    </AuthContextProvider>
  );
}