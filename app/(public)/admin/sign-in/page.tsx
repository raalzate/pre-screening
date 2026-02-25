'use client';

import SignInForm from '@/components/SignInForm';
import { Suspense, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function SignInPage() {
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/admin');
    }
  }, [status, router]);

  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <SignInForm />
    </Suspense>
  );
}