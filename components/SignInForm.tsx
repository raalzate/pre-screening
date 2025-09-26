"use client"; 

import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import React from "react";

const GoogleIcon = () => (
  <svg className="w-5 h-5 mr-3" viewBox="0 0 48 48">
  </svg>
);

export default function SignInForm() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-8 bg-white shadow-lg rounded-xl border">
        <div>
          <h2 className="text-3xl font-extrabold text-center text-gray-900">
            Acceso al Portal
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Inicia sesión con tu cuenta de Google empresarial.
          </p>
        </div>

        {error === "DomainNotAllowed" && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md" role="alert">
            <p className="font-bold">Acceso Denegado</p>
            <p>Solo se permiten cuentas del dominio empresarial.</p>
          </div>
        )}

        <button
          onClick={() => signIn("google", { callbackUrl: "/admin" })}
          className="w-full flex items-center justify-center px-6 py-3 border border-gray-300 rounded-lg shadow-sm text-base font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
        >
          <GoogleIcon />
          Iniciar sesión con Google
        </button>
      </div>
    </div>
  );
}