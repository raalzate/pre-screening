'use client';

import { useEffect, useState, useMemo } from 'react';
import DynamicForm from '@/components/DynamicForm';
import { FormConfig } from '@/types/InputConfig';
import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import createApiClient from '@/lib/APIClient';

export default function FormPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params); // 
  const [form, setForm] = useState<FormConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const auth = useAuth();
  const api = useMemo(() => createApiClient(auth), [auth]);

  useEffect(() => {
    async function fetchForm() {
      if (id) {
        try {
          const response = await api.get(`/forms/${id}`);
          setForm(response.data);
        } catch (err: any) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      }
    }

    if (auth.user) {
      fetchForm();
    }
  }, [id, api, auth.user]);

  if (loading) {
    return <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center">Cargando...</div>;
  }

  if (error) {
    return <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center">Error: {error}</div>;
  }

  if (!form) {
    return null;
  }

  return (
    <div className="container mx-auto p-4">
      <Link href="/" className="text-blue-500 hover:underline mb-4 block">
        🚀 Volver a los formularios
      </Link>
      <h1 className="text-2xl font-bold mb-4">{form.title}</h1>
      <DynamicForm form={form} />
    </div>
  );
}
