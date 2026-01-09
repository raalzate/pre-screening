"use client";

import React, { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import DynamicForm from "@/components/DynamicForm";
import DynamicMCQForm from "@/components/DynamicMCQForm";
import ChallengeCard from "@/components/ChallengeCard";
import createApiClient from "@/lib/apiClient";
import { useAuth } from "@/context/AuthContext";
import { FormConfig } from "@/types/InputConfig";

// Función auxiliar para parsear JSON de forma segura
const safeParse = (jsonString: string | null | undefined) => {
  if (!jsonString) return null;
  try {
    return JSON.parse(jsonString);
  } catch (e) {
    console.error("Error parsing JSON result:", e);
    return null;
  }
};

export default function FormPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = React.use(params);
  const auth = useAuth();
  const api = useMemo(() => createApiClient(), []);

  const [form, setForm] = useState<FormConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Estado del acordeón
  const [isChallengeOpen, setIsChallengeOpen] = useState(false);

  // 1. Efecto para bloquear copiar/pegar (Anti-Cheat básico)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Bloquear Ctrl+C, Ctrl+A, Cmd+C, Cmd+A
      if ((e.ctrlKey || e.metaKey) && (e.key === "c" || e.key === "a")) {
        e.preventDefault();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  // 2. Efecto para cargar la data del formulario
  useEffect(() => {
    async function fetchForm() {
      if (!id || !auth.user) return;

      try {
        const response = await api.get(`/forms/${id}`);
        setForm(response.data);
      } catch (err: unknown) {
        // Manejo de error tipado
        const message = err instanceof Error ? err.message : "Error desconocido";
        setError(message);
      } finally {
        setLoading(false);
      }
    }

    fetchForm();
  }, [id, api, auth.user]);

  // Loading State: Diseño más limpio (Skeleton style)
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center text-gray-500">
        <svg className="animate-spin h-8 w-8 mb-4 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <span className="text-sm font-medium">Cargando evaluación...</span>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center text-red-500">
        <div className="bg-white p-6 rounded-lg shadow-md border border-red-100 max-w-md text-center">
          <h3 className="text-lg font-bold mb-2">Ocurrió un error</h3>
          <p>{error}</p>
          <Link href="/" className="mt-4 inline-block text-blue-500 hover:underline text-sm">
            Volver al inicio
          </Link>
        </div>
      </div>
    );
  }

  if (!form) return null;

  const defaultStep = auth.user?.step || null;
  const requirements = auth.user?.requirements || "";

  return (
    <div className="container mx-auto p-4">
      {/* Breadcrumb simple */}
      <nav className="mb-6">
        <Link
          href="/"
          className="inline-flex items-center text-sm text-gray-500 hover:text-blue-600 transition-colors"
        >
          <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Volver al inicio
        </Link>
      </nav>

      <h1 className="text-3xl font-bold mb-6 text-gray-900">{form.title}</h1>

      {/* --- ETAPA 1: PRE-SCREENING --- */}
      {defaultStep === "pre-screening" && (
        <DynamicForm
          form={form}
          defaultResult={safeParse(auth.user?.evaluation_result)}
          requirements={requirements}
        />
      )}

      {/* --- ETAPA 2: CERTIFICADO (MCQ) --- */}
      {defaultStep === "certified" && (
        <DynamicMCQForm
          defaultResult={safeParse(auth.user?.certification_result)}
        />
      )}

      {/* --- ETAPA 3: CHALLENGE (ACTIVO) --- */}
      {defaultStep === "challenge" && (
        <ChallengeCard
          defaultResult={safeParse(auth.user?.challenge_result)}
        />
      )}

      {/* --- ETAPA 4: ENTREVISTA (CON ACORDEÓN) --- */}
      {defaultStep === "interview" && (
        <div className="space-y-6">
          {/* Card de Estado Informativo */}
          <div className="bg-white border border-blue-100 rounded-xl p-6 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-bl-full -mr-4 -mt-4 z-0 pointer-events-none"></div>

            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 bg-blue-600 text-white rounded-lg shadow-sm">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-800">
                  Estás en tu proceso de entrevista
                </h3>
              </div>

              <p className="text-gray-600 mb-6 leading-relaxed">
                ¡Gracias por completar las demás etapas! Nuestro equipo se encuentra analizando tus resultados detalladamente.
              </p>

              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-md">
                <h4 className="font-bold text-blue-900 mb-1 text-sm uppercase tracking-wide">
                  ¿Qué sigue ahora?
                </h4>
                <p className="text-sm text-blue-800">
                  Si ya tuviste la entrevista, te sugerimos esperar el <strong>feedback</strong>.
                  Si aún no la has tenido, te invitamos a repasar el reto y prepararte para la sustentación del mismo.
                </p>
              </div>
            </div>
          </div>

          {/* Acordeón del Reto */}
          <div className={`border rounded-xl bg-white shadow-sm overflow-hidden transition-colors ${isChallengeOpen ? 'border-blue-200' : 'border-gray-200'}`}>
            <button
              onClick={() => setIsChallengeOpen(!isChallengeOpen)}
              className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-all text-left group"
            >
              <div className="flex items-center gap-3">
                <div className={`p-1.5 rounded-md transition-colors ${isChallengeOpen ? 'bg-blue-100 text-blue-600' : 'bg-gray-200 text-gray-600'}`}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                </div>
                <div>
                  <span className="font-semibold text-gray-700 block">Ver Reto (Challenge)</span>
                  <span className="text-xs text-gray-500 font-normal">Consulta la información del reto</span>
                </div>
              </div>

              <svg
                className={`w-5 h-5 text-gray-400 group-hover:text-gray-600 transform transition-transform duration-300 ease-in-out ${isChallengeOpen ? 'rotate-180' : ''}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Contenido Colapsable con animación simple */}
            {isChallengeOpen && (
              <div className="p-1 animate-in fade-in slide-in-from-top-1 duration-200">
                <div className="border-t border-gray-100 pt-4 px-4 pb-4">
                  <ChallengeCard
                    defaultResult={safeParse(auth.user?.challenge_result)}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}