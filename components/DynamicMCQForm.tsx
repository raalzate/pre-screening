'use client';

import { FormJson } from '@/types/outputConfig';
import { useState } from 'react';

  interface ResultDetail {
  questionId: string;
  correct: boolean;
  chosen: string | null;
  correctAnswer: string;
  rationale: string;
  relatedTo: string[];
}

export default function DynamicMCQForm({ form }: { form: FormJson }) {
const [answers, setAnswers] = useState<Record<string, string>>({});
  const [result, setResult] = useState<{
    score: number;
    total: number;
    details: ResultDetail[];
    analysis: string;
  } | null>(null);

  const handleChange = (questionId: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
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

    // Análisis breve: detectar debilidades por categorías
    const wrongTopics: string[] = [];
    details.forEach((d) => {
      if (!d.correct) {
        wrongTopics.push(...d.relatedTo);
      }
    });

    const analysis =
      wrongTopics.length === 0
        ? "Excelente, el candidato respondió correctamente todas las preguntas."
        : `El candidato mostró debilidades en las áreas: ${[
            ...new Set(wrongTopics),
          ].join(", ")}.`;

    setResult({
      score: correct,
      total: form.questions.length,
      details,
      analysis,
    });
  };

  return (
    <div className="w-full max-w-4xl bg-white rounded-lg shadow-lg p-8 space-y-6">
      <form onSubmit={handleSubmit} className="space-y-8">
        <h2 className="text-3xl font-bold text-center text-gray-800">Formulario: {form.formId}</h2>
        <p className="text-center text-gray-600">{form.scoreExplanation}</p>

        {form.questions.map((q) => (
          <div key={q.id} className="p-6 border rounded-lg bg-gray-50 shadow-sm transition-shadow duration-300 hover:shadow-md">
            <p className="font-semibold mb-4 text-gray-700">
              {q.id}. {q.question}
            </p>
            <div className="space-y-3">
              {q.options.map((opt) => (
                <label key={opt} className="flex items-center p-3 border rounded-lg hover:bg-gray-100 transition-colors duration-300">
                  <input
                    type="radio"
                    name={q.id}
                    value={opt}
                    checked={answers[q.id] === opt}
                    onChange={() => handleChange(q.id, opt)}
                    className="mr-3 h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <span className="text-gray-800">{opt}</span>
                </label>
              ))}
            </div>
          </div>
        ))}

        <button
          type="submit"
          className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-transform duration-300 transform hover:scale-105 disabled:opacity-50"
        >
          Enviar Respuestas
        </button>
      </form>

      {result && (
        <div className="mt-8 p-6 bg-gray-100 rounded-lg shadow-inner space-y-6">
            <div className="text-center">
                <p className="text-2xl font-bold text-gray-800">
                    Resultado: {result.score} de {result.total}
                </p>
                <p className="text-md text-gray-700 mt-2">{result.analysis}</p>
            </div>

          <div className="space-y-4 mt-6">
            {result.details.map((d) => (
              <div
                key={d.questionId}
                className={`p-4 rounded-lg shadow-sm ${
                  d.correct ? 'bg-green-100 border-l-4 border-green-500' : 'bg-red-100 border-l-4 border-red-500'
                }`}
              >
                <p className="font-semibold">
                  <strong>Pregunta {d.questionId}:</strong>{
                    d.correct ? <span className="text-green-700"> Correcta ✅</span> : <span className="text-red-700"> Incorrecta ❌</span>
                  }
                </p>
                {!d.correct && (
                  <div className="mt-2 text-gray-700">
                    <p>
                      <strong>Tu respuesta:</strong> {d.chosen ?? 'No respondida'}
                    </p>
                    <p>
                      <strong>Respuesta correcta:</strong> {d.correctAnswer}
                    </p>
                    <p className="text-sm mt-1">
                      <strong>Explicación:</strong> {d.rationale}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
