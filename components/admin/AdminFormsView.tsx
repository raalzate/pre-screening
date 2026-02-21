"use client";

import React, { useState, useEffect } from 'react';
import FormHistoryModal from './FormHistoryModal';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';

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

    // History Modal State
    const [historyModal, setHistoryModal] = useState<{ isOpen: boolean; formId: string; formTitle: string }>({
        isOpen: false,
        formId: '',
        formTitle: ''
    });

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

    const openHistory = (e: React.MouseEvent, form: FormHeader) => {
        e.stopPropagation();
        setHistoryModal({
            isOpen: true,
            formId: form.id,
            formTitle: form.title
        });
    };

    if (loading) return <div className="p-20 text-center text-gray-400 font-medium">Cargando formularios...</div>;
    if (error) return <div className="p-20 text-center text-red-500 font-bold">Error: {error}</div>;

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                {forms.map((form) => (
                    <Card
                        key={form.id}
                        onClick={() => onSelectForm(form.id)}
                        className="group hover:border-sofka-light-blue transition-all cursor-pointer flex flex-col justify-between h-full"
                        header={
                            <div className="flex justify-between items-start w-full">
                                <div className="w-12 h-12 bg-sofka-gray/30 rounded-xl flex items-center justify-center group-hover:bg-sofka-light-blue/10 transition-colors">
                                    <svg className="w-6 h-6 text-sofka-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={(e) => openHistory(e, form)}
                                    className="text-gray-400 hover:text-sofka-blue hover:bg-sofka-gray/50"
                                    title="Ver Historial de Análisis"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </Button>
                            </div>
                        }
                    >
                        <div className="flex-1">
                            <h3 className="text-lg font-extrabold text-sofka-blue group-hover:text-sofka-light-blue transition-colors leading-tight">{form.title}</h3>
                            <p className="text-xs font-mono text-gray-400 mt-2">ID: {form.id}</p>
                        </div>
                        <div className="mt-6 flex items-center text-sofka-light-blue font-bold text-sm group-hover:translate-x-1 transition-transform">
                            Ver Estructura
                            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                            </svg>
                        </div>
                    </Card>
                ))}
                {forms.length === 0 && (
                    <div className="col-span-full py-20 text-center text-gray-400">
                        No hay formularios disponibles.
                    </div>
                )}
            </div>

            <FormHistoryModal
                isOpen={historyModal.isOpen}
                onClose={() => setHistoryModal({ ...historyModal, isOpen: false })}
                formId={historyModal.formId}
                formTitle={historyModal.formTitle}
            />
        </>
    );
};


export default AdminFormsView;
