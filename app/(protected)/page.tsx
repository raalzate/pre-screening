'use client';

import Link from 'next/link';
import { useEffect, useState, useMemo } from 'react';
import { useAuth } from '@/context/AuthContext';
import createApiClient from '@/lib/apiClient';
import { toast } from 'react-hot-toast';

export default function Home() {
  const [formIds, setFormIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const auth = useAuth();
  const api = useMemo(() => createApiClient(), []);

  const isEvaluationComplete = useMemo(() => {
    try {
      if (auth.user?.evaluation_result) {
        const result = JSON.parse(auth.user.evaluation_result);
        return result?.isComplete === true;
      }
    } catch (e) {
      console.error("Error parsing evaluation result:", e);
    }
    return false;
  }, [auth.user]);

  useEffect(() => {
    async function fetchFormIds() {
      if (isEvaluationComplete) {
        setLoading(false);
        return;
      }

      if (!auth.user) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await api.get('/forms');
        setFormIds(response.data);
      } catch (err: any) {
        setError(err.message || 'No se pudieron cargar los formularios.');
        toast.error('No se pudieron cargar los formularios.');
      } finally {
        setLoading(false);
      }
    }

    fetchFormIds();
  }, [api, auth.user, isEvaluationComplete]);

  const getStepStatus = (stepName: string) => {
    if (!auth.user?.step) {
      return '';
    }
    const isActive = auth.user.step === stepName;
    let classes = 'pl-4 py-2 relative transition-all duration-300';

    if (isActive) {
      classes += ' font-semibold text-blue-700 bg-blue-50 border-l-4 border-blue-500';
    } else {
      classes += ' text-gray-700';
    }

    return classes;
  };

  const seniorityLevels: { [key: string]: string } = {
    'J': 'Junior',
    'SSR': 'Semi Senior',
    'SR': 'Senior',
  };

  const getInstructionalHeader = () => {
    if (!auth.user?.step) {
      return "Selecciona un formulario para comenzar tu evaluación.";
    }

    const currentStep = auth.user.step;

    switch (currentStep) {
      case 'pre-screening':
        return "Para continuar, selecciona el formulario del pre-screening.";
      case 'certified':
        return "Tu pre-screening ha sido completado. Ahora, selecciona el formulario para validar tus conocimientos.";
      case 'challenge':
        return "Tus conocimientos han sido validados. Selecciona el formulario para el reto técnico.";
      case 'interview':
        return "Tus conocimientos han sido validados y el reto técnico ha sido completado. Tu entrevista ha sido realizada.";
      default:
        return "Selecciona un formulario para comenzar tu evaluación.";
    }
  };

  if (auth.user?.step === 'feedback') {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <header className="text-center mb-12">
            <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-2">
              Resultados de tu Proceso
            </h1>
            <p className="text-lg text-gray-600">
              Has completado todas las etapas de evaluación. Aquí tienes el resumen de tu entrevista técnica.
            </p>
          </header>

          <div className="bg-white shadow-2xl rounded-2xl overflow-hidden border border-gray-100">
            <div className="bg-indigo-600 px-8 py-6 text-white">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold">Resumen de Entrevista</h2>
                  <p className="text-indigo-100 mt-1 opacity-90">Entrevistador: {auth.user.interviewer_name || 'Comité Técnico'}</p>
                </div>
                <div className={`px-4 py-2 rounded-full font-bold text-sm uppercase tracking-wider ${auth.user.interview_status === 'pasa' ? 'bg-green-400 text-green-900' :
                    auth.user.interview_status === 'no_pasa' ? 'bg-red-400 text-red-900' : 'bg-yellow-400 text-yellow-900'
                  }`}>
                  {auth.user.interview_status === 'pasa' ? 'Aprobado' :
                    auth.user.interview_status === 'no_pasa' ? 'No Aprobado' : 'En Espera'}
                </div>
              </div>
            </div>

            <div className="p-8">

              <div className="space-y-4">
                <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                  </svg>
                  Feedback Detallado
                </h3>
                <div className="bg-indigo-50 border-l-4 border-indigo-400 p-6 rounded-r-xl">
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap italic font-medium">
                    &quot;{auth.user.interview_feedback || 'Tu entrevista está siendo procesada. Vuelve pronto para ver el feedback.'}&quot;
                  </p>
                </div>
              </div>

              <div className="mt-10 pt-8 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4">
                <p className="text-sm text-gray-500 text-center sm:text-left">
                  Gracias por participar en nuestro proceso de selección.
                </p>
                <button
                  onClick={() => auth.logout()}
                  className="flex items-center gap-2 px-6 py-2 bg-gray-800 text-white rounded-lg font-bold hover:bg-black transition-all shadow-md active:scale-95"
                >
                  Cerrar Sesión
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isEvaluationComplete) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center p-8 bg-white rounded-lg shadow-xl max-w-lg mx-auto">
          <h1 className="text-4xl font-bold text-green-600 mb-4">¡Evaluación completada!</h1>
          <p className="text-lg text-gray-700">
            Has finalizado tu proceso de evaluación. Un miembro de nuestro equipo se pondrá en contacto contigo pronto con los siguientes pasos. ¡Gracias por tu tiempo!
          </p>
          <div className="mt-8">
            <button
              onClick={() => auth.logout()}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Cerrar sesión
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-center text-gray-500 animate-pulse text-lg">Cargando formularios...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center p-8 bg-white rounded-lg shadow-xl max-w-lg mx-auto">
          <h1 className="text-2xl font-bold text-red-500 mb-4">
            Error al cargar los formularios
          </h1>
          <p className="text-lg text-gray-700">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-800">
            Hola {auth.user?.name.toUpperCase()}, bienvenido a la plataforma de evaluación
          </h1>
          <p className="mt-2 text-gray-600 font-semibold">{getInstructionalHeader()}</p>
        </div>
      </header>

      <main className="container mx-auto p-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Columna Izquierda: Proceso de Evaluación */}
          <div className="w-full md:w-1/2">
            <div className="p-6 mb-8 bg-white rounded-lg shadow-md">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Proceso de Evaluación
              </h2>
              <div className="flex items-start mb-6 text-sm text-gray-600 italic">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 mr-2 mt-0.5 text-blue-500 flex-shrink-0">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h1a.75.75 0 00.75-.75V8.25a.75.75 0 00-1.5 0v.75H9z" clipRule="evenodd" />
                </svg>
                <p>
                  Tu avance entre cada etapa es revisado por un miembro de nuestro equipo. Una vez que tu evaluación sea validada, el siguiente paso se habilitará en la plataforma. Este proceso puede tomar tiempo.
                </p>
              </div>
              <ol className="space-y-2 text-gray-700">
                <li className={getStepStatus('pre-screening')}>
                  <span className="font-semibold">Paso 1: Pre-screening</span>
                  <p className="text-sm text-gray-600">
                    Responde un cuestionario para medir tu afinidad con la oportunidad.
                  </p>
                </li>
                <li className={getStepStatus('certified')}>
                  <span className="font-semibold">Paso 2: Certified</span>
                  <p className="text-sm text-gray-600">
                    Confirma los conocimientos que dominas a través de un desafío práctico.
                  </p>
                </li>
                <li className={getStepStatus('challenge')}>
                  <span className="font-semibold">Paso 3: Challenge</span>
                  <p className="text-sm text-gray-600">
                    Se te asignará un reto para que analices y prepares antes de tu entrevista.
                  </p>
                </li>
                <li className={getStepStatus('interview')}>
                  <span className="font-semibold">Paso 4: Entrevista (Sustentación)</span>
                  <p className="text-sm text-gray-600">
                    Sustentarás tu respuesta al reto. Esta etapa es clave para la decisión técnica.
                  </p>
                </li>
              </ol>
            </div>
          </div>

          {/* Columna Derecha: Formularios de Evaluación */}
          <div className="w-full md:w-1/2">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Selecciona tu evaluación
            </h2>
            <div className="grid grid-cols-1 gap-8">
              {formIds.map((id, index) => {
                const idParts = id.split('-');
                const seniorityCode = idParts[idParts.length - 1].toUpperCase();
                const seniority = seniorityLevels[seniorityCode] || seniorityCode;
                const isRecommended = index === 0; // Asume que el primer formulario es el recomendado

                return (
                  <Link key={id} href={`/forms/${id}`}>
                    <div className="block p-6 bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1 relative">
                      {isRecommended && (
                        <div className="absolute top-2 right-2 bg-yellow-500 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                          {/* Ícono de estrella */}
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                            <path fillRule="evenodd" d="M10.868 2.884c.365-.732 1.432-.732 1.797 0l1.206 2.428 2.684.39c.803.116 1.127 1.059.54 1.636l-1.948 1.898.46 2.678c.139.805-.705 1.423-1.427 1.045L10 12.396l-2.407 1.267c-.722.378-1.566-.24-1.427-1.045l.46-2.678-1.948-1.898c-.587-.577-.263-1.52.54-1.636l2.684-.39 1.206-2.428z" clipRule="evenodd" />
                          </svg>
                          Ingresar aquí
                        </div>
                      )}
                      <h2 className="text-xl font-semibold text-gray-700">{id.replace(/-/g, ' + ')}</h2>
                      <p className="mt-2 text-gray-500">
                        <span className="font-semibold text-gray-600">Nivel:</span> {seniority}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}