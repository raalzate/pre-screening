"use client";

import { useSession, signOut } from "next-auth/react";
import Image from "next/image"; // Para mostrar el avatar de Google

export const Header = () => {
  const { data: session, status } = useSession();

  const isAuthenticated = status === "authenticated";

  return (
    <header className="bg-white shadow-md border-b border-gray-200 w-full z-10">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <header className="bg-white shadow-sm sticky top-0 z-50">
            <div className="container mx-auto px-4 py-4 flex justify-between items-center">
              <Image
                src="https://sofka.com.co/static/logo.svg"
                alt="Sofka Technologies Logo"
                width={120}
                height={30}
                priority
              />
            </div>
          </header>

          <div>
            {status === "loading" && (
              <div className="animate-pulse h-8 w-24 bg-gray-200 rounded-md"></div>
            )}

            {isAuthenticated && session.user && (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  {session.user.image && (
                    <Image
                      src={session.user.image}
                      alt={session.user.name || "Avatar"}
                      width={32} // 32px
                      height={32} // 32px
                      className="rounded-full"
                    />
                  )}
                  <span className="text-sm font-medium text-gray-700 hidden sm:block">
                    {session.user.name}
                  </span>
                </div>
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-3 text-sm rounded-lg transition-colors"
                >
                  Cerrar Sesión
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};


