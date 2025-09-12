'use client';

import Link from 'next/link';
import { useEffect, useState, useMemo } from 'react';
import { useAuth } from '@/context/AuthContext';
import createApiClient from '@/lib/APIClient';

export default function Home() {
  const [formIds, setFormIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const auth = useAuth();
  const api = useMemo(() => createApiClient(auth), [auth]);

  useEffect(() => {
    async function fetchFormIds() {
      try {
        const response = await api.get('/forms');
        setFormIds(response.data);
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }

    if (auth.user) { // Ensure user is available before fetching
      fetchFormIds();
    }
  }, [api, auth.user]);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-800">🚀 Evaluación de conocimientos</h1>
          <p className="mt-2 text-gray-600">Seleccione un formulario para comenzar una evaluación.</p>
        </div>
      </header>
      
      <main className="container mx-auto p-8">
        {loading && <p className="text-center text-gray-500">Cargando formularios...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}
        
        {!loading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {formIds.map((id) => (
              <Link key={id} href={`/forms/${id}`}>
                <div className="block p-6 bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1">
                  <h2 className="text-xl font-semibold text-gray-700">{id.replace(/-/g, ' ')}</h2>
                  <p className="mt-2 text-gray-500">Formulario de evaluación</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
