"use client";

import { useAuth } from "@/context/AuthContext";
import createApiClient from "@/lib/apiClient";
import { FormJson } from "@/types/outputConfig";
import { useEffect, useMemo, useState } from "react";
import QuestionCanvas from "./QuestionCanvas";
// Importamos el hook que acabamos de crear
import useDisableShortcuts from "./hooks/useDisableShortcuts";

interface ResultDetail {
  questionId: string;
  correct: boolean;
  chosen: string | null;
  correctAnswer: string;
  rationale: string;
  relatedTo: string[];
}

const TIME_PER_QUESTION = 125;

export default function DynamicMCQForm({
  defaultResult,
}: {
  defaultResult: any;
}) {
  // *** ACTIVAR SEGURIDAD ***
  // Con esta sola línea proteges todo el componente
  useDisableShortcuts();

  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [result, setResult] = useState<{
    score: number;
    total: number;
    details: ResultDetail[];
    analysis: string;
  } | null>(defaultResult);

  const auth = useAuth();
  const api = useMemo(() => createApiClient(), []);

  const [form, setForm] = useState<FormJson | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(TIME_PER_QUESTION);

  useEffect(() => {
    async function fetchForm() {
      try {
        const response = await api.get(`/certification`);
        setForm(response.data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    if (auth.user) {
      fetchForm();
    }
  }, [api, auth.user]);

  // Reset del timer al cambiar pregunta
  useEffect(() => {
    setTimeLeft(TIME_PER_QUESTION);
  }, [currentIndex]);

  // Lógica del Timer
  useEffect(() => {
    if (!form || result) return;

    if (timeLeft === 0) {
      handleNextOrSubmit();
      return;
    }

    const timerId = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timerId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft, form, result]);

  if (loading) return <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center">Cargando...</div>;
  if (error) return <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center">Error: {error}</div>;
  if (!form) return null;

  const handleChange = (questionId: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleNextOrSubmit = () => {
    const isLastQuestion = currentIndex === form.questions.length - 1;
    if (isLastQuestion) {
      handleSubmit({ preventDefault: () => { } } as React.FormEvent);
    } else {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let correct = 0;
    const details: ResultDetail[] = [];

    form.questions.forEach((q) => {
      const chosen = answers[q.id] ?? null;
      const isCorrect = chosen === q.correctAnswer;
      if (isCorrect) correct++;
      details.push({
        questionId: q.id,
        correct: isCorrect,
        chosen,
        correctAnswer: q.correctAnswer,
        rationale: q.rationale,
        relatedTo: q.relatedTo,
      });
    });

    const wrongTopics: string[] = [];
    details.forEach((d) => {
      if (!d.correct) wrongTopics.push(...d.relatedTo);
    });

    const analysis = wrongTopics.length === 0
      ? "Excelente, el candidato respondió correctamente todas las preguntas."
      : `El candidato mostró debilidades en las áreas: ${[...new Set(wrongTopics)].join(", ")}.`;

    const finalResult = { score: correct, total: form.questions.length, details, analysis };
    setResult(finalResult);

    try {
      await api.post("/certification", { result: finalResult });
    } catch (error) {
      console.error("Error saving result", error);
    }
  };

  const currentQuestion = form.questions[currentIndex];
  const progress = ((currentIndex + 1) / form.questions.length) * 100;

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const timerColor = timeLeft <= 10 ? "text-red-600 animate-pulse" : "text-gray-700";

  return (
    // Agregamos select-none para evitar copiar texto arrastrando el mouse
    <div className="min-h-screen flex-col justify-center items-center select-none">
      <div className="w-full bg-white rounded-lg shadow-lg p-8 space-y-6">
        <h2 className="text-3xl font-bold text-center text-gray-800">Certifica tus Conocimientos</h2>

        {!result && (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex flex-col gap-4">
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div className="bg-blue-600 h-3 rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
              </div>
              <div className="flex justify-between items-center text-sm font-medium">
                <span className="text-gray-600">Pregunta {currentIndex + 1} de {form.questions.length}</span>
                <div className={`flex items-center gap-2 text-lg ${timerColor} border px-3 py-1 rounded bg-gray-50`}>
                  <span>⏱️</span>
                  <span>{formatTime(timeLeft)}</span>
                </div>
              </div>
            </div>

            <div className="p-6 border rounded-lg bg-gray-50 shadow-sm">
              <QuestionCanvas maxWidth={1200} question={`${currentQuestion.id}. ${currentQuestion.question}`} />
              <div className="space-y-3 mt-4">
                {currentQuestion.options.map((opt) => (
                  <label key={opt} className="flex items-center p-3 border rounded-lg hover:bg-gray-100 transition-colors duration-300 cursor-pointer">
                    <input type="radio" name={currentQuestion.id} value={opt} checked={answers[currentQuestion.id] === opt} onChange={() => handleChange(currentQuestion.id, opt)} className="mr-3 h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300" />
                    <span className="text-gray-800">{opt}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex justify-end">
              {currentIndex < form.questions.length - 1 ? (
                <button type="button" onClick={() => setCurrentIndex((prev) => prev + 1)} className="px-6 py-3 rounded-lg font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-colors">Siguiente</button>
              ) : (
                <button type="submit" className="px-6 py-3 rounded-lg font-semibold bg-green-600 text-white hover:bg-green-700 transition-colors">Enviar Respuestas</button>
              )}
            </div>
          </form>
        )}

        {result && (
          // Removemos select-none aquí si quieres que puedan copiar su resultado
          <div className="mt-8 p-6 bg-gray-100 rounded-lg shadow-inner space-y-6 select-text">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-800">Resultado: {result.score} de {result.total}</p>
              <p className="text-md text-gray-700 mt-2">{result.analysis}</p>
            </div>
            <div className="space-y-4 mt-6">
              {result.details.map((d) => (
                <div key={d.questionId} className={`p-4 rounded-lg shadow-sm ${d.correct ? "bg-green-100 border-l-4 border-green-500" : "bg-red-100 border-l-4 border-red-500"}`}>
                  <p className="font-semibold"><strong>Pregunta {d.questionId}:</strong>{d.correct ? <span className="text-green-700"> Correcta ✅</span> : <span className="text-red-700"> Incorrecta ❌</span>}</p>
                  {!d.correct && (
                    <div className="mt-2 text-gray-700">
                      <p><strong>Tu respuesta:</strong> {d.chosen ?? "No respondida (Tiempo agotado)"}</p>
                      <p><strong>Respuesta correcta:</strong> {d.correctAnswer}</p>
                      <p className="text-sm mt-1"><strong>Explicación:</strong> {d.rationale}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-center space-x-4 mt-8">
              <button type="button" className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700" onClick={() => auth.logout()}>Finalizar</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}