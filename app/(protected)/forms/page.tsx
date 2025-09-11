'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Home() {
  const [formIds, setFormIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchFormIds() {
      try {
        const response = await fetch('/api/forms');
        if (!response.ok) {
          throw new Error('Failed to fetch form IDs');
        }
        const data = await response.json();
        setFormIds(data);
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }

    fetchFormIds();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-800">🚀 Dynamic Forms para Entrevistas</h1>
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
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-file-text mr-4"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/></svg>
                    <h2 className="text-xl font-semibold text-gray-700">{id.replace(/-/g, ' ')}</h2>
                  </div>
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
