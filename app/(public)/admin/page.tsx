"use client";

import { GapAnalysisRechart } from "@/components/GapAnalysisChart";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

// --- Helper Components for UI Structure ---

const Card = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div
    className={`bg-white shadow-lg rounded-xl border border-gray-200 p-6 md:p-8 ${className}`}
  >
    {children}
  </div>
);

const CardTitle = ({
  children,
  icon,
}: {
  children: React.ReactNode;
  icon: React.ReactNode;
}) => (
  <div className="flex items-center mb-4">
    {icon}
    <h2 className="text-xl md:text-2xl font-bold text-gray-800">{children}</h2>
  </div>
);

const InfoRow = ({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) => (
  <div className="flex justify-between items-start py-3 border-b border-gray-100">
    <dt className="text-sm font-semibold text-gray-600 w-1/3 pr-2">{label}</dt>
    <dd className="text-sm text-gray-800 text-right w-2/3 break-words">
      {value}
    </dd>
  </div>
);

// Component for rendering lists (like gaps or criteria)
const InfoList = ({ title, items }: { title: string; items: string[] }) => (
  <div className="mt-4">
    <h4 className="font-semibold text-gray-700 mb-2">{title}</h4>
    <ul className="list-disc list-inside space-y-1 pl-2">
      {items.map((item, index) => (
        <li key={index} className="text-sm text-gray-600">
          {item}
        </li>
      ))}
    </ul>
  </div>
);

// --- SVG Icons ---

const UserIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-7 h-7 text-blue-500 mr-3"
  >
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
  </svg>
);
const CheckCircleIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-7 h-7 text-green-500 mr-3"
  >
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
    <polyline points="22 4 12 14.01 9 11.01"></polyline>
  </svg>
);
const HelpCircleIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-7 h-7 text-purple-500 mr-3"
  >
    <circle cx="12" cy="12" r="10"></circle>
    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
    <line x1="12" y1="17" x2="12.01" y2="17"></line>
  </svg>
);
const TargetIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-7 h-7 text-red-500 mr-3"
  >
    <circle cx="12" cy="12" r="10"></circle>
    <circle cx="12" cy="12" r="6"></circle>
    <circle cx="12" cy="12" r="2"></circle>
  </svg>
);

// --- Main Application Component ---

export default function App() {
  const [code, setCode] = useState("");
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/admin/sign-in");
    }
  }, [status, router]);

  if (status === "loading" || status === "unauthenticated") {
    return <div></div>;
  }

  // Safely parse JSON string from API response
  const safeJsonParse = (jsonString: any) => {
    if (typeof jsonString !== "string") return null;
    try {
      return JSON.parse(jsonString);
    } catch (e) {
      console.error("Failed to parse JSON:", e);
      return null;
    }
  };

  const handleFetchUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code) {
      setError("Por favor, ingresa un código de usuario.");
      return;
    }

    setLoading(true);
    setUserData(null);
    setError(null);

    const apiUrl = `/api/user?code=${encodeURIComponent(code)}`;

    try {
      const response = await fetch(apiUrl);

      // Check for non-successful HTTP responses
      if (!response.ok) {
        let errorMessage = `Error ${response.status}: ${response.statusText}. `;
        if (response.status === 404) {
          errorMessage += "No se encontró el usuario con ese código.";
        } else if (response.status === 500) {
          errorMessage +=
            "Hubo un problema en el servidor. Inténtalo más tarde.";
        } else {
          errorMessage += "No se pudo completar la solicitud.";
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();

      // The API returns some fields as stringified JSON, so we parse them.
      setUserData({
        ...data,
        evaluation_result: safeJsonParse(data.evaluation_result),
        questions: safeJsonParse(data.questions),
        certification_result: safeJsonParse(data.certification_result),
        challenge_result: safeJsonParse(data.challenge_result),
      });
    } catch (err) {
      // This logic now provides more specific feedback for common fetch issues.
      if (err instanceof TypeError && err.message === "Failed to fetch") {
        setError(
          "Error de red: No se pudo conectar a la API. Esto puede deberse a un problema de CORS o a que el servidor no está disponible. Revisa la consola del navegador para más detalles."
        );
      } else {
        setError(
          (err as Error).message || "Ocurrió un error al realizar la consulta."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen flex  font-sans text-gray-800">
      <div className="container mx-auto px-4 py-8 md:py-12">
        <header className="text-center mb-8 md:mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight">
            Portal de Revisión de Candidatos
          </h1>
          <p className="mt-3 text-lg text-gray-500 max-w-2xl mx-auto">
            Ingresa el código único del candidato para ver los resultados
            detallados de su proceso de pre-selección.
          </p>
        </header>

        <main>
          {/* --- Search Form --- */}
          <div className="max-w-xl mx-auto mb-8">
            <form
              onSubmit={handleFetchUser}
              className="flex flex-col sm:flex-row items-center gap-3 bg-white p-2 rounded-xl shadow-md border"
            >
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Ingresa el código del candidato..."
                className="w-full px-4 py-3 text-lg border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
                aria-label="Código del candidato"
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto bg-blue-600 text-white font-bold px-6 py-3 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300 disabled:cursor-not-allowed transition-all duration-200 ease-in-out flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Buscando...
                  </>
                ) : (
                  "Consultar"
                )}
              </button>
            </form>
          </div>

          {/* --- Display Area --- */}
          <div>
            {error && (
              <div
                className="max-w-2xl mx-auto bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg"
                role="alert"
              >
                <p className="font-bold">Error</p>
                <p>{error}</p>
              </div>
            )}

            {userData && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-6">
                {/* --- Left Column --- */}
                <div className="space-y-8">
                  <Card>
                    <CardTitle icon={<UserIcon />}>
                      Información General
                    </CardTitle>
                    <dl>
                      <InfoRow label="Nombre" value={userData.name || "N/A"} />
                      <InfoRow label="Código" value={userData.code || "N/A"} />
                      <InfoRow
                        label="Requisitos"
                        value={userData.requirements || "N/A"}
                      />
                      <InfoRow
                        label="Paso Actual"
                        value={userData.step || "N/A"}
                      />
                      <InfoRow
                        label="ID de Formulario"
                        value={userData.form_id || "N/A"}
                      />
                    </dl>
                  </Card>

                  {userData.evaluation_result && (
                    <Card>
                      <CardTitle icon={<CheckCircleIcon />}>
                        Resultados de Pre-Screening
                      </CardTitle>
                      <dl>
                        <InfoRow
                          label="ID Formulario Evaluación"
                          value={userData.evaluation_result.formId || "N/A"}
                        />
                        <InfoRow
                          label="Resultado General"
                          value={
                            userData.evaluation_result.valid ? (
                              <span className="font-bold text-green-600 bg-green-100 px-2 py-1 rounded-full">
                                Aprobado
                              </span>
                            ) : (
                              <span className="font-bold text-red-600 bg-red-100 px-2 py-1 rounded-full">
                                No Aprobado
                              </span>
                            )
                          }
                        />
                      </dl>

                      {userData.evaluation_result.answers && (
                        <div className="mt-6">
                          <h4 className="font-semibold text-gray-700 mb-2">
                            Puntajes por Habilidad
                          </h4>
                          <dl>
                            {Object.entries(
                              userData.evaluation_result.answers
                            ).map(([skill, score]) => (
                              <InfoRow
                                key={skill}
                                label={skill}
                                value={String(score)}
                              />
                            ))}
                          </dl>
                        </div>
                      )}

                      {userData.evaluation_result.gaps?.length > 0 && (
                        <div className="mt-6">
                          <h4 className="font-semibold text-gray-700 mb-2">
                            Brechas Identificadas
                          </h4>
                          <dl>
                            {userData.evaluation_result.gaps.map(
                              (gap: any, index: number) => (
                                <InfoRow
                                  key={index}
                                  label={gap.skill}
                                  value={`Evaluado: ${gap.got} / ${gap.required}`}
                                />
                              )
                            )}
                          </dl>
                        </div>
                      )}

                      {userData.evaluation_result.gaps?.length > 0 && (
                        <div className="mt-6">
                          <h4 className="font-semibold text-gray-700 mb-4">
                            Análisis Gráfico de Brechas
                          </h4>

                          {/* Contenedor para el gráfico con altura definida.
                            ResponsiveContainer de Recharts llenará este div.
                          */}
                          <div className="w-full h-64 md:h-80">
                            <GapAnalysisRechart
                              gaps={userData.evaluation_result.gaps}
                            />
                          </div>
                        </div>
                      )}
                    </Card>
                  )}
                </div>

                {/* --- Right Column --- */}
                <div className="space-y-8">
                  {userData.questions?.questions?.length > 0 && (
                    <Card>
                      <CardTitle icon={<HelpCircleIcon />}>
                        Preguntas de Certificación
                      </CardTitle>
                      <div className="space-y-4">
                        {userData.questions.questions.map((q: any) => {
                          const res =
                            userData.certification_result?.details.find(
                              (data: any) => data.questionId === q.id
                            ) || {};

                          return (
                            <div
                              key={q.id}
                              className="p-3 bg-gray-50 rounded-lg border"
                            >
                              <p className="font-medium text-gray-800">
                                {q.question}
                              </p>
                              {res &&
                                (res.correct ? (
                                  <p className="text-sm text-green-700 mt-1">
                                    Respuesta Correcta:
                                    <span className="pl-2 font-semibold">
                                      ✔️ {q.correctAnswer}
                                    </span>
                                  </p>
                                ) : (
                                  <p className="text-sm text-green-700 mt-1">
                                    Respuesta Incorrecta:
                                    <span className="pl-2 font-semibold">
                                      ❌ {res.chosen}
                                    </span>{" "}
                                    | ✔️ {q.correctAnswer}
                                  </p>
                                ))}
                            </div>
                          );
                        })}
                      </div>
                    </Card>
                  )}

                  {userData.certification_result && (
                    <Card>
                      <CardTitle icon={<TargetIcon />}>
                        Análisis de Certificación
                      </CardTitle>
                      <div className="text-center mb-4">
                        <p className="text-lg text-gray-600">Resultado</p>
                        <p className="text-4xl font-bold text-blue-600">
                          {userData.certification_result.score} /{" "}
                          {userData.certification_result.total}
                        </p>
                      </div>
                      <h4 className="font-semibold text-gray-700 mb-2">
                        Análisis Detallado:
                      </h4>
                      <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-md border">
                        {userData.certification_result.analysis ||
                          "No hay análisis disponible."}
                      </p>
                    </Card>
                  )}

                  {userData.challenge_result && (
                    <Card>
                      <CardTitle icon={<TargetIcon />}>
                        Pregunta Desafiante
                      </CardTitle>
                      <div>
                        <h3 className="font-bold text-lg text-gray-800">
                          {userData.challenge_result.title}
                        </h3>
                        <p className="text-sm text-gray-600 mt-2 mb-4 border-l-2 border-blue-500 pl-3">
                          {userData.challenge_result.description}
                        </p>
                        {userData.challenge_result.coverages && (
                          <InfoList
                            title="Coberturas:"
                            items={userData.challenge_result.coverages}
                          />
                        )}
                        {userData.challenge_result.evaluationCriteria && (
                          <InfoList
                            title="Criterios del Reto:"
                            items={userData.challenge_result.evaluationCriteria}
                          />
                        )}
                        {userData.challenge_result.coverageQuestions && (
                          <InfoList
                            title="Preguntas Base:"
                            items={userData.challenge_result.coverageQuestions}
                          />
                        )}
                      </div>
                    </Card>
                  )}
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
