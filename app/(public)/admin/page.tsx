"use client";

import React, {
  useEffect,
  useState,
  FormEvent,
  FC,
  ReactNode,
} from "react";
import { GapAnalysisRechart } from "@/components/GapAnalysisChart";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const ALL_REQUIREMENTS = [
  "deuna:nestjs-ssr",
  "noram-fullstack:netcore-angular-ssr",
  "edi-iris-bank:edi-ssr",
] as const;

const ExternalLinkIcon = () => (
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
    className="w-4 h-4 ml-2"
  >
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
    <polyline points="15 3 21 3 21 9"></polyline>
    <line x1="10" y1="14" x2="21" y2="3"></line>
  </svg>
);

interface EvaluationGap {
  skill: string;
  got: number;
  required: number;
}
interface EvaluationResult {
  formId: string;
  valid: boolean;
  answers: Record<string, number>;
  gaps: EvaluationGap[];
}
interface CertificationDetail {
  questionId: string;
  correct: boolean;
  chosen: string;
}
interface CertificationResult {
  score: number;
  total: number;
  analysis: string;
  details: CertificationDetail[];
}
interface ChallengeResult {
  title: string;
  description: string;
  coverages: string[];
  evaluationCriteria: string[];
  coverageQuestions: string[];
}
interface Question {
  id: string;
  question: string;
  correctAnswer: string;
}
interface UserData {
  name: string;
  code: string;
  requirements: string;
  step: string;
  form_id: string;
  evaluation_result?: EvaluationResult;
  certification_result?: CertificationResult;
  challenge_result?: ChallengeResult;
  questions?: { questions: Question[] };
  interview_feedback?: string;
  interview_status?: string;
  technical_level?: string;
  interviewer_name?: string;
}

const Card: FC<{ children: ReactNode; className?: string }> = ({
  children,
  className = "",
}) => (
  <div
    className={`bg-white shadow-lg rounded-xl border border-gray-200 p-6 md:p-8 ${className}`}
  >
    {children}
  </div>
);

const CardTitle: FC<{ children: ReactNode; icon: ReactNode }> = ({
  children,
  icon,
}) => (
  <div className="flex items-center">
    {icon}
    <h2 className="text-xl md:text-2xl font-bold text-gray-800">{children}</h2>
  </div>
);

const InfoRow: FC<{ label: string; value: ReactNode }> = ({ label, value }) => (
  <div className="flex justify-between items-start py-3 border-b border-gray-100 last:border-b-0">
    <dt className="text-sm font-semibold text-gray-600 w-1/3 pr-2">{label}</dt>
    <dd className="text-sm text-gray-800 text-right w-2/3 break-words">
      {value}
    </dd>
  </div>
);

const InfoList: FC<{ title: string; items: string[] }> = ({ title, items }) => (
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
const UserPlusIcon = () => (
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
    className="w-7 h-7 text-teal-500 mr-3"
  >
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <line x1="19" x2="19" y1="8" y2="14" />
    <line x1="22" x2="16" y1="11" y2="11" />
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
const MessageSquareIcon = () => (
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
    className="w-7 h-7 text-indigo-500 mr-3"
  >
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
  </svg>
);
const LoadingSpinner = () => (
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
);
const RefreshCwIcon = () => (
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
    className="h-5 w-5"
  >
    <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
    <path d="M21 3v5h-5" />
    <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
    <path d="M3 21v-5h5" />
  </svg>
);
const ChevronDownIcon = ({ className = "" }: { className?: string }) => (
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
    className={className}
  >
    <path d="m6 9 6 6 6-6"></path>
  </svg>
);

// --- NUEVOS ICONOS ---
const PlusIcon = () => (
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
    className="w-5 h-5"
  >
    <line x1="12" y1="5" x2="12" y2="19"></line>
    <line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>
);
const XIcon = () => (
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
    className="w-6 h-6"
  >
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

// --- NUEVO COMPONENTE MODAL ---
const Modal: FC<{
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  title: string;
}> = ({ isOpen, onClose, children, title }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50 p-4 transition-opacity duration-300"
      onClick={onClose} // Click en el fondo para cerrar
    >
      <div
        className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col transform transition-all duration-300 scale-100"
        onClick={(e) => e.stopPropagation()} // Evita que el click en el contenido cierre el modal
      >
        <header className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <XIcon />
          </button>
        </header>
        <div className="p-6 md:p-8 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
};

const AccordionCard: FC<{
  children: ReactNode;
  icon: ReactNode;
  title: ReactNode;
  startOpen?: boolean;
}> = ({ children, icon, title, startOpen = false }) => {
  const [isOpen, setIsOpen] = useState(startOpen);

  return (
    <Card className="overflow-hidden !p-0">
      <div className="p-6 md:p-8">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex justify-between items-center text-left"
          aria-expanded={isOpen}
        >
          <CardTitle icon={icon}>{title}</CardTitle>
          <ChevronDownIcon
            className={`w-6 h-6 text-gray-500 transition-transform duration-300 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </button>
        <div
          className={`transition-all duration-500 ease-in-out grid ${
            isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
          }`}
        >
          <div className="overflow-hidden">
            <div className="pt-4 border-t border-gray-200 mt-4">{children}</div>
          </div>
        </div>
      </div>
    </Card>
  );
};

// --- MODIFICADO: Acepta prop para abrir modal ---
const ReviewUserPage: FC<{ onOpenCreateModal: () => void }> = ({
  onOpenCreateModal,
}) => {
  const [code, setCode] = useState("");
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [allUsers, setAllUsers] = useState<UserData[]>([]);
  const [listLoading, setListLoading] = useState(true);
  const [listError, setListError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const safeJsonParse = (jsonString: any) => {
    if (typeof jsonString !== "string") return null;
    try {
      return JSON.parse(jsonString);
    } catch (e) {
      console.error("Failed to parse JSON:", e);
      return null;
    }
  };

  useEffect(() => {
    const fetchAllUsers = async () => {
      setListLoading(true);
      setListError(null);
      try {
        const response = await fetch("/api/user");
        if (!response.ok) {
          const errorData = await response
            .json()
            .catch(() => ({ message: response.statusText }));
          throw new Error(
            `Error ${response.status}: ${
              errorData.message || "No se pudieron cargar los candidatos."
            }`
          );
        }
        const data: UserData[] = await response.json();
        setAllUsers(data);
      } catch (err) {
        setListError(
          (err as Error).message ||
            "Ocurrió un error al cargar la lista de candidatos."
        );
      } finally {
        setListLoading(false);
      }
    };

    fetchAllUsers();
  }, []);

  const filteredUsers = React.useMemo(() => {
    const query = searchQuery.toLowerCase();
    if (!query) {
      return allUsers;
    }
    return allUsers.filter(
      (user) =>
        user.name.toLowerCase().includes(query) ||
        user.code.toLowerCase().includes(query) ||
        user.requirements.toLowerCase().includes(query) ||
        user.form_id.toLowerCase().includes(query)
    );
  }, [allUsers, searchQuery]);

  const handleFetchUser = async () => {
    if (!code) {
      setError("Por favor, selecciona un candidato de la lista.");
      return;
    }
    setLoading(true);
    setUserData(null);
    setError(null);
    try {
      const response = await fetch(
        `/api/user?code=${encodeURIComponent(code)}`
      );
      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ message: response.statusText }));
        throw new Error(
          `Error ${response.status}: ${
            errorData.message || "No se pudo obtener el usuario."
          }`
        );
      }
      const data = await response.json();
      setUserData({
        ...data,
        evaluation_result: safeJsonParse(data.evaluation_result),
        questions: safeJsonParse(data.questions),
        certification_result: safeJsonParse(data.certification_result),
        challenge_result: safeJsonParse(data.challenge_result),
      });
    } catch (err) {
      setError(
        (err as Error).message || "Ocurrió un error al realizar la consulta."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <header className="text-center mb-8 md:mb-12">
        {/* --- MODIFICADO: Contenedor para título y botón --- */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-3">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight">
            Portal de Revisión
          </h1>
          <button
            onClick={onOpenCreateModal}
            className="bg-teal-600 text-white font-bold px-5 py-3 rounded-lg hover:bg-teal-700 transition flex items-center gap-2 text-sm shadow-md"
          >
            <PlusIcon />
            <span className="sm:inline">Nuevo Candidato</span>
          </button>
        </div>
        <p className="mt-3 text-lg text-gray-500 max-w-2xl mx-auto">
          Busca y selecciona un candidato para ver sus resultados.
        </p>
      </header>
      <main>
        <div className="max-w-6xl mx-auto mb-8">
          <div className="flex flex-col sm:flex-row items-center gap-3 bg-white p-2 rounded-xl shadow-md border">
            <div className="w-full space-y-2">
              <input
                type="text"
                placeholder="Buscar por nombre o código..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 text-base border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition"
                aria-label="Buscar candidato"
                disabled={listLoading}
              />

              <select
                value={code}
                onChange={(e) => {
                  setCode(e.target.value);
                  setUserData(null);
                  setError(null);
                }}
                disabled={listLoading}
                className="w-full px-4 py-3 text-lg border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition disabled:bg-gray-100 disabled:cursor-not-allowed"
                aria-label="Seleccionar candidato"
              >
                {/* Tu opción de placeholder (se mantiene igual) */}
                <option value="">
                  {listLoading
                    ? "Cargando..."
                    : "-- Selecciona un candidato --"}
                </option>

                {Object.entries(
                  filteredUsers.reduce((acc: Record<string, UserData[]>, user) => {
                    const key =
                      user.requirements || "Sin Requerimiento Asignado";

                    if (!acc[key]) {
                      acc[key] = [];
                    }
                    acc[key].push(user);

                    return acc;
                  }, {})
                )
                  .sort((a, b) => a[0].localeCompare(b[0])) // Opcional: ordena los grupos alfabéticamente
                  .map(([requirement, usersInGroup]) => (
                    <optgroup key={requirement} label={requirement}>
                      {usersInGroup.map((user) => (
                        <option key={user.code} value={user.code}>
                          {user.name} [{user.requirements} {"->"} {user.form_id}
                          ]
                        </option>
                      ))}
                    </optgroup>
                  ))}
                {/* FIN DEL CAMBIO */}

                {/* Tu lógica para 'no hay resultados' (se mantiene igual) */}
                {!listLoading && filteredUsers.length === 0 && (
                  <option value="" disabled>
                    {searchQuery
                      ? "No se encontraron coincidencias."
                      : "No hay candidatos."}
                  </option>
                )}
              </select>
            </div>

            <button
              type="button"
              onClick={handleFetchUser}
              disabled={loading || listLoading || !code}
              className="w-full sm:w-auto bg-blue-600 text-white font-bold px-6 py-3 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300 disabled:cursor-not-allowed transition flex items-center justify-center"
            >
              {loading ? (
                <>
                  <LoadingSpinner /> Buscando...
                </>
              ) : (
                "Consultar"
              )}
            </button>
          </div>
        </div>

        {listError && (
          <div
            className="max-w-2xl mx-auto bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg"
            role="alert"
          >
            <p className="font-bold">Error al Cargar Lista</p>
            <p>{listError}</p>
          </div>
        )}
        {error && (
          <div
            className="max-w-2xl mx-auto bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg mt-4"
            role="alert"
          >
            <p className="font-bold">Error</p>
            <p>{error}</p>
          </div>
        )}

        {userData && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-6 max-w-6xl mx-auto">
            <div className="space-y-8">
              <UserProfileCard data={userData} />
              {userData.evaluation_result && (
                <EvaluationResultCard result={userData.evaluation_result} />
              )}
              {userData.challenge_result && (
                <InterviewFeedbackCard userData={userData} onUpdate={handleFetchUser} />
              )}
            </div>
            <div className="space-y-8">
              {userData.questions?.questions?.length && (
                <QuestionsCard
                  questionsData={userData.questions}
                  certificationResult={userData.certification_result}
                />
              )}
              {userData.certification_result && (
                <CertificationAnalysisCard
                  result={userData.certification_result}
                />
              )}
              {userData.challenge_result && (
                <ChallengeResultCard result={userData.challenge_result} />
              )}
            </div>
          </div>
        )}
      </main>
    </>
  );
};

const InterviewFeedbackCard: FC<{ userData: UserData; onUpdate: () => void }> = ({
  userData,
  onUpdate,
}) => {
  const [feedback, setFeedback] = useState(userData.interview_feedback || "");
  const [status, setStatus] = useState(userData.interview_status || "");
  const [technicalLevel, setTechnicalLevel] = useState(userData.technical_level || "");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Sincronizar estado local si userData cambia
  useEffect(() => {
    setFeedback(userData.interview_feedback || "");
    setStatus(userData.interview_status || "");
    setTechnicalLevel(userData.technical_level || "");
  }, [userData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch("/api/user/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: userData.code,
          feedback,
          status,
          technicalLevel,
        }),
      });

      if (!response.ok) throw new Error("Error al guardar el feedback");

      setMessage({ type: "success", text: "Feedback guardado correctamente" });
      onUpdate();
    } catch (err: any) {
      setMessage({ type: "error", text: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AccordionCard title="Feedback de Entrevista" icon={<MessageSquareIcon />} startOpen={!!userData.interview_feedback}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {userData.interviewer_name && (
          <div className="text-xs text-gray-400 mb-2 italic">
            Último feedback por: {userData.interviewer_name}
          </div>
        )}
        
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Feedback de la Entrevista</label>
          <textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 min-h-[120px] text-sm"
            placeholder="Escribe el feedback detallado de la entrevista técnica..."
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Estado Final</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-sm"
              required
            >
              <option value="">-- Selecciona --</option>
              <option value="pasa">✅ Pasa</option>
              <option value="no_pasa">❌ No Pasa</option>
              <option value="en_espera">⏳ En Espera</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Nivel Técnico Asignado</label>
            <select
              value={technicalLevel}
              onChange={(e) => setTechnicalLevel(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-sm"
              required
            >
              <option value="">-- Selecciona --</option>
              <option value="Junior">Junior</option>
              <option value="Junior Advanced">Junior Advanced</option>
              <option value="Semi Senior">Semi Senior</option>
              <option value="Semi Senior Advanced">Semi Senior Advanced</option>
              <option value="Senior">Senior</option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 text-white font-bold px-4 py-3 rounded-lg hover:bg-indigo-700 transition disabled:bg-indigo-300 flex justify-center items-center shadow-md active:transform active:scale-95"
        >
          {loading ? <LoadingSpinner /> : "Guardar Feedback"}
        </button>

        {message && (
          <div className={`p-3 rounded-lg text-sm text-center font-medium ${message.type === "success" ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"}`}>
            {message.text}
          </div>
        )}
      </form>
    </AccordionCard>
  );
};

const UserProfileCard: FC<{ data: UserData }> = ({ data }) => (
  <AccordionCard
    title="Información General"
    icon={<UserIcon />}
    startOpen={true}
  >
    <dl>
      <InfoRow label="Nombre" value={data.name || "N/A"} />
      <InfoRow label="Código" value={data.code || "N/A"} />
      <InfoRow label="Requisitos" value={data.requirements || "N/A"} />
      <InfoRow label="Paso Actual" value={data.step || "N/A"} />
      <InfoRow label="ID de Formulario" value={data.form_id || "N/A"} />
    </dl>

    <div className="mt-4 pt-4 border-t border-gray-100">
      <button
        onClick={() => window.open(`/login?code=${data.code}`, "_blank")}
        className="w-full flex items-center justify-center px-4 py-2 text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        Abrir Link del Candidato
        <ExternalLinkIcon />
      </button>
    </div>
  </AccordionCard>
);

const EvaluationResultCard: FC<{ result: EvaluationResult }> = ({ result }) => (
  <AccordionCard
    title="Resultados de Pre-Screening"
    icon={<CheckCircleIcon />}
    startOpen={true}
  >
    <dl>
      <InfoRow label="ID Formulario" value={result.formId || "N/A"} />
      <InfoRow
        label="Resultado"
        value={
          result.valid ? (
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
    {result.answers && (
      <div className="mt-6">
        <h4 className="font-semibold text-gray-700 mb-2">Puntajes</h4>
        <dl>
          {Object.entries(result.answers).map(([skill, score]) => (
            <InfoRow key={skill} label={skill} value={String(score)} />
          ))}
        </dl>
      </div>
    )}
    {result.gaps?.length > 0 && (
      <>
        <div className="mt-6">
          <h4 className="font-semibold text-gray-700 mb-2">Brechas</h4>
          <dl>
            {result.gaps.map((gap, index) => (
              <InfoRow
                key={index}
                label={gap.skill}
                value={`Evaluado: ${gap.got} / ${gap.required}`}
              />
            ))}
          </dl>
        </div>
        <div className="mt-6">
          <h4 className="font-semibold text-gray-700 mb-4">Análisis Gráfico</h4>
          <div className="w-full h-64 md:h-80">
            <GapAnalysisRechart gaps={result.gaps} />
          </div>
        </div>
      </>
    )}
  </AccordionCard>
);

const CertificationAnalysisCard: FC<{ result: CertificationResult }> = ({
  result,
}) => (
  <AccordionCard
    title="Análisis de Certificación"
    icon={<TargetIcon />}
    startOpen={true}
  >
    <div className="text-center mb-4">
      <p className="text-lg text-gray-600">Resultado</p>
      <p className="text-4xl font-bold text-blue-600">
        {result.score} / {result.total}
      </p>
    </div>
    <h4 className="font-semibold text-gray-700 mb-2">Análisis Detallado:</h4>
    <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-md border">
      {result.analysis || "No hay análisis disponible."}
    </p>
  </AccordionCard>
);

const QuestionsCard: FC<{
  questionsData: { questions: Question[] };
  certificationResult?: CertificationResult;
}> = ({ questionsData, certificationResult }) => (
  <AccordionCard title="Preguntas de Certificación" icon={<HelpCircleIcon />}>
    <div className="space-y-4">
      {questionsData.questions.map((q) => {
        const res = certificationResult?.details.find(
          (data) => data.questionId === q.id
        );
        return (
          <div key={q.id} className="p-3 bg-gray-50 rounded-lg border">
            <p className="font-medium text-gray-800">{q.question}</p>
            {res &&
              (res.correct ? (
                <p className="text-sm text-green-700 mt-1">
                  Respuesta Correcta:{" "}
                  <span className="pl-2 font-semibold">
                    ✔️ {q.correctAnswer}
                  </span>
                </p>
              ) : (
                <p className="text-sm text-red-700 mt-1">
                  Respuesta Incorrecta:{" "}
                  <span className="pl-2 font-semibold">❌ {res.chosen}</span> |{" "}
                  <span className="text-green-700">✔️ {q.correctAnswer}</span>
                </p>
              ))}
          </div>
        );
      })}
    </div>
  </AccordionCard>
);

const ChallengeResultCard: FC<{ result: ChallengeResult }> = ({ result }) => (
  <AccordionCard
    title="Pregunta Desafiante"
    icon={<TargetIcon />}
    startOpen={true}
  >
    <div>
      <h3 className="font-bold text-lg text-gray-800 mb-2">{result.title}</h3>
      <p className="text-sm text-gray-600 mb-4 border-l-2 border-blue-500 pl-3 italic">
        {result.description}
      </p>
      {result.coverages?.length > 0 && (
        <InfoList title="Coberturas:" items={result.coverages} />
      )}
      {result.evaluationCriteria?.length > 0 && (
        <InfoList
          title="Criterios del Reto:"
          items={result.evaluationCriteria}
        />
      )}
      {result.coverageQuestions?.length > 0 && (
        <InfoList title="Preguntas Base:" items={result.coverageQuestions} />
      )}
    </div>
  </AccordionCard>
);

const TagSelector: FC<{
  label: string;
  options: readonly string[];
  selected: string;
  onToggle: (option: string) => void;
}> = ({ label, options, selected, onToggle }) => {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        {label}
      </label>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const isSelected = selected === option;
          return (
            <button
              type="button"
              key={option}
              onClick={() => onToggle(option)}
              className={`px-4 py-2 text-sm font-medium rounded-full border transition-all duration-200 ${
                isSelected
                  ? "bg-blue-600 text-white border-blue-600 shadow"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
              }`}
            >
              {option}
            </button>
          );
        })}
      </div>
    </div>
  );
};

// --- MODIFICADO: Removido el header y main ---
const CreateUserPage: FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [selectedRequirements, setSelectedRequirements] = useState<string>("");
  const [step, setStep] = useState("pre-screening");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<{
    message: string;
    code: string;
  } | null>(null);

  const generateCode = () => {
    const newCode = Math.random().toString(16).substring(2, 10).toUpperCase();
    setCode(newCode);
  };

  useEffect(() => {
    generateCode();
  }, []);

  const handleRequirementToggle = (req: string) => {
    setSelectedRequirements(req);
  };

  const handleCreateUser = async (e: FormEvent) => {
    e.preventDefault();
    if (!name || !code) {
      setError("El nombre y el código son obligatorios.");
      return;
    }
    if (!selectedRequirements) {
      setError("Debes seleccionar el requisito.");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    const requirements = selectedRequirements.split(":")[0].toLocaleLowerCase();
    const form_id = selectedRequirements.split(":")[1].toLocaleLowerCase();

    const payload = {
      name,
      email,
      code,
      step,
      requirements: requirements,
      form_id: form_id,
    };

    try {
      const response = await fetch("/api/user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ message: response.statusText }));
        throw new Error(
          `Error ${response.status}: ${
            errorData.message || "No se pudo crear el usuario."
          }`
        );
      }

      setSuccess({
        message: `El usuario "${name}" ha sido creado exitosamente con el código ${code}. Por favor, envía este código al candidato para que pueda realizar la prueba.`,
        code: code,
      });

      setName("");
      setEmail("");
      setSelectedRequirements("");
      setStep("pre-screening");
      generateCode();
    } catch (err) {
      setError(
        (err as Error).message || "Ocurrió un error al crear el usuario."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Card>
        <CardTitle icon={<UserPlusIcon />}>Datos del Candidato</CardTitle>
        <form onSubmit={handleCreateUser} className="space-y-6 mt-4">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-semibold text-gray-700 mb-1"
            >
              Nombre Completo
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 text-base border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-semibold text-gray-700 mb-1"
            >
              Correo Electrónico
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 text-base border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <div>
            <label
              htmlFor="code"
              className="block text-sm font-semibold text-gray-700 mb-1"
            >
              Código Único (Generado)
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                id="code"
                value={code}
                readOnly
                className="w-full px-4 py-2 text-base border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
              />
              <button
                type="button"
                onClick={generateCode}
                className="p-2 text-gray-600 hover:text-blue-600 bg-white border border-gray-300 rounded-lg"
                title="Generar nuevo código"
              >
                <RefreshCwIcon />
              </button>
            </div>
          </div>
          <TagSelector
            label="Requisitos"
            options={ALL_REQUIREMENTS}
            selected={selectedRequirements}
            onToggle={handleRequirementToggle}
          />
          <div>
            <label
              htmlFor="step"
              className="block text-sm font-semibold text-gray-700 mb-1"
            >
              Paso Actual
            </label>
            <input
              type="text"
              id="step"
              value={step}
              onChange={(e) => setStep(e.target.value)}
              className="w-full px-4 py-2 text-base border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-teal-600 text-white font-bold px-6 py-3 rounded-lg hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:bg-teal-300 disabled:cursor-not-allowed transition flex items-center justify-center text-lg"
          >
            {loading ? (
              <>
                <LoadingSpinner /> Creando...
              </>
            ) : (
              "Crear Candidato"
            )}
          </button>
        </form>
      </Card>

      {error && (
        <div
          className="mt-6 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg"
          role="alert"
        >
          <p className="font-bold">Error</p>
          <p>{error}</p>
        </div>
      )}

      {success && (
        <div
          className="mt-6 bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded-lg"
          role="alert"
        >
          <p className="font-bold">Éxito</p>
          <p>{success.message}</p>
          <button
            onClick={() => window.open(`/login?code=${success.code}`, "_blank")}
            className="mt-3 inline-flex items-center px-3 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            Abrir Link del Candidato
            <ExternalLinkIcon />
          </button>
        </div>
      )}
    </>
  );
};

// --- MODIFICADO: Gestiona el estado del modal ---
export default function App() {
  const { status } = useSession();
  const router = useRouter();

  // Estado para controlar la visibilidad del modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  useEffect(() => {
    console.log("Auth status:", status);
    if (status === "unauthenticated") {
      router.push("/admin/sign-in");
    }
  }, [status, router]);

  if (status === "loading" || status === "unauthenticated") {
    return <div className="bg-gray-50 min-h-screen"></div>;
  }

  return (
    <div className="bg-gray-50 min-h-screen font-sans text-gray-800">
      <div className="container mx-auto px-4 py-8 md:py-12">
        {/* Removido el grid de 2 columnas */}
        <div>
          <ReviewUserPage onOpenCreateModal={openModal} />
        </div>
      </div>

      {/* Renderiza el Modal fuera del layout principal */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title="Crear Nuevo Candidato"
      >
        <CreateUserPage />
      </Modal>
    </div>
  );
}
