'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Modal from '@/components/ui/Modal';

interface Requirement {
    id: string;
    title: string;
    created_at: string;
    content: string;
    job_description?: string;
    source_url?: string;
}

interface Form {
    id: string;
    title: string;
    created_at: string;
}

const IconClipboard = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="9" y="2" width="6" height="4" rx="1" /><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
    </svg>
);
const IconForms = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" />
    </svg>
);
const IconLink = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
);

export default function StudioDashboard() {
    const [requirements, setRequirements] = useState<Requirement[]>([]);
    const [forms, setForms] = useState<Form[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedReq, setSelectedReq] = useState<Requirement | null>(null);

    useEffect(() => {
        async function fetchData() {
            try {
                const [reqRes, formRes] = await Promise.all([
                    fetch('/api/admin/studio/requirements'),
                    fetch('/api/admin/studio/forms')
                ]);
                if (reqRes.ok) setRequirements(await reqRes.json());
                if (formRes.ok) setForms(await formRes.json());
            } catch (error) {
                console.error('Error fetching studio data:', error);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="inline-flex items-center gap-3 text-sofka-blue/70">
                    <div className="w-5 h-5 border-2 border-sofka-light-blue/30 border-t-sofka-light-blue rounded-full animate-spin" />
                    <span className="font-semibold text-sm tracking-wide uppercase">Cargando Studio...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-4xl font-extrabold text-sofka-blue tracking-tight">Admin Studio</h1>
                    <p className="text-gray-500 mt-1">Diseña y gestiona perfiles de requisitos y evaluaciones técnicas con IA.</p>
                </div>
                <div className="flex gap-3">
                    <Link
                        href="/admin/studio/requirements/new"
                        className="inline-flex items-center gap-2 bg-sofka-light-blue text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-[#00709A] transition-all shadow-md shadow-sofka-light-blue/20 active:scale-95"
                    >
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
                        Nuevo Requisito
                    </Link>
                    <Link
                        href="/admin/studio/forms/new"
                        className="inline-flex items-center gap-2 bg-sofka-orange text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-[#E65200] transition-all shadow-md shadow-sofka-orange/20 active:scale-95"
                    >
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
                        Nueva Evaluación
                    </Link>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Requirements Section */}
                <Card
                    title="Perfiles de Requisitos"
                    icon={<IconClipboard className="w-5 h-5 text-sofka-light-blue" />}
                    action={
                        <Badge variant="accent">{requirements.length} Total</Badge>
                    }
                >
                    <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                        {requirements.length === 0 ? (
                            <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                                <p className="text-gray-400 font-medium">No hay perfiles de requisitos registrados.</p>
                                <Link href="/admin/studio/requirements/new" className="text-sofka-light-blue text-sm font-bold mt-2 inline-block hover:underline">
                                    Crear el primero →
                                </Link>
                            </div>
                        ) : (
                            requirements.map(req => (
                                <div
                                    key={req.id}
                                    onClick={() => setSelectedReq(req)}
                                    className="group p-4 border border-gray-100 rounded-xl hover:border-sofka-light-blue/30 hover:bg-sofka-light-blue/5 transition-all cursor-pointer"
                                >
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="font-bold text-gray-900 group-hover:text-sofka-blue transition-colors text-sm">{req.title}</h3>
                                            <p className="text-[10px] font-mono text-gray-400 mt-0.5 uppercase tracking-tighter">{req.id}</p>
                                        </div>
                                        <span className="text-[10px] bg-white px-2 py-1 rounded-lg border border-gray-100 text-gray-400 font-medium shrink-0">
                                            {new Date(req.created_at).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </Card>

                {/* Forms Section */}
                <Card
                    title="Evaluaciones Pre-screening"
                    icon={<IconForms className="w-5 h-5 text-sofka-orange" />}
                    action={
                        <Badge variant="warning">{forms.length} Total</Badge>
                    }
                >
                    <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                        {forms.length === 0 ? (
                            <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                                <p className="text-gray-400 font-medium">No hay formularios de evaluación registrados.</p>
                                <Link href="/admin/studio/forms/new" className="text-sofka-orange text-sm font-bold mt-2 inline-block hover:underline">
                                    Diseñar evaluación →
                                </Link>
                            </div>
                        ) : (
                            forms.map(form => (
                                <div key={form.id} className="group p-4 border border-gray-100 rounded-xl hover:border-sofka-orange/30 hover:bg-sofka-orange/5 transition-all">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="font-bold text-gray-900 group-hover:text-sofka-orange transition-colors text-sm">{form.title}</h3>
                                            <p className="text-[10px] font-mono text-gray-400 mt-0.5 uppercase tracking-tighter">{form.id}</p>
                                        </div>
                                        <span className="text-[10px] bg-white px-2 py-1 rounded-lg border border-gray-100 text-gray-400 font-medium shrink-0">
                                            {new Date(form.created_at).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </Card>
            </div>

            {/* Requirement Detail Modal */}
            {selectedReq && (
                <Modal isOpen={!!selectedReq} onClose={() => setSelectedReq(null)} title={selectedReq.title}>
                    <div className="space-y-6">
                        <p className="text-xs font-mono text-gray-400 uppercase tracking-tighter">ID: {selectedReq.id}</p>

                        {selectedReq.job_description && (
                            <section className="space-y-2">
                                <h4 className="text-[10px] font-black text-sofka-light-blue uppercase tracking-[0.2em] flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-sofka-light-blue" />
                                    Origen: Job Description
                                </h4>
                                <div className="p-4 bg-sofka-light-blue/5 rounded-xl border border-sofka-light-blue/10">
                                    <p className="text-sm text-sofka-blue/80 leading-relaxed italic">
                                        &ldquo;{selectedReq.job_description}&rdquo;
                                    </p>
                                    {selectedReq.source_url && (
                                        <div className="mt-3 pt-3 border-t border-sofka-light-blue/10 flex items-center gap-2 text-[10px] font-bold text-sofka-light-blue">
                                            <IconLink className="w-3 h-3 shrink-0" />
                                            <span>Fuente:</span>
                                            <a href={selectedReq.source_url} target="_blank" rel="noopener noreferrer" className="underline truncate hover:text-sofka-blue">
                                                {selectedReq.source_url}
                                            </a>
                                        </div>
                                    )}
                                </div>
                            </section>
                        )}

                        <section className="space-y-3">
                            <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Descriptores Sugeridos</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                {Object.entries(JSON.parse(selectedReq.content)).map(([skill, weight]: [string, any]) => (
                                    <div key={skill} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100 group hover:border-sofka-orange/30 transition-all">
                                        <span className="text-sm font-semibold text-gray-700 truncate mr-2">{skill}</span>
                                        <span className="px-2.5 py-0.5 bg-white border border-sofka-orange/30 rounded-lg text-sofka-orange font-black text-sm group-hover:bg-sofka-orange group-hover:text-white transition-colors shrink-0">
                                            {weight}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </section>

                        <p className="text-[10px] text-gray-400 text-center">
                            Creado el {new Date(selectedReq.created_at).toLocaleString()}
                        </p>
                    </div>
                </Modal>
            )}
        </div>
    );
}
