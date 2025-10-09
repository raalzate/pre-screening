"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { useAuth } from "@/context/AuthContext";
import createApiClient from "@/lib/apiClient";
// @ts-expect-error El paquete no tiene tipos.
import Mermaid from "react-mermaid2";
import QuestionCanvas from "./QuestionCanvas";
import { toast } from "react-hot-toast";

export interface Challenge {
  challengeId: string;
  title: string;
  description: string;
  coverages: string[];
  mermaid?: string;
  evaluationCriteria: string[];
}

interface ChallengeContainerProps {
  defaultResult?: Challenge | null;
}

// Alerta de Información (Tono Azul) - Versión Full-Width

const ChallengeDisclaimerBlueFullWidth = () => {
  return (
    // 👇 NOTA: Se eliminaron las clases `max-w-2xl` y `mx-auto` para que ocupe el ancho completo.
    <div>
      <div className="bg-blue-50 border-l-4 border-blue-500 rounded-r-lg p-6 shadow-md">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            {/* */}
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7 text-blue-500 mr-4">
              <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm8.706-1.442c1.146-.573 2.437.463 2.126 1.706l-.709 2.836.042-.02a.75.75 0 01.67 1.34l-.04.022c-1.147.573-2.438-.463-2.127-1.706l.71-2.836-.042.02a.75.75 0 11-.671-1.34l.04-.022zM12 18a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="flex-grow">
            <h3 className="text-xl font-bold text-blue-800">
              Instrucciones para el Reto Técnico
            </h3>
            <p className="mt-2 text-blue-700">
              Has avanzado a la siguiente etapa. Como parte de ella, deberás preparar una solución para el reto asignado. Por favor, ten en cuenta las siguientes condiciones:
            </p>
            <ul className="mt-4 list-disc list-inside space-y-2 text-blue-700">
              <li>
                <b>Plazo de Preparación:</b> Dispones de un máximo de <strong className="font-semibold text-blue-800">3 días</strong> a partir de hoy para preparar tu propuesta.
              </li>
              <li>
                <b>Formato de Evaluación:</b> Deberás<strong className="font-semibold text-blue-800"> sustentar tu solución durante la entrevista técnica</strong>. La evaluación se centrará en tu razonamiento y comunicación.
              </li>
              <li>
                <b>Entregables:</b><strong className="font-semibold text-blue-800"> No es necesario entregar el código fuente</strong>. Puedes apoyarte en documentos (diagramas, presentaciones, etc.) para facilitar tu sustentación.
              </li>
            </ul>
            <div className="mt-5 bg-blue-100 p-4 rounded-lg border border-blue-200">
                <p className="font-semibold text-blue-800">Nuestra recomendación:</p>
                <p className="text-sm text-blue-700 mt-1 italic">
                    Concéntrate en explicar el "porqué" de tus decisiones (arquitectura, tecnologías, trade-offs) más que en los detalles de la implementación.
                </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function ChallengeContainer({
  defaultResult,
}: ChallengeContainerProps) {
   const auth = useAuth();
  const { user, logout } = auth;
  const api = useMemo(() => createApiClient(auth), [auth]);

  const [challenge, setChallenge] = useState<Challenge | null>(
    defaultResult ?? null
  );
  const [loading, setLoading] = useState<boolean>(!defaultResult);
  const [error, setError] = useState<string | null>(null);
  const [showCriteria, setShowCriteria] = useState(true);

  const fetchChallenge = useCallback(async () => {
    // Si ya tenemos un challenge, no hacemos nada más
    if (challenge) {
      setLoading(false);
      return;
    }

    if (!user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const evaluationResult = user.evaluation_result
        ? JSON.parse(user.evaluation_result)
        : null;
      const response = await api.post("/challenge", {
        evaluationResult,
      });

      setChallenge(response.data);
    } catch (err) {
      console.error("Error al cargar el challenge:", err);
      const errorMessage =
        err instanceof Error ? err.message : "No se pudo cargar el challenge";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [api, user, challenge]);

  useEffect(() => {
    if (!defaultResult) {
      fetchChallenge();
    }
  }, [fetchChallenge, defaultResult]);

  const cleanDiagram = useMemo(() => {
    if (!challenge?.mermaid) return null;
    return challenge.mermaid.replace(/```mermaid|```/g, "").trim();
  }, [challenge?.mermaid]);

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-64 text-center p-4">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent mb-4"></div>
        <p className="text-gray-500 font-medium animate-pulse max-w-sm">
          No te preocupes, esto es normal. El sistema está generando un desafío único y personalizado para ti. A veces puede tardar un poco, así que tómate un respiro. ¡Ya casi terminamos!
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-red-600 font-medium">Error: {error}</p>
      </div>
    );
  }

  if (!challenge) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500">No hay challenge disponible.</p>
      </div>
    );
  }

  return (
    <div className="border rounded-xl shadow-md p-6 bg-white space-y-6 md:p-8">
      <ChallengeDisclaimerBlueFullWidth />
      <h2 className="text-3xl font-bold text-blue-700 text-center">
        {challenge.title}
      </h2>
      <p className="text-gray-700 leading-relaxed">
        <QuestionCanvas maxWidth={1200} question={challenge.description} />
      </p>

      <section className="space-y-4">
        <h3 className="text-xl font-semibold text-gray-800 border-b pb-2">
          Cobertura del reto
        </h3>
        <ul className="list-disc list-inside space-y-2 text-gray-800 pl-4">
          {challenge.coverages.map((task, idx) => (
            <li key={idx}>{task}</li>
          ))}
        </ul>
      </section>

      {cleanDiagram && (
        <div className="p-4 border rounded-lg bg-gray-50 shadow-inner">
          <Mermaid key={cleanDiagram} chart={cleanDiagram} />
        </div>
      )}

      <div className="text-center mt-6">
        <button
          aria-expanded={showCriteria}
          onClick={() => setShowCriteria((prev) => !prev)}
          className="bg-blue-600 text-white px-6 py-3 rounded-full font-medium shadow-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-105"
        >
          {showCriteria
            ? "Ocultar criterios de evaluación"
            : "Mostrar criterios de evaluación"}
        </button>
      </div>

      {showCriteria && (
        <div className="mt-4 bg-gray-50 border rounded-lg p-6 animate-fade-in-down text-left">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">
            Criterios de evaluación
          </h3>
          <ul className="list-disc list-inside space-y-2 text-gray-700 pl-4">
            {challenge.evaluationCriteria.map((crit, idx) => (
              <li key={idx}>{crit}</li>
            ))}
          </ul>

            <div className="mt-6 text-sm text-gray-600 text-right italic">
        Nota: La pregunta desafiante del reto deberá ser sustentada durante la entrevista. El candidato deberá explicar su respuesta con argumentos sólidos y bien estructurados, demostrando claridad en el razonamiento, conocimiento técnico y capacidad de justificar las decisiones tomadas.
      </div>
        </div>
      )}

      <div className="flex justify-center space-x-4 mt-8">
        <button
          type="button"
          className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700"
          onClick={() => logout()}
        >
          Finalizar
        </button>
      </div>
    </div>
  );
}
