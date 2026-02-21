'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';

interface Requirement {
    id: string;
    title: string;
}

export default function NewFormPage() {
    const router = useRouter();
    const [requirements, setRequirements] = useState<Requirement[]>([]);
    const [selectedReq, setSelectedReq] = useState('');
    const [loading, setLoading] = useState(false);
    const [draft, setDraft] = useState<any>(null);

    useEffect(() => {
        async function fetchReqs() {
            try {
                const res = await fetch('/api/admin/studio/requirements');
                if (res.ok) setRequirements(await res.json());
            } catch (error) {
                console.error('Error fetching requirements:', error);
            }
        }
        fetchReqs();
    }, []);

    const handleGenerate = async () => {
        if (!selectedReq) return toast.error('Selecciona un perfil de requisitos');
        setLoading(true);
        try {
            const res = await fetch('/api/admin/studio/forms/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ requirementId: selectedReq })
            });
            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || 'Error al generar');
            }
            const data = await res.json();
            setDraft(data);
            toast.success('Evaluación diseñada por IA');
        } catch (error: any) {
            toast.error(error.message || 'Error al generar el cuestionario');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        if (!draft) return;
        try {
            const res = await fetch('/api/admin/studio/forms', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(draft)
            });
            if (!res.ok) throw new Error('Error al guardar');
            toast.success('Formulario registrado con éxito');
            router.push('/admin/studio');
        } catch {
            toast.error('Error al guardar en la base de datos');
        }
    };

    return (
        <div className="max-w-5xl mx-auto space-y-6 animate-in slide-in-from-bottom-4 duration-500 pb-20">
            {/* Page Header */}
            <Card
                header={
                    <div className="flex justify-between items-center px-6 py-5">
                        <div>
                            <h1 className="text-2xl font-extrabold text-sofka-blue tracking-tight">Diseñador de Evaluaciones</h1>
                            <p className="text-gray-500 text-sm mt-0.5">Crea cuestionarios de pre-screening basados en tus benchmarks técnicos.</p>
                        </div>
                        <Button variant="ghost" size="sm" onClick={() => router.back()} className="uppercase tracking-widest text-xs">
                            ← Volver
                        </Button>
                    </div>
                }
            >
                <div className="space-y-5">
                    {/* Requirement Selector */}
                    <div className="space-y-2">
                        <label className="text-xs font-black text-sofka-blue uppercase tracking-widest ml-1">Perfil de Requisitos Base</label>
                        <div className="relative">
                            <select
                                value={selectedReq}
                                onChange={(e) => setSelectedReq(e.target.value)}
                                className="w-full px-4 py-3.5 rounded-xl border-2 border-gray-100 focus:border-sofka-orange outline-none bg-gray-50/50 font-bold text-sm cursor-pointer appearance-none transition-all"
                            >
                                <option value="">Selecciona un perfil...</option>
                                {requirements.map(req => (
                                    <option key={req.id} value={req.id}>{req.title} ({req.id})</option>
                                ))}
                            </select>
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 text-xs">▼</div>
                        </div>
                    </div>

                    {/* Generate CTA */}
                    <Button
                        variant="secondary"
                        onClick={handleGenerate}
                        disabled={loading || !selectedReq}
                        isLoading={loading}
                        size="lg"
                        className="w-full py-5 rounded-2xl font-black text-lg shadow-xl shadow-sofka-orange/10 gap-2"
                    >
                        {!loading && <span className="text-lg">🛠️</span>}
                        <span>{loading ? 'Analizando Benchmark...' : 'Generar Cuestionario con IA'}</span>
                    </Button>
                </div>
            </Card>

            {/* Form Preview */}
            {draft && (
                <Card className="border-2 border-sofka-orange/20 animate-in zoom-in-95 duration-500">
                    <div className="space-y-8">
                        {/* Draft Header */}
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-5 border-b border-gray-100">
                            <div>
                                <h2 className="text-xl font-black text-sofka-blue">{draft.title}</h2>
                                <div className="flex gap-2 mt-2">
                                    <Badge variant="warning">AI Design</Badge>
                                    <span className="px-2.5 py-0.5 bg-gray-50 text-gray-400 text-[10px] font-mono rounded-lg border border-gray-100">
                                        {draft.id}
                                    </span>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Categorías Generadas</p>
                                <p className="text-2xl font-black text-sofka-orange">{draft.categories.length}</p>
                            </div>
                        </div>

                        {/* Categories */}
                        <div className="space-y-10">
                            {draft.categories.map((cat: any) => (
                                <div key={cat.id} className="space-y-5">
                                    <h3 className="text-lg font-black text-sofka-blue flex items-center gap-3">
                                        <span className="w-1.5 h-7 bg-sofka-light-blue rounded-full" />
                                        {cat.title}
                                    </h3>
                                    <div className="space-y-4">
                                        {cat.questions.map((q: any) => (
                                            <div key={q.id} className="p-5 bg-gray-50/50 rounded-xl border border-gray-100 space-y-3 hover:bg-white hover:border-sofka-orange/20 transition-all">
                                                <div className="flex justify-between items-start gap-4">
                                                    <p className="font-bold text-gray-800 leading-snug flex-grow">{q.question}</p>
                                                    <span className="text-[9px] font-black bg-white px-2 py-1 rounded-lg border border-gray-100 text-sofka-light-blue uppercase tracking-wide shrink-0">
                                                        {q.id}
                                                    </span>
                                                </div>
                                                {q.example && (
                                                    <div className="p-4 bg-sofka-light-blue/5 border-l-4 border-sofka-light-blue rounded-r-xl">
                                                        <p className="text-[10px] uppercase font-black text-sofka-light-blue tracking-widest mb-1.5">Escenario / Ejemplo Sugerido</p>
                                                        <p className="text-xs text-sofka-blue/80 font-medium leading-relaxed italic">{q.example}</p>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Save CTA */}
                        <div className="pt-6 border-t border-gray-100">
                            <Button
                                onClick={handleSave}
                                size="lg"
                                className="w-full py-5 rounded-2xl font-black text-lg shadow-xl shadow-sofka-blue/10"
                            >
                                Publicar Evaluación en el Sistema
                            </Button>
                            <p className="text-center text-xs text-gray-400 mt-4 italic">
                                * El cuestionario se vinculará permanentemente al perfil de requisitos seleccionado.
                            </p>
                        </div>
                    </div>
                </Card>
            )}
        </div>
    );
}
