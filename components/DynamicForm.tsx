"use client";

import { FormConfig } from "@/types/InputConfig";
import { useState, useMemo } from "react";
import ResultChart from "./ResultChart";
import { useAuth } from "@/context/AuthContext";
import createApiClient from "@/lib/APIClient";

function DynamicForm({
  form,
  defaultResult,
  requirements,
}: {
  form: FormConfig;
  defaultResult: any;
  requirements: string;
}) {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [result, setResult] = useState(defaultResult);
  const auth = useAuth();
  const api = useMemo(() => createApiClient(auth), [auth]);

  const handleChange = (questionId: string, value: number) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleEvaluation = async () => {
    setLoading(true);
    setMessage(null);
    try {
      const response = await api.post("/evaluation", {
        formId: form.id,
        answers,
        requirements,
      });
      setResult(response.data);
      setMessage({ type: "success", text: "✅ Respuestas enviadas con éxito" });
    } catch (error) {
      setMessage({ type: "error", text: "❌ Error al enviar respuestas" });
    } finally {
      setLoading(false);
    }
  };

  


  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-4xl bg-white rounded-lg shadow-lg p-8 space-y-6">
        {message && (
          <div
            className={`p-4 rounded-md text-center font-semibold ${
              message.type === "success"
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {message.text}
          </div>
        )}

        {result && (
          <div className="text-center">
            <ResultChart
              opportunityTitle={result.opportunityTitle}
              gaps={result.gaps}
            />

            <div className="flex justify-center space-x-4 mt-8">
              <button
                type="submit"
                className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-transform duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={() => {
                  auth.logout();
                }}
              >
                Finalizar
              </button>
            </div>
          </div>
        )}
        
        {!result && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleEvaluation();
            }}
            className="space-y-8"
          >
            {form.categories.map((category) => (
              <div
                key={category.id}
                className="p-6 border rounded-lg bg-gray-50 shadow-sm transition-shadow duration-300 hover:shadow-md"
              >
                <h2 className="text-2xl font-semibold mb-4 text-gray-700">
                  {category.title}
                </h2>
                {category.questions.map((q) => (
                  <div key={q.id} className="mb-6">
                    <label className="block font-medium mb-2 text-gray-600">
                      {q.question}
                      <span className="mt-2 text-sm text-gray-500 block">
                        {" "}
                        Ej. {q.example}
                      </span>
                    </label>
                    <select
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-300"
                      value={answers[q.id] ?? ""}
                      onChange={(e) =>
                        handleChange(q.id, Number(e.target.value))
                      }
                      required
                    >
                      <option value="">Seleccione un nivel...</option>
                      {Array.from({ length: q.scaleMax + 1 }).map((_, i) => (
                        <option key={i} value={i}>
                          {i} - {scaleText(i)}
                        </option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>
            ))}

            <button
              type="submit"
              className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-transform duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? "Enviando..." : "Enviar Evaluación"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

function scaleText(value: number): string {
  switch (value) {
    case 0:
      return "No conoce";
    case 1:
      return "Conocimiento muy básico o teórico mínimo";
    case 2:
      return "Conocimiento teórico y algo de práctica limitada";
    case 3:
      return "Experiencia práctica en proyectos";
    case 4:
      return "Experiencia sólida y autónoma en proyectos";
    case 5:
      return "Dominio profundo y liderazgo/innovación";
    default:
      return "";
  }
}

export default DynamicForm;
