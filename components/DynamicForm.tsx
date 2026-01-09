"use client";

import { FormConfig } from "@/types/InputConfig";
import { useState, useMemo } from "react";
import ResultChart from "./ResultChart";
import { useAuth } from "@/context/AuthContext";
import createApiClient from "@/lib/apiClient";

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

  const [step, setStep] = useState(0); // 🔹 índice de categoría actual
  const totalSteps = form.categories.length;

  const auth = useAuth();
  const api = useMemo(() => createApiClient(), []);

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
      console.error("Error enviando respuestas:", error);
      setMessage({ type: "error", text: "❌ Error al enviar respuestas" });
    } finally {
      setLoading(false);
    }
  };

  if (result) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center">
        <div className="w-full  bg-white rounded-lg shadow-lg  space-y-6 text-center p-6">
          <ResultChart
            opportunityTitle={"Gráfica de oportunidad"}
            gaps={result.gaps}
          />
           <div className="mt-6 text-sm text-gray-600 text-right italic">
        Nota: Las gráficas presentadas son un apoyo visual para identificar el
        nivel de alineación con la oportunidad. Esta información constituye
        únicamente un insumo dentro del proceso de evaluación y será considerada
        junto con otros criterios y etapas dentro del proceso.
      </div>
          <div className="flex justify-center space-x-4 mt-8 p-6">
            <button
              className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-transform duration-300 transform hover:scale-105"
              onClick={() => auth.logout()}
            >
              Finalizar
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentCategory = form.categories[step];

  return (
    <div className="min-h-screen  flex flex-col justify-center items-center ">
      <div className="w-full bg-white rounded-lg shadow-lg p-8 space-y-6">
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

        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (step === totalSteps - 1) {
              handleEvaluation();
            } else {
              setStep((prev) => prev + 1);
            }
          }}
          className="space-y-8"
        >
          <div className="p-6 border rounded-lg bg-gray-50 shadow-sm transition-shadow duration-300 hover:shadow-md">

            <h2 className="text-2xl font-semibold mb-4 text-gray-700"> {currentCategory.title} </h2>

            {currentCategory.questions.map((q) => (
              <div key={q.id} className="mb-6">
                <label className="block pl-2 font-medium mb-2 text-gray-600">
                  {q.question}{" "}
                  <span className="mt-2 text-sm text-gray-500 block">
                    Ej. {q.example}{" "}
                  </span>{" "}
                </label>

                <select
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-300"
                  value={answers[q.id] ?? ""}
                  onChange={(e) => handleChange(q.id, Number(e.target.value))}
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

          <div className="flex justify-between">
            <button
              type="button"
              onClick={() => setStep((prev) => Math.max(prev - 1, 0))}
              disabled={step === 0}
              className="bg-gray-300 text-gray-800 px-6 py-3 rounded-lg font-semibold hover:bg-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Anterior
            </button>

            {step < totalSteps - 1 ? (
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-transform duration-300 transform hover:scale-105"
              >
                Siguiente
              </button>
            ) : (
              <button
                type="submit"
                disabled={loading}
                className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-transform duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Por favor espere..." : "Enviar Evaluación"}
              </button>
            )}
          </div>

          {/* 🔹 Indicador de progreso */}
          <div className="text-center text-gray-600 mt-4">
            Categoría {step + 1} de {totalSteps}
          </div>
        </form>
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
