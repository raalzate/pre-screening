'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';

export default function NewRequirementPage() {
    const router = useRouter();
    const [role, setRole] = useState('');
    const [seniority, setSeniority] = useState('Senior');
    const [loading, setLoading] = useState(false);
    const [discovering, setDiscovering] = useState(false);
    const [jdInput, setJdInput] = useState('');
    const [extractedInfo, setExtractedInfo] = useState<{ content: string; url?: string } | null>(null);
    const [draft, setDraft] = useState<any>(null);

    const handleDiscoverJD = async () => {
        if (!jdInput) return toast.error('Ingresa una URL o descripción');
        setDiscovering(true);
        try {
            const isUrl = jdInput.startsWith('http');
            const res = await fetch('/api/admin/studio/jd-extract', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(isUrl ? { url: jdInput } : { text: jdInput })
            });
            const data = await res.json();
            if (!res.ok) {
                toast.error(data.error || 'No se pudo procesar la fuente');
                return;
            }
            setExtractedInfo({ content: data.content, url: isUrl ? jdInput : undefined });
            toast.success('Contexto extraído con éxito');
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setDiscovering(false);
        }
    };

    const handleGenerate = async () => {
        if (!role) return toast.error('El rol es obligatorio');
        setLoading(true);
        try {
            const res = await fetch('/api/admin/studio/requirements/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ role, seniority, jobDescription: extractedInfo?.content })
            });
            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || 'Error al generar');
            }
            const data = await res.json();
            setDraft(data);
            toast.success('Borrador generado por IA con contexto');
        } catch (error: any) {
            toast.error(error.message || 'Error al generar el perfil');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        if (!draft) return;
        try {
            const res = await fetch('/api/admin/studio/requirements', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...draft,
                    job_description: extractedInfo?.content,
                    source_url: extractedInfo?.url
                })
            });
            if (!res.ok) throw new Error('Error al guardar');
            toast.success('Perfil guardado con éxito');
            router.push('/admin/studio');
        } catch {
            toast.error('Error al guardar en la base de datos');
        }
    };

    const updateWeight = (skill: string, weight: number) => {
        setDraft({ ...draft, requirements: { ...draft.requirements, [skill]: weight } });
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6 animate-in slide-in-from-bottom-4 duration-500 pb-20">
            {/* Page Header */}
            <Card
                header={
                    <div className="flex justify-between items-center px-6 py-5">
                        <div>
                            <h1 className="text-2xl font-extrabold text-sofka-blue tracking-tight">Diseñador de Requisitos</h1>
                            <p className="text-gray-500 text-sm mt-0.5">Define los benchmarks técnicos para el proceso de selección de Sofka.</p>
                        </div>
                        <Button variant="ghost" size="sm" onClick={() => router.back()} className="uppercase tracking-widest text-xs">
                            ← Volver
                        </Button>
                    </div>
                }
            >
                <div className="space-y-6">
                    {/* Role & Seniority */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-xs font-black text-sofka-blue uppercase tracking-widest ml-1">Posición / Role</label>
                            <input
                                type="text"
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                                placeholder="Ej: Backend Java Expert"
                                className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-sofka-light-blue outline-none bg-gray-50/50 font-medium text-sm placeholder:text-gray-300 transition-all"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-black text-sofka-blue uppercase tracking-widest ml-1">Seniority</label>
                            <select
                                value={seniority}
                                onChange={(e) => setSeniority(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-sofka-light-blue outline-none bg-gray-50/50 font-medium text-sm appearance-none cursor-pointer transition-all"
                            >
                                <option>Junior</option>
                                <option>Semi-Senior</option>
                                <option>Senior</option>
                                <option>Architect / Lead</option>
                            </select>
                        </div>
                    </div>

                    {/* JD Context */}
                    <div className="space-y-3 bg-gray-50/80 p-5 rounded-2xl border border-gray-100">
                        <div className="flex justify-between items-center">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Contexto Adicional (Opcional)</label>
                            {extractedInfo && (
                                <Badge variant="success">✓ CONTEXTO CARGADO</Badge>
                            )}
                        </div>
                        <div className="flex flex-col md:flex-row gap-3">
                            <textarea
                                value={jdInput}
                                onChange={(e) => setJdInput(e.target.value)}
                                placeholder="Pega el Job Description o la URL de la vacante (LinkedIn, etc.)"
                                className="flex-grow p-4 rounded-xl border-2 border-gray-100 focus:border-sofka-light-blue outline-none bg-white font-medium text-sm placeholder:text-gray-300 min-h-[100px] transition-all resize-none"
                            />
                            <div className="flex md:flex-col gap-2 shrink-0">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={handleDiscoverJD}
                                    disabled={discovering || !jdInput}
                                    isLoading={discovering}
                                    className="px-5 py-3 border-sofka-blue text-sofka-blue hover:bg-sofka-blue/5 whitespace-nowrap text-xs font-black"
                                >
                                    {discovering ? 'Procesando...' : 'Descubrir con IA ✨'}
                                </Button>
                                <button
                                    onClick={() => { setJdInput(''); setExtractedInfo(null); }}
                                    className="text-[10px] font-bold text-gray-400 hover:text-red-500 transition-colors uppercase tracking-widest text-center"
                                >
                                    Limpiar
                                </button>
                            </div>
                        </div>
                        <p className="text-[10px] text-gray-400 italic">
                            * Usar un JD ayuda a la IA a sugerir descriptores más alineados con la vacante real.
                        </p>
                    </div>

                    {/* Generate CTA */}
                    <Button
                        onClick={handleGenerate}
                        disabled={loading || !role}
                        isLoading={loading}
                        size="lg"
                        className="w-full py-5 rounded-2xl font-black text-lg shadow-xl shadow-sofka-blue/10 gap-2"
                    >
                        {!loading && <span className="text-lg">✨</span>}
                        <span>{loading ? 'Consultando a la IA...' : 'Generar Benchmark con IA'}</span>
                    </Button>
                </div>
            </Card>

            {/* Draft Result */}
            {draft && (
                <Card className="border-2 border-sofka-light-blue/20 animate-in zoom-in-95 duration-500">
                    <div className="space-y-6">
                        {/* Draft Header */}
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-5 border-b border-gray-100">
                            <div>
                                <h2 className="text-xl font-black text-sofka-blue">{draft.title}</h2>
                                <div className="flex gap-2 mt-2">
                                    <Badge variant="accent">IA Generated</Badge>
                                    <span className="px-2.5 py-0.5 bg-gray-50 text-gray-400 text-[10px] font-mono rounded-lg border border-gray-100">
                                        {draft.id}
                                    </span>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Habilidades</p>
                                <p className="text-2xl font-black text-sofka-light-blue">{Object.keys(draft.requirements).length}</p>
                            </div>
                        </div>

                        {/* Skills Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {Object.entries(draft.requirements).map(([skill, weight]: [string, any]) => (
                                <div key={skill} className="group p-4 bg-gray-50/50 rounded-xl border border-gray-100 hover:border-sofka-light-blue/20 hover:bg-white transition-all">
                                    <div className="flex items-center justify-between mb-3">
                                        <span className="text-sm font-bold text-gray-700 truncate mr-3">{skill}</span>
                                        <span className="w-9 h-9 flex items-center justify-center bg-white border-2 border-sofka-orange/40 rounded-xl text-base font-black text-sofka-orange shadow-sm shrink-0">
                                            {weight}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-[10px] font-bold text-gray-400">1</span>
                                        <input
                                            type="range"
                                            min="1" max="5"
                                            value={weight}
                                            onChange={(e) => updateWeight(skill, parseInt(e.target.value))}
                                            className="flex-grow h-1.5 rounded-full cursor-pointer"
                                            style={{ accentColor: '#FF5C00' }}
                                        />
                                        <span className="text-[10px] font-bold text-gray-400">5</span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Save CTA */}
                        <div className="pt-4 border-t border-gray-100">
                            <Button
                                variant="secondary"
                                onClick={handleSave}
                                size="lg"
                                className="w-full py-5 rounded-2xl font-black text-lg shadow-xl shadow-sofka-orange/10"
                            >
                                Confirmar y Guardar en Studio
                            </Button>
                            <p className="text-center text-xs text-gray-400 mt-3 italic">
                                * Al guardar, este perfil estará disponible para generar evaluaciones automáticas.
                            </p>
                        </div>
                    </div>
                </Card>
            )}
        </div>
    );
}
