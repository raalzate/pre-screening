import SignInForm from '@/components/SignInForm';
import { Suspense } from 'react';

export default function SignInPage() {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <SignInForm />
    </Suspense>
  );
}