"use client";

import { FormJson } from "@/types/outputConfig";
import { useState } from "react";



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
    <form onSubmit={handleSubmit} className="space-y-6 p-4">
      <h2 className="text-2xl font-bold mb-4">Formulario: {form.formId}</h2>
      <p className="mb-6 text-gray-600">{form.scoreExplanation}</p>

      {form.questions.map((q) => (
        <div key={q.id} className="border rounded-lg p-4 shadow-sm">
          <p className="font-semibold mb-2">
            {q.id}. {q.question}
          </p>
          <div className="space-y-2">
            {q.options.map((opt) => (
              <label key={opt} className="block">
                <input
                  type="radio"
                  name={q.id}
                  value={opt}
                  checked={answers[q.id] === opt}
                  onChange={() => handleChange(q.id, opt)}
                  className="mr-2"
                />
                {opt}
              </label>
            ))}
          </div>
        </div>
      ))}

      <button
        type="submit"
        className="px-4 py-2 bg-blue-600 text-white rounded-lg"
      >
        Enviar respuestas
      </button>

      {result && (
        <div className="mt-6 p-4 bg-gray-100 rounded-lg space-y-4">
          <p className="text-lg font-semibold">
            Resultado: {result.score} de {result.total}
          </p>
          <p className="text-sm text-gray-700">{result.analysis}</p>

          <div className="space-y-4 mt-4">
            {result.details.map((d) => (
              <div
                key={d.questionId}
                className={`p-3 rounded-lg ${
                  d.correct ? "bg-green-100" : "bg-red-100"
                }`}
              >
                <p>
                  <strong>Pregunta {d.questionId}:</strong>{" "}
                  {d.correct ? "Correcta ✅" : "Incorrecta ❌"}
                </p>
                {!d.correct && (
                  <>
                    <p>
                      <strong>Tu respuesta:</strong> {d.chosen ?? "No respondida"}
                    </p>
                    <p>
                      <strong>Respuesta correcta:</strong> {d.correctAnswer}
                    </p>
                    <p className="text-sm text-gray-600">
                      <strong>Explicación:</strong> {d.rationale}
                    </p>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </form>
  );
}
