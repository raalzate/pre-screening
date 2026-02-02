"use client";

import React, { useState, useEffect } from 'react';
import Markdown from 'react-markdown';

// Icons system matching the project's style
const Icons = {
    Sparkles: (props: React.ComponentProps<"svg">) => <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" /><path d="M5 3v4" /><path d="M19 17v4" /><path d="M3 5h4" /><path d="M17 19h4" /></svg>,
    X: (props: React.ComponentProps<"svg">) => <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="M6 6l12 12" /></svg>,
    Calendar: (props: React.ComponentProps<"svg">) => <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>,
    ChevronRight: (props: React.ComponentProps<"svg">) => <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>,
    ArrowLeft: (props: React.ComponentProps<"svg">) => <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 19-7-7 7-7" /><path d="M19 12H5" /></svg>,
    History: (props: React.ComponentProps<"svg">) => <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" /><path d="M3 3v5h5" /><path d="M12 7v5l4 2" /></svg>,
};

interface AnalysisRecord {
    id: number;
    form_id: string;
    analysis_text: string;
    score: number;
    total_possible: number;
    percentage: number;
    created_at: string;
}

interface FormHistoryModalProps {
    isOpen: boolean;
    onClose: () => void;
    formId: string;
    formTitle: string;
}

const FormHistoryModal: React.FC<FormHistoryModalProps> = ({ isOpen, onClose, formId, formTitle }) => {
    const [history, setHistory] = useState<AnalysisRecord[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedAnalysis, setSelectedAnalysis] = useState<AnalysisRecord | null>(null);

    useEffect(() => {
        if (isOpen && formId) {
            fetchHistory();
        }
    }, [isOpen, formId]);

    const fetchHistory = async () => {
        try {
            setLoading(true);
            const res = await fetch(`/api/admin/forms/history/${formId}`);
            if (!res.ok) throw new Error("Failed to fetch history");
            const data = await res.json();
            setHistory(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-gray-900/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-4 duration-500">

                {/* Header */}
                <div className="p-6 sm:p-8 border-b flex items-center justify-between bg-gradient-to-r from-blue-50 to-white">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-600 rounded-2xl shadow-lg shadow-blue-200">
                            <Icons.History className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-gray-900">Historial de Análisis</h3>
                            <p className="text-sm text-blue-600 font-medium">{formTitle}</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white rounded-full text-gray-400 hover:text-gray-900 transition-all border border-transparent hover:border-gray-100"
                    >
                        <Icons.X className="w-6 h-6" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 sm:p-8 custom-scrollbar">
                    {selectedAnalysis ? (
                        <div className="animate-in fade-in slide-in-from-left-4 duration-300">
                            <button
                                onClick={() => setSelectedAnalysis(null)}
                                className="flex items-center gap-2 mb-6 text-blue-600 font-bold text-sm hover:translate-x-[-4px] transition-transform"
                            >
                                <Icons.ArrowLeft className="w-4 h-4" />
                                Volver al listado
                            </button>

                            <div className="bg-gray-50 rounded-3xl p-6 sm:p-8 border border-gray-100">
                                <div className="flex justify-between items-center mb-8 pb-6 border-b border-gray-200">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-indigo-600 rounded-xl shadow-md">
                                            <Icons.Sparkles className="w-5 h-5 text-white" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Resultado Persistido</p>
                                            <p className="font-bold text-gray-900">{new Date(selectedAnalysis.created_at).toLocaleString()}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-4xl font-black text-gray-900">{selectedAnalysis.percentage}%</p>
                                        <p className="text-xs text-gray-500 font-medium">{selectedAnalysis.score} / {selectedAnalysis.total_possible} pts</p>
                                    </div>
                                </div>

                                <div className="prose prose-blue max-w-none text-gray-700 leading-relaxed">
                                    <Markdown>{selectedAnalysis.analysis_text}</Markdown>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="animate-in fade-in duration-300">
                            {loading ? (
                                <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mb-4"></div>
                                    <p className="font-medium">Cargando historial...</p>
                                </div>
                            ) : history.length > 0 ? (
                                <div className="grid grid-cols-1 gap-4">
                                    {history.map((record) => (
                                        <button
                                            key={record.id}
                                            onClick={() => setSelectedAnalysis(record)}
                                            className="flex items-center justify-between p-5 rounded-2xl border border-gray-100 bg-white hover:bg-blue-50 hover:border-blue-200 hover:shadow-md transition-all group text-left"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center group-hover:bg-white transition-colors">
                                                    <Icons.Calendar className="w-6 h-6 text-gray-400 group-hover:text-blue-600" />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-gray-900">{new Date(record.created_at).toLocaleDateString()}</p>
                                                    <p className="text-xs text-gray-500">{new Date(record.created_at).toLocaleTimeString()}</p>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-6">
                                                <div className="text-right">
                                                    <p className="text-xl font-black text-gray-900">{record.percentage}%</p>
                                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{getAffinityLevel(record.percentage)}</p>
                                                </div>
                                                <Icons.ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            ) : (
                                <div className="py-20 text-center">
                                    <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Icons.History className="w-10 h-10 text-gray-300" />
                                    </div>
                                    <p className="text-lg font-bold text-gray-900">Sin historial aún</p>
                                    <p className="text-gray-500">Los análisis generados aparecerán aquí.</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-6 sm:p-8 bg-gray-50/50 border-t flex justify-between items-center">
                    <p className="text-xs text-gray-400 font-medium italic">
                        {selectedAnalysis
                            ? "Visualizando reporte histórico detallado."
                            : `Total de registros: ${history.length}`
                        }
                    </p>
                    <button
                        onClick={onClose}
                        className="px-8 py-3 bg-gray-900 text-white rounded-2xl font-bold hover:bg-gray-800 transition-all active:scale-95 shadow-lg shadow-gray-200"
                    >
                        Cerrar
                    </button>
                </div>
            </div>
        </div>
    );
};

function getAffinityLevel(percentage: number): string {
    if (percentage >= 85) return "Experto / Líder";
    if (percentage >= 60) return "Competente / Avanzado";
    if (percentage >= 30) return "En Desarrollo";
    return "Inicial";
}

export default FormHistoryModal;
