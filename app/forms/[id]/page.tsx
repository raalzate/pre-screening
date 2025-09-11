'use client';

import { useEffect, useState } from 'react';
import DynamicForm from '@/components/DynamicForm';
import { FormConfig } from '@/types/InputConfig';

export default function FormPage({ params }: { params: { id: string } }) {
  const { id } = params;
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
      <h1 className="text-2xl font-bold mb-4">{form.title}</h1>
      <DynamicForm categories={form.categories} formId={form.id} />
    </div>
  );
}
