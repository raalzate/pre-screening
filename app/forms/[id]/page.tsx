'use client';

import { useEffect, useState } from 'react';
import DynamicForm from '@/components/DynamicForm';
import { FormConfig } from '@/types/InputConfig';
import React from 'react';
import Link from 'next/link';

export default function FormPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params); 
  const [form, setForm] = useState<FormConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/forms/${id}`)
        .then((res) => {
          if (!res.ok) {
            throw new Error('Error cargando el formulario');
          }
          return res.json();
        })
        .then((data: FormConfig) => {
          setForm(data);
          setLoading(false);
        })
        .catch((err) => {
          setError(err.message);
          setLoading(false);
        });
    }
  }, [id]);

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
      <Link href="/forms" className="text-blue-500 hover:underline mb-4 block">
        &larr; Volver a los formularios
      </Link>
      <h1 className="text-2xl font-bold mb-4">{form.title}</h1>
      <DynamicForm form={form} />
    </div>
  );
}
