"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import createApiClient from "@/lib/APIClient";

export interface Challenge {
  challengeId: string;
  title: string;
  description: string;
  coverages: string[];
  evaluationCriteria: string[];
}

interface ChallengeContainerProps {
  defaultResult?: Challenge | null;
}

export default function ChallengeContainer({ defaultResult }: ChallengeContainerProps) {
  const [challenge, setChallenge] = useState<Challenge | null>(defaultResult ?? null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCriteria, setShowCriteria] = useState(false);

  const auth = useAuth();
  const api = useMemo(() => createApiClient(auth), [auth]);

  const fetchChallenge = useCallback(async () => {
    if (!auth.user) return;

    try {
      setLoading(true);
      setError(null);

      const response = await api.post("/challenge", {
        ...(auth.user?.evaluation_result && {
          evaluationResult: JSON.parse(auth.user.evaluation_result),
        }),
      });

      setChallenge(response.data);
    } catch (err: any) {
      setError(err.message || "No se pudo cargar el challenge");
    } finally {
      setLoading(false);
    }
  }, [api, auth.user]);

  useEffect(() => {
    if (!challenge && auth.user) {
      fetchChallenge();
    } else {
      setLoading(false);
    }
  }, [fetchChallenge, auth.user, challenge]);

  if (loading) {
    return <p className="text-gray-500">Cargando challenge...</p>;
  }

  if (error) {
    return <p className="text-red-600">Error: {error}</p>;
  }

  if (!challenge) {
    return <p className="text-gray-500">No hay challenge disponible.</p>;
  }

  return (
    <div className="border rounded-xl shadow-md p-6 bg-white space-y-4">
      <h2 className="text-2xl font-bold text-blue-700">{challenge.title}</h2>
      <p className="text-gray-700">{challenge.description}</p>

      <section>
        <h3 className="text-lg font-semibold mb-2">Cobertura</h3>
        <ul className="list-disc pl-6 space-y-1">
          {challenge.coverages.map((task, idx) => (
            <li key={idx} className="text-gray-800">
              {task}
            </li>
          ))}
        </ul>
      </section>

      <button
        aria-expanded={showCriteria}
        onClick={() => setShowCriteria((prev) => !prev)}
        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
      >
        {showCriteria ? "Ocultar criterios" : "Mostrar criterios de evaluación"}
      </button>

      {showCriteria && (
        <div className="mt-4 bg-gray-50 border rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-2">Criterios de evaluación</h3>
          <ul className="list-disc pl-6 space-y-1">
            {challenge.evaluationCriteria.map((crit, idx) => (
              <li key={idx} className="text-gray-700">
                {crit}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex justify-center mt-8">
        <button
          type="button"
          onClick={auth.logout}
          className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-transform duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Finalizar
        </button>
      </div>
    </div>
  );
}
