"use client";

import { useEffect, useState, FC, useMemo } from "react";
import { FormConfig } from "@/types/InputConfig";
import Markdown from 'react-markdown'
import { toast } from "react-hot-toast";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";


// --- 1. Sistema de Iconos (Optimizados) ---
const Icons = {
    AlertCircle: (props: React.ComponentProps<"svg">) => <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>,
    ArrowLeft: (props: React.ComponentProps<"svg">) => <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 19-7-7 7-7" /><path d="M19 12H5" /></svg>,
    Info: (props: React.ComponentProps<"svg">) => <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M12 16v-4" /><path d="M12 8h.01" /></svg>,
    Check: (props: React.ComponentProps<"svg">) => <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>,
    Trophy: (props: React.ComponentProps<"svg">) => <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" /><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" /><path d="M4 22h16" /><path d="M10 14.66V17" /><path d="M14 14.66V17" /><path d="M18 2h-6c-2.76 0-5 2.24-5 5v7c0 2.76 2.24 5 5 5h6c2.76 0 5-2.24 5-5V7c0-2.76-2.24-5-5-5z" /></svg>,
    Lightbulb: (props: React.ComponentProps<"svg">) => <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A5 5 0 0 0 8 8c0 1.3.5 2.6 1.5 3.5.8.8 1.3 1.5 1.5 2.5" /><path d="M9 18h6" /><path d="M10 22h4" /></svg>,
    Target: (props: React.ComponentProps<"svg">) => <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" /></svg>,
    Sparkles: (props: React.ComponentProps<"svg">) => <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" /><path d="M5 3v4" /><path d="M19 17v4" /><path d="M3 5h4" /><path d="M17 19h4" /></svg>,
    Loader2: (props: React.ComponentProps<"svg">) => <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`animate-spin ${props.className}`}><path d="M21 12a9 9 0 1 1-6.219-8.56" /></svg>,
    X: (props: React.ComponentProps<"svg">) => <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="M6 6l12 12" /></svg>
};

// --- 2. Componentes de UI Reutilizables ---

// Skeleton Loader para mejor percepción de carga
const SkeletonLoader = () => (
    <div className="max-w-4xl mx-auto space-y-8 py-10 animate-pulse">
        <div className="h-8 bg-gray-200 rounded-lg w-1/3 mb-10"></div>
        {[1, 2].map((i) => (
            <div key={i} className="space-y-4">
                <div className="h-6 bg-gray-200 rounded w-1/4"></div>
                <div className="h-40 bg-gray-100 rounded-[2rem]"></div>
                <div className="h-40 bg-gray-100 rounded-[2rem]"></div>
            </div>
        ))}
    </div>
);

// Barra de Escala (Rating) Mejorada
const RatingScale = ({
    max,
    selected,
    onSelect
}: {
    max: number;
    selected?: number;
    onSelect: (val: number) => void
}) => {
    return (
        <div className="mt-6">
            <div className="flex flex-col sm:flex-row gap-2 w-full">
                {Array.from({ length: max + 1 }).map((_, i) => {
                    const isActive = selected === i;
                    const isHighlight = selected !== undefined && i <= selected;

                    return (
                        <button
                            key={i}
                            onClick={() => onSelect(i)}
                            className={`
                relative flex-1 group py-3 px-2 rounded-xl border transition-all duration-200 ease-out
                flex flex-col items-center justify-center gap-1
                focus:outline-none focus:ring-2 focus:ring-sofka-light-blue focus:ring-offset-2
                ${isActive
                                    ? "bg-sofka-blue border-sofka-blue text-white shadow-lg shadow-sofka-blue/20 scale-105 z-10"
                                    : "bg-white border-gray-200 text-gray-500 hover:border-sofka-light-blue hover:bg-sofka-gray/10"}
              `}
                        >
                            <span className={`text-lg font-bold ${isActive ? "text-white" : "text-gray-700"}`}>{i}</span>
                            <span className={`text-[10px] uppercase font-bold tracking-wider ${isActive ? "text-sofka-light-blue" : "text-gray-400"}`}>
                                {getScaleText(i)}
                            </span>

                            {/* Barra indicadora visual */}
                            <div className={`absolute bottom-0 left-0 right-0 h-1 rounded-b-xl transition-all ${isHighlight && !isActive ? "bg-sofka-light-blue/20" : "bg-transparent"}`} />
                        </button>
                    );
                })}
            </div>
            <div className="flex justify-between mt-2 px-1">
                <span className="text-xs font-medium text-gray-400">Nivel Inicial</span>
                <span className="text-xs font-medium text-gray-400">Maestría</span>
            </div>
        </div>
    );
};

interface FormPreviewProps {
    formId: string;
    onBack: () => void;
}

const FormPreview: FC<FormPreviewProps> = ({ formId, onBack }) => {
    const [form, setForm] = useState<FormConfig | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [answers, setAnswers] = useState<Record<string, number>>({});
    const [showResult, setShowResult] = useState(false);

    // AI Analysis State
    const [analysis, setAnalysis] = useState<string | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [showAnalysisModal, setShowAnalysisModal] = useState(false);

    const handleAnalyze = async () => {
        if (!resultData) return;

        // API Call (Persistence is now handled in the backend)
        try {
            setIsAnalyzing(true);
            const res = await fetch('/api/admin/forms/analysis', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    formId,
                    title: form?.title,
                    answers,
                    resultData
                })
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || errorData.message || "Error al analizar con IA");
            }
            const { analysis: result } = await res.json();

            setAnalysis(result);
            setShowAnalysisModal(true);
        } catch (err: any) {
            toast.error(err.message || "No se pudo generar el análisis. Intente nuevamente.");
        } finally {
            setIsAnalyzing(false);
        }
    };


    useEffect(() => {
        // Simulación de fetch
        const fetchForm = async () => {
            try {
                setLoading(true);
                const res = await fetch(`/api/admin/forms/${formId}`);
                if (!res.ok) throw new Error("No pudimos cargar la evaluación.");
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

    // Lógica de cálculo (Optimizada con useMemo)
    const resultData = useMemo(() => {
        if (!form || !showResult) return null;

        let totalScore = 0;
        let maxPossibleScore = 0;
        const improvements: { id: string; question: string; score: number; example: string }[] = [];

        form.categories.forEach(cat => {
            cat.questions.forEach(q => {
                const answer = answers[q.id] || 0;
                totalScore += answer;
                maxPossibleScore += q.scaleMax;

                if (answer < q.scaleMax) {
                    improvements.push({ id: q.id, question: q.question, score: answer, example: q.example || "" });
                }
            });
        });

        const percentage = maxPossibleScore > 0 ? (totalScore / maxPossibleScore) * 100 : 0;

        const levels = [
            { threshold: 85, level: "Experto / Líder", color: "text-sofka-blue", bg: "bg-sofka-light-blue/10", border: "border-sofka-light-blue/20", feedback: "Dominio excepcional. Estás listo para escalar y mentorizar." },
            { threshold: 60, level: "Competente / Avanzado", color: "text-green-700", bg: "bg-green-50", border: "border-green-200", feedback: "Sólida experiencia práctica. Enfócate en la complejidad." },
            { threshold: 30, level: "En Desarrollo", color: "text-sofka-light-blue", bg: "bg-sofka-gray/20", border: "border-sofka-gray/30", feedback: "Conceptos claros. Necesitas más horas de vuelo en proyectos reales." },
            { threshold: 0, level: "Inicial", color: "text-sofka-orange", bg: "bg-sofka-orange/10", border: "border-sofka-orange/20", feedback: "El mejor momento para aprender fundamentos teóricos es ahora." }
        ];

        const levelInfo = levels.find(l => percentage >= l.threshold) || levels[3];

        return {
            ...levelInfo,
            score: totalScore,
            totalPossible: maxPossibleScore,
            percentage: Math.round(percentage),
            improvements
        };
    }, [form, answers, showResult]);

    // Progreso
    const totalQuestions = form?.categories.reduce((acc, cat) => acc + cat.questions.length, 0) || 0;
    const answeredCount = Object.keys(answers).length;
    const progress = (answeredCount / totalQuestions) * 100;

    if (loading) return <SkeletonLoader />;

    if (error) return (
        <div className="flex items-center justify-center min-h-[50vh]">
            <Card className="text-center max-w-md shadow-lg border-red-100 p-0">
                <div className="p-8">
                    <Icons.AlertCircle className="w-12 h-12 mx-auto mb-4 text-sofka-error" />
                    <h3 className="text-lg font-extrabold mb-2 text-sofka-blue">Error de Carga</h3>
                    <p className="mb-6 text-sm text-gray-500">{error}</p>
                    <Button onClick={onBack} variant="outline" className="w-full">Volver a intentar</Button>
                </div>
            </Card>
        </div>
    );

    if (!form) return null;

    // --- VISTA: RESULTADOS (Dashboard) ---
    if (showResult && resultData) {
        return (
            <div className="mx-auto pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">

                {/* Header simple de resultados */}
                <div className="flex items-center gap-2 mb-8 text-gray-500 cursor-pointer hover:text-sofka-blue transition-colors w-fit" onClick={() => setShowResult(false)}>
                    <Icons.ArrowLeft className="w-4 h-4" />
                    <span className="text-sm font-bold">Volver a las preguntas</span>
                </div>

                {/* AI Analysis Modal */}
                {showAnalysisModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-sofka-blue/60 backdrop-blur-sm animate-in fade-in duration-300">
                        <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-4 duration-500">
                            {/* Modal Header */}
                            <div className="p-8 border-b flex items-center justify-between bg-sofka-gray/10">
                                <div className="flex items-center gap-3">
                                    <div className="p-2.5 bg-sofka-blue rounded-2xl shadow-lg shadow-sofka-blue/20">
                                        <Icons.Sparkles className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-extrabold text-sofka-blue">Análisis con IA</h3>
                                        <p className="text-xs text-sofka-light-blue font-bold uppercase tracking-wider">Lead Technical Insight</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setShowAnalysisModal(false)}
                                    className="p-2 hover:bg-white rounded-full text-gray-400 hover:text-sofka-blue transition-all border border-transparent hover:border-gray-100"
                                >
                                    <Icons.X className="w-6 h-6" />
                                </button>
                            </div>

                            {/* Modal Content */}
                            <div className="flex-1 overflow-y-auto p-8 sm:p-10 custom-scrollbar">
                                <div className="prose prose-sofka max-w-none text-gray-700 leading-relaxed space-y-4">
                                    <Markdown>{analysis}</Markdown>
                                </div>
                            </div>

                            {/* Modal Footer */}
                            <div className="p-6 bg-gray-50/50 border-t flex justify-end">
                                <Button
                                    onClick={() => setShowAnalysisModal(false)}
                                    className="px-8"
                                >
                                    Entendido
                                </Button>
                            </div>
                        </div>
                    </div>
                )}

                <div className="bg-white rounded-[2rem] shadow-xl shadow-sofka-blue/5 border border-gray-100 overflow-hidden">
                    {/* Hero Section */}
                    <div className={`p-10 text-center border-b ${resultData.bg} ${resultData.border}`}>
                        <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-white shadow-sm mb-6">
                            <Icons.Trophy className={`w-10 h-10 ${resultData.color}`} />
                        </div>
                        <h2 className={`text-4xl font-black ${resultData.color} mb-3 tracking-tight`}>{resultData.level}</h2>
                        <p className="text-gray-700 max-w-lg mx-auto text-lg font-medium leading-relaxed">{resultData.feedback}</p>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-gray-100 border-b border-gray-100">
                        <div className="p-8 text-center hover:bg-sofka-gray/5 transition-colors">
                            <span className="block text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">Afinidad</span>
                            <span className="text-5xl font-black text-sofka-blue">{resultData.percentage}%</span>
                        </div>
                        <div className="p-8 text-center hover:bg-sofka-gray/5 transition-colors">
                            <span className="block text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">Puntaje</span>
                            <div className="flex items-baseline justify-center gap-1">
                                <span className="text-5xl font-black text-sofka-blue">{resultData.score}</span>
                                <span className="text-xl font-medium text-gray-400">/ {resultData.totalPossible}</span>
                            </div>
                        </div>
                    </div>

                    {/* Action Items */}
                    <div className="p-10 bg-white">
                        <h3 className="text-xl font-extrabold text-sofka-blue mb-6 flex items-center gap-2">
                            <Icons.Target className="w-6 h-6 text-sofka-orange" />
                            Áreas de Oportunidad
                        </h3>

                        {resultData.improvements.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {resultData.improvements.map((item) => (
                                    <div key={item.id} className="group flex items-start gap-4 p-5 rounded-2xl border border-gray-100 bg-sofka-gray/10 hover:bg-white hover:border-sofka-light-blue hover:shadow-md transition-all duration-300 h-full">
                                        <div className="flex-1">
                                            <h4 className="font-extrabold text-sofka-blue mb-1 leading-snug">{item.question}</h4>
                                            <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500 mt-2">
                                                <Badge variant="primary">{getScaleText(item.score).toUpperCase()}</Badge>
                                                <span className="text-xs text-gray-400 italic">Example: {item.example}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="bg-sofka-success/10 border border-sofka-success/20 p-6 rounded-2xl flex items-center gap-4 text-sofka-success">
                                <div className="bg-white p-2 rounded-full shadow-sm">
                                    <Icons.Check className="w-6 h-6 text-sofka-success" />
                                </div>
                                <div className="flex-1">
                                    <p className="font-extrabold">¡Impecable!</p>
                                    <p className="text-sm font-medium opacity-80">No detectamos brechas de conocimiento críticas para este perfil.</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Footer Actions */}
                    <div className="p-8 bg-sofka-gray/5 flex flex-col sm:flex-row gap-4 justify-end border-t border-gray-100">
                        <Button
                            variant="ghost"
                            onClick={() => { setAnswers({}); setShowResult(false); window.scrollTo({ top: 0 }); }}
                        >
                            Reiniciar
                        </Button>
                        <Button
                            variant="outline"
                            onClick={onBack}
                        >
                            Finalizar
                        </Button>
                        <Button
                            variant="primary"
                            disabled={isAnalyzing}
                            onClick={handleAnalyze}
                            className="gap-2 px-8"
                            isLoading={isAnalyzing}
                        >
                            <Icons.Sparkles className="w-5 h-5" />
                            {isAnalyzing ? "Analizando..." : "Analizar con IA"}
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    // --- VISTA: CUESTIONARIO ---
    return (
        <div className="mx-auto pb-40">

            {/* 1. Sticky Header Dinámico */}
            <div className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 pt-4 pb-0 mb-8 transition-all">
                <div className="flex items-center gap-4 mb-4 px-4 sm:px-0">
                    <button
                        onClick={onBack}
                        className="p-2 -ml-2 hover:bg-sofka-gray/20 rounded-full text-gray-400 hover:text-sofka-blue transition-colors"
                        aria-label="Volver"
                    >
                        <Icons.ArrowLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <h1 className="text-lg font-extrabold text-sofka-blue leading-tight">{form.title}</h1>
                        <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">{answeredCount} de {totalQuestions} respondidas</p>
                    </div>
                </div>

                {/* Barra de Progreso integrada */}
                <div className="h-1.5 w-full bg-sofka-gray/20">
                    <div
                        className="h-full bg-sofka-light-blue transition-all duration-700 ease-out shadow-[0_0_12px_rgba(0,172,236,0.5)]"
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </div>

            {/* 2. Lista de Preguntas */}
            <div className="space-y-16 px-4 sm:px-0">
                {form.categories.map((category, catIdx) => (
                    <section key={category.id} className="animate-in slide-in-from-bottom-8 fade-in duration-700 delay-100">
                        <div className="flex items-center gap-4 mb-8">
                            <span className="flex items-center justify-center w-12 h-12 rounded-[1rem] bg-sofka-blue text-white font-black text-xl shadow-md">
                                {catIdx + 1}
                            </span>
                            <h2 className="text-2xl font-black text-sofka-blue tracking-tight">{category.title}</h2>
                        </div>

                        <div className="space-y-8">
                            {category.questions.map((q) => {
                                const isAnswered = answers[q.id] !== undefined;

                                return (
                                    <div
                                        key={q.id}
                                        className={`
                      relative p-6 sm:p-10 rounded-[2.5rem] border transition-all duration-500
                      ${isAnswered
                                                ? "bg-white border-sofka-light-blue/30 shadow-xl shadow-sofka-light-blue/5"
                                                : "bg-white border-gray-200 hover:border-sofka-light-blue/20 shadow-sm hover:shadow-lg"
                                            }
                    `}
                                    >
                                        {/* Indicador de "Completado" */}
                                        <div className={`absolute top-8 right-8 transition-all duration-500 ${isAnswered ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`}>
                                            <div className="bg-sofka-success text-white p-1.5 rounded-full shadow-md">
                                                <Icons.Check className="w-4 h-4" />
                                            </div>
                                        </div>

                                        <div className="mb-8 pr-10">
                                            <h3 className="text-xl font-extrabold text-sofka-blue leading-snug mb-4">{q.question}</h3>
                                            {q.example && (
                                                <div className="flex gap-3 items-start text-sm text-gray-600 bg-sofka-gray/10 p-4 rounded-2xl border border-sofka-gray/20">
                                                    <Icons.Info className="w-5 h-5 text-sofka-light-blue mt-0.5 flex-shrink-0" />
                                                    <span className="font-medium italic leading-relaxed">{q.example}</span>
                                                </div>
                                            )}
                                        </div>

                                        <RatingScale
                                            max={q.scaleMax}
                                            selected={answers[q.id]}
                                            onSelect={(val) => setAnswers(prev => ({ ...prev, [q.id]: val }))}
                                        />
                                    </div>
                                );
                            })}
                        </div>
                    </section>
                ))}
            </div>

            {/* 3. Botón Flotante de Acción */}
            <div className="fixed bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-white via-white/95 to-transparent z-40 pointer-events-none">
                <div className="max-w-md mx-auto pointer-events-auto">
                    <Button
                        disabled={answeredCount < totalQuestions}
                        onClick={() => {
                            window.scrollTo({ top: 0, behavior: "smooth" });
                            setTimeout(() => setShowResult(true), 150);
                        }}
                        className={`w-full py-7 rounded-2xl text-xl gap-3 shadow-2xl transition-all duration-500 ${answeredCount === totalQuestions ? 'bg-sofka-blue' : 'bg-gray-100'}`}
                    >
                        {answeredCount === totalQuestions ? (
                            <>
                                Ver Resultados
                                <Icons.Trophy className="w-6 h-6 animate-bounce" />
                            </>
                        ) : (
                            <span className="text-base font-bold">
                                Faltan {totalQuestions - answeredCount} preguntas
                            </span>
                        )}
                    </Button>
                </div>
            </div>
        </div>
    );
};

// --- Utils ---
function getScaleText(value: number): string {
    const map = ["Nulo", "Básico", "Aprendiz", "Competente", "Avanzado", "Experto"];
    return map[value] || "";
}

export default FormPreview;