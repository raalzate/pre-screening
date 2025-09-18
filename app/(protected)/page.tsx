'use client';

import Link from 'next/link';
import { useEffect, useState, useMemo } from 'react';
import { useAuth } from '@/context/AuthContext';
import createApiClient from '@/lib/APIClient';
import { toast } from 'react-hot-toast';

export default function Home() {
  const [formIds, setFormIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const auth = useAuth();
  const api = useMemo(() => createApiClient(auth), [auth]);

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

  // Función para determinar el estado de cada paso y aplicar estilos
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

  // Mapeo para los niveles de seniority
  const seniorityLevels: { [key: string]: string } = {
    'J': 'Junior',
    'SSR': 'Semi Senior',
    'SR': 'Senior',
  };

  // Lógica para el nuevo header de instrucción
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
      default:
        return "Selecciona un formulario para comenzar tu evaluación.";
    }
  };

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
          {/* Nuevo header de instrucciones */}
          <p className="mt-2 text-gray-600 font-semibold">{getInstructionalHeader()}</p>
        </div>
      </header>
      
      <main className="container mx-auto p-8">
        <div className="p-6 mb-8 bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Proceso de Evaluación
          </h2>
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
            <li className={getStepStatus('entrevista')}>
              <span className="font-semibold">Paso 4: Entrevista</span>
              <p className="text-sm text-gray-600">
                Sustentarás tu respuesta al reto. Esta etapa es clave para la decisión técnica.
              </p>
            </li>
          </ol>
        </div>

        {/* Nuevo título para la sección de formularios */}
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Selecciona tu evaluación
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {formIds.map((id) => {
            // Lógica para extraer el nivel de seniority
            const idParts = id.split('-');
            const seniorityCode = idParts[idParts.length - 1].toUpperCase();
            const seniority = seniorityLevels[seniorityCode] || seniorityCode;

            return (
              <Link key={id} href={`/forms/${id}`}>
                <div className="block p-6 bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1">
                  <h2 className="text-xl font-semibold text-gray-700">{id.replace(/-/g, ' ')}</h2>
                  <p className="mt-2 text-gray-500">
                    <span className="font-semibold text-gray-600">Nivel:</span> {seniority}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </main>
    </div>
  );
}