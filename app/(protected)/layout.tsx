'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, ReactNode } from 'react';
import Link from 'next/link'; 
import Image from 'next/image'; 

// Colores basados en el estilo de Sofka Technologies
const sofkaColors = {
  blue: '#002C5E', // Azul oscuro principal
  lightBlue: '#0083B3', // Azul claro para acentos
  orange: '#FF5C00', // Naranja vibrante para acentos
  gray: '#F3F4F6', // Fondo neutro
  darkGray: '#4B5563', // Texto oscuro
};

const Header = ({ onLogout }: { onLogout: () => void }) => (
  <header className="bg-white shadow-sm sticky top-0 z-50">
    <div className="container mx-auto px-4 py-4 flex justify-between items-center">
      {/* Nuevo logo de Sofka */}
      <Link href="/">
        <Image 
          src="https://sofka.com.co/static/logo.svg" 
          alt="Sofka Technologies Logo" 
          className="h-10"
          width={200} 
          height={100}
        />
      </Link>
      <button
        onClick={onLogout}
        className="text-sm font-semibold px-4 py-2 rounded-lg transition-colors duration-300"
        style={{ color: sofkaColors.lightBlue, borderColor: sofkaColors.lightBlue, borderWidth: '1px' }}
      >
        Cerrar sesión
      </button>
    </div>
  </header>
);

const Footer = () => (
  <footer className="bg-white border-t border-gray-200 py-4 text-sm" style={{ color: sofkaColors.darkGray }}>
    <div className="container mx-auto px-4 text-center">
      &copy; {new Date().getFullYear()} Sofka Technologies. All Rights Reserved.
    </div>
  </footer>
);

const ProtectedLayout = ({ children }: { children: ReactNode }) => {
  const { user, isLoading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [isLoading, user, router]);

  if (isLoading || !user) {
    return (
      <div
        className="flex flex-col justify-center items-center min-h-screen"
        style={{ backgroundColor: sofkaColors.gray }}
      >
        <div className="text-center">
          <div
            className="animate-spin rounded-full h-16 w-16 border-t-4 border-solid mx-auto"
            style={{ borderColor: sofkaColors.lightBlue, borderTopColor: sofkaColors.orange }}
          ></div>
          <p className="mt-6 font-medium" style={{ color: sofkaColors.darkGray }}>
            Cargando...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen" style={{ backgroundColor: sofkaColors.gray }}>
      <Header onLogout={logout} />
      <main className="flex-grow container mx-auto p-4 md:p-8">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default ProtectedLayout;