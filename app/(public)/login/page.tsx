'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Image from 'next/image';

const sofkaColors = {
  blue: '#002C5E',
  lightBlue: '#0083B3',
  orange: '#FF5C00',
  gray: '#F3F4F6',
  darkGray: '#4B5563',
};

export default function CombinedLoginPage() {
  const [code, setCode] = useState('');
  const { login } = useAuth();
  const router = useRouter();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(code);
      router.push('/');
    } catch (err) {
      console.error(err);
      setError('Invalid code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const processSteps = [
    {
      title: 'Paso 1: Cuestionario de Pre-screening',
      description: 'Responde un cuestionario rápido para medir tu afinidad con la oportunidad. Esto nos ayuda a entender tus conocimientos clave.',
    },
    {
      title: 'Paso 2: Validación de Conocimientos (Certified)',
      description: 'Demuestra las habilidades que indicas dominar a través de preguntas practicas que valida tu experiencia.',
    },
    {
      title: 'Paso 3: Reto Técnico (Challenge)',
      description: 'Analiza una pregunta retadora antes de la entrevista. Esto te permite mostrar tu razonamiento y capacidad de análisis.',
    },
    {
      title: 'Paso 4: Entrevista de Sustentación',
      description: 'En esta etapa final, sustentarás tu respuesta al reto. Es el momento de exponer tu enfoque, decisiones y justificar tu razonamiento técnico.',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: sofkaColors.gray }}>
      {/* Header */}
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

      {/* Contenedor principal de 2 columnas */}
      <main className="flex-grow container mx-auto px-4 py-12 md:py-20 flex flex-col md:flex-row gap-12 items-start justify-center">

        {/* Columna Izquierda: Información del Proceso */}
        <div className="w-full md:w-3/5 lg:w-3/5">
          <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: sofkaColors.blue }}>
            Tu proceso de evaluación en Sofka
          </h1>
          <p className="text-lg md:text-xl max-w-2xl" style={{ color: sofkaColors.darkGray }}>
            Bienvenido. Nuestro proceso de evaluación está diseñado para conocer tu experiencia y habilidades de manera transparente y eficiente.
          </p>
          
          <div className="mt-12">
            <h2 className="text-3xl font-bold mb-8" style={{ color: sofkaColors.blue }}>
              Los 4 pasos de nuestro proceso
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {processSteps.map((step, index) => (
                <div
                  key={index}
                  className="p-6 rounded-lg shadow-md flex flex-col"
                  style={{ backgroundColor: 'white' }}
                >
                  <div 
                    className="w-10 h-10 rounded-full flex items-center justify-center mb-4 font-bold text-xl"
                    style={{ backgroundColor: sofkaColors.lightBlue, color: 'white' }}
                  >
                    {index + 1}
                  </div>
                  <h3 className="text-xl font-semibold mb-2" style={{ color: sofkaColors.blue }}>
                    {step.title}
                  </h3>
                  <p className="text-sm" style={{ color: sofkaColors.darkGray }}>
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Columna Derecha: Formulario de Login */}
        <div className="w-full md:w-2/5 lg:w-2/5 md:sticky md:top-20">
          <div className="p-8 rounded-lg shadow-xl space-y-6" style={{ backgroundColor: 'white' }}>
            <div className="text-center">
              <h2 className="text-2xl font-bold" style={{ color: sofkaColors.darkGray }}>
                Ingresa tu código
              </h2>
              <p className="mt-2 text-sm" style={{ color: sofkaColors.darkGray }}>
                Para empezar, ingresa el código que se te ha proporcionado.
              </p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="code" className="sr-only">
                  Código
                </label>
                <input
                  id="code"
                  type="password"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="Código secreto"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none transition duration-300 focus:border-sofka-light-blue focus:ring-1 focus:ring-sofka-light-blue"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full px-6 py-3 rounded-lg font-semibold transition-all duration-300 transform disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  backgroundColor: sofkaColors.blue,
                  color: 'white',
                }}
              >
                {loading ? 'Validando...' : 'Ingresar'}
              </button>
              {error && (
                <p className="text-center text-red-600 font-medium">
                  Código inválido. Por favor, intenta de nuevo.
                </p>
              )}
            </form>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-4 text-sm" style={{ color: sofkaColors.darkGray }}>
        <div className="container mx-auto px-4 text-center">
          &copy; {new Date().getFullYear()} Sofka Technologies. All Rights Reserved.
        </div>
      </footer>
    </div>
  );
}