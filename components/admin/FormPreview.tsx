"use client";

import { useEffect, useState, FC } from "react";
import { FormConfig } from "@/types/InputConfig";

const Icons = {
    AlertCircle: (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>,
    ArrowLeft: (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 19-7-7 7-7" /><path d="M19 12H5" /></svg>,
    Info: (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M12 16v-4" /><path d="M12 8h.01" /></svg>,
};

interface FormPreviewProps {
    formId: string;
    onBack: () => void;
}

const FormPreview: FC<FormPreviewProps> = ({ formId, onBack }) => {
    const [form, setForm] = useState<FormConfig | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchForm = async () => {
            try {
                setLoading(true);
                const res = await fetch(`/api/admin/forms/${formId}`);
                if (!res.ok) throw new Error("Error al cargar los detalles del formulario");
                const data = await res.json();
                setForm(data);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchForm();
    }, [formId]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
                <p className="text-gray-500 font-medium">Cargando detalles del formulario...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-2xl flex items-center gap-4">
                <Icons.AlertCircle className="w-8 h-8" />
                <div>
                    <h3 className="font-bold text-lg">Error</h3>
                    <p>{error}</p>
                    <button
                        onClick={onBack}
                        className="mt-4 text-sm font-bold underline hover:no-underline"
                    >
                        Volver a la lista
                    </button>
                </div>
            </div>
        );
    }

    if (!form) return null;

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4 mb-2">
                <button
                    onClick={onBack}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500"
                    title="Volver"
                >
                    <Icons.ArrowLeft className="w-6 h-6" />
                </button>
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                        {form.title}
                    </h1>
                    <p className="text-gray-500 text-sm">ID: {form.id}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-8">
                {form.categories.map((category, catIdx) => (
                    <div key={category.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden ring-1 ring-gray-900/5">
                        <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex items-center gap-3">
                            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 text-sm font-bold">
                                {catIdx + 1}
                            </span>
                            <h2 className="text-xl font-bold text-gray-800">
                                {category.title}
                            </h2>
                        </div>

                        <div className="p-6 space-y-8">
                            {category.questions.map((q, qIdx) => (
                                <div key={q.id} className="group">
                                    <div className="flex gap-4">
                                        <div className="flex-1">
                                            <h4 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                                                {q.question}
                                            </h4>
                                            {q.example && (
                                                <p className="mt-1 text-sm text-gray-500 italic flex items-center gap-1.5">
                                                    <Icons.Info className="w-4 h-4 text-blue-400" />
                                                    Ej: {q.example}
                                                </p>
                                            )}

                                            <div className="mt-4 flex flex-wrap gap-2">
                                                <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-lg text-xs font-bold uppercase tracking-wider">
                                                    Tipo: {q.type}
                                                </span>
                                                <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-xs font-bold uppercase tracking-wider">
                                                    Escala: 0 - {q.scaleMax}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-4 bg-gray-50/50 rounded-xl p-4 border border-dashed border-gray-200">
                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Escala de Evaluación</p>
                                        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                                            {Array.from({ length: q.scaleMax + 1 }).map((_, i) => (
                                                <div key={i} className="flex items-center gap-2 p-2 rounded-lg bg-white border border-gray-100 shadow-sm opacity-60">
                                                    <span className="w-6 h-6 flex items-center justify-center rounded-md bg-gray-100 text-gray-600 text-xs font-bold">
                                                        {i}
                                                    </span>
                                                    <span className="text-xs text-gray-500 leading-tight">
                                                        {getScaleText(i)}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

function getScaleText(value: number): string {
    switch (value) {
        case 0: return "No conoce";
        case 1: return "Conocimiento muy básico o teórico mínimo";
        case 2: return "Conocimiento teórico y algo de práctica limitada";
        case 3: return "Experiencia práctica en proyectos";
        case 4: return "Experiencia sólida y autónoma en proyectos";
        case 5: return "Dominio profundo y liderazgo/innovación";
        default: return "";
    }
}

export default FormPreview;
