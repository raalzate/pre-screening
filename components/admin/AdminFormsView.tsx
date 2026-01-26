"use client";

import React, { useState, useEffect } from 'react';

interface FormHeader {
    id: string;
    title: string;
}

interface AdminFormsViewProps {
    onSelectForm: (id: string) => void;
}

const AdminFormsView: React.FC<AdminFormsViewProps> = ({ onSelectForm }) => {
    const [forms, setForms] = useState<FormHeader[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchForms = async () => {
            try {
                const response = await fetch('/api/admin/forms');
                if (!response.ok) throw new Error('Failed to fetch forms');
                const data = await response.json();
                setForms(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An error occurred');
            } finally {
                setLoading(false);
            }
        };

        fetchForms();
    }, []);

    if (loading) return <div className="p-8 text-center text-gray-500">Cargando formularios...</div>;
    if (error) return <div className="p-8 text-center text-red-500">Error: {error}</div>;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {forms.map((form) => (
                <div
                    key={form.id}
                    onClick={() => onSelectForm(form.id)}
                    className="group bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md hover:border-blue-300 transition-all cursor-pointer flex flex-col justify-between"
                >
                    <div>
                        <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-4 group-hover:bg-blue-100 transition-colors">
                            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{form.title}</h3>
                        <p className="text-sm text-gray-500 mt-2">ID: {form.id}</p>
                    </div>
                    <div className="mt-6 flex items-center text-blue-600 font-medium text-sm">
                        Ver Estructura
                        <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                        </svg>
                    </div>
                </div>
            ))}
            {forms.length === 0 && (
                <div className="col-span-full py-20 text-center text-gray-400">
                    No hay formularios disponibles.
                </div>
            )}
        </div>
    );
};

export default AdminFormsView;
