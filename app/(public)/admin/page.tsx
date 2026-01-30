"use client";

import React, {
  useEffect,
  useState,
  FormEvent,
  FC,
  ReactNode,
  useMemo,
  useCallback,
} from "react";
import Markdown from 'react-markdown'
import { GapAnalysisRechart } from "@/components/GapAnalysisChart";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import AdminFormsView from "@/components/admin/AdminFormsView";
import FormPreview from "@/components/admin/FormPreview";
import { groupCandidatesByCode, GroupedCandidate, User as AdminUser, isCandidateRejected } from "@/lib/adminUtils";

// --- 1. CONSTANTS & TYPES ---

const ALL_REQUIREMENTS = [
  "pichincha-sr:angular-frontend",
  "pichincha-ssr:angular-frontend",
  "pichincha-sr:react-native-frontend",
  "pichincha-ssr:react-native-frontend",
  "pichincha-sr:springboot-backend",
  "pichincha-ssr:springboot-backend",
  "pichincha-sr:dotnet-backend",
  "pichincha-ssr:dotnet-backend",
  "pichincha-ssr:reactjs-frontend",
  "pichincha-sr:reactjs-frontend",
  "visa-guayaquil-jr:dotnet-fullstack",
  "visa-guayaquil-jr:springboot-fullstack",
  "visa-guayaquil-ssr:dotnet-fullstack",
  "visa-guayaquil-ssr:springboot-fullstack",
] as const;

type AdminView = "candidates" | "forms";
type CandidateStatusFilter = "all" | "in-progress" | "rejected";
type CandidateStepFilter = "all" | "pre-screening" | "technical" | "interview";

interface EvaluationGap {
  skill: string;
  got: number;
  required: number;
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

type UserData = AdminUser;


const useCandidate = () => {
  const [data, setData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCandidate = useCallback(async (code: string, requirements?: string) => {
    if (!code) return;
    setLoading(true);
    setError(null);
    setData(null);
    try {
      let url = `/api/user?code=${encodeURIComponent(code)}`;
      if (requirements) {
        url += `&requirements=${encodeURIComponent(requirements)}`;
      }
      const res = await fetch(url);
      if (!res.ok) throw new Error("No se pudo cargar el candidato");
      const rawData = await res.json();

      const parse = (str: any) => (typeof str === 'string' ? JSON.parse(str) : str);

      setData({
        ...rawData,
        evaluation_result: parse(rawData.evaluation_result),
        questions: parse(rawData.questions),
        certification_result: parse(rawData.certification_result),
        challenge_result: parse(rawData.challenge_result),
      });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  return { data, loading, error, fetchCandidate, setData };
};

const useUserList = () => {
  const [users, setUsers] = useState<GroupedCandidate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/user")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          const grouped = groupCandidatesByCode(data);
          setUsers(grouped);
        } else {
          setUsers([]);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return { users, loading };
};

// --- 2. UI LIBRARY (ATOMIC COMPONENTS) ---

const Icons = {
  ExternalLink: (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>,
  User: (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>,
  Check: (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>,
  X: (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>,
  ChevronDown: (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"></path></svg>,
  Copy: (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>,
  Sparkles: (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" /></svg>,
  MessageSquare: (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>,
  Target: (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="6"></circle><circle cx="12" cy="12" r="2"></circle></svg>,
  Search: (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>,
  Plus: (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>,
};

const Spinner = ({ size = "sm" }: { size?: "sm" | "md" }) => (
  <div className={`animate-spin rounded-full border-2 border-current border-t-transparent ${size === "sm" ? "h-4 w-4" : "h-6 w-6"}`} />
);

const Badge: FC<{ children: ReactNode; variant?: "success" | "danger" | "warning" | "neutral" }> = ({ children, variant = "neutral" }) => {
  const colors = {
    success: "bg-green-100 text-green-800",
    danger: "bg-red-100 text-red-800",
    warning: "bg-yellow-100 text-yellow-800",
    neutral: "bg-gray-100 text-gray-800",
  };
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${colors[variant]}`}>
      {children}
    </span>
  );
};

const Card: FC<{ children: ReactNode; className?: string; title?: ReactNode; icon?: ReactNode; action?: ReactNode }> = ({ children, className = "", title, icon, action }) => (
  <div className={`bg-white shadow-sm rounded-xl border border-gray-200 overflow-hidden ${className}`}>
    {(title || icon) && (
      <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
        <div className="flex items-center gap-3">
          {icon && <span className="text-gray-500">{icon}</span>}
          {title && <h3 className="font-bold text-gray-800 text-lg">{title}</h3>}
        </div>
        {action && <div>{action}</div>}
      </div>
    )}
    <div className="p-6">{children}</div>
  </div>
);

const Modal: FC<{ isOpen: boolean; onClose: () => void; children: ReactNode; title: string }> = ({ isOpen, onClose, children, title }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <header className="flex justify-between items-center px-6 py-4 border-b border-gray-100 bg-gray-50">
          <h2 className="text-xl font-bold text-gray-800">{title}</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-200 rounded-full transition"><Icons.X className="w-5 h-5 text-gray-500" /></button>
        </header>
        <div className="p-6 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
};

const Tabs: FC<{ tabs: { id: string; label: string; icon?: ReactNode }[]; activeTab: string; onChange: (id: string) => void }> = ({ tabs, activeTab, onChange }) => (
  <div className="flex gap-2 border-b border-gray-200 mb-6 overflow-x-auto pb-1">
    {tabs.map((tab) => (
      <button
        key={tab.id}
        onClick={() => onChange(tab.id)}
        className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-t-lg border-b-2 transition-colors whitespace-nowrap ${activeTab === tab.id
          ? "border-blue-600 text-blue-700 bg-blue-50/50"
          : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
          }`}
      >
        {tab.icon}
        {tab.label}
      </button>
    ))}
  </div>
);



// --- 4. SUB-COMPONENTS ---

const InfoRow: FC<{ label: string; value: ReactNode; copyable?: boolean }> = ({ label, value, copyable }) => {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    if (typeof value === 'string') {
      navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="flex justify-between items-center py-3 border-b border-gray-100 last:border-0">
      <dt className="text-sm font-medium text-gray-500">{label}</dt>
      <dd className="text-sm font-semibold text-gray-900 flex items-center gap-2">
        {value}
        {copyable && typeof value === 'string' && (
          <button onClick={handleCopy} className="text-gray-400 hover:text-blue-600 transition" title="Copiar">
            {copied ? <Icons.Check className="w-4 h-4 text-green-500" /> : <Icons.Copy className="w-4 h-4" />}
          </button>
        )}
      </dd>
    </div>
  );
};

const CandidateHeader: FC<{ user: UserData }> = ({ user }) => (
  <div className="top-0 z-30  m-4 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4">
    <div className="flex items-center gap-4">
      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xl shadow-lg">
        {user.name.charAt(0)}
      </div>
      <div>
        <h1 className="text-xl font-bold text-gray-900">{user.name}</h1>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Icons.Target className="w-4 h-4" />
          {user.requirements}
          <span className="text-gray-300">|</span>
          <span className="font-mono bg-gray-100 px-2 py-0.5 rounded text-xs">{user.code}</span>
        </div>
      </div>
    </div>
    <div className="flex gap-3">
      <a
        href={`/login?code=${user.code}`}
        target="_blank"
        rel="noreferrer"
        className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition"
      >
        <Icons.ExternalLink className="w-4 h-4" /> Link Candidato
      </a>
    </div>
  </div>
);

// --- 5. PAGE LOGIC (MAIN COMPONENT) ---

export default function App() {
  const { status } = useSession();
  const router = useRouter();

  // Hooks
  const { users } = useUserList();
  const { data: userData, loading: userLoading, error: userError, fetchCandidate } = useCandidate();

  // State
  const [selectedCode, setSelectedCode] = useState("");
  const [selectedGroupedCandidate, setSelectedGroupedCandidate] = useState<GroupedCandidate | null>(null);
  const [selectedProfileIndex, setSelectedProfileIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  const [searchQuery, setSearchQuery] = useState("");
  const [view, setView] = useState<AdminView>("candidates");
  const [selectedFormId, setSelectedFormId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<CandidateStatusFilter>("all");
  const [stepFilter, setStepFilter] = useState<CandidateStepFilter>("technical");

  // Auth Guard
  useEffect(() => {
    if (status === "unauthenticated") router.push("/admin/sign-in");
  }, [status, router]);

  // Derived State
  const filteredUsers = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return users.filter(u => {
      const matchesSearch = u.name.toLowerCase().includes(q) || u.code.toLowerCase().includes(q);
      const isRejected = isCandidateRejected(u);

      let matchesStatus = true;
      if (statusFilter === "in-progress") matchesStatus = !isRejected;
      else if (statusFilter === "rejected") matchesStatus = isRejected;

      if (!matchesStatus || !matchesSearch) return false;

      // Step filtering (only relevant for In-Process or All)
      if (statusFilter !== "rejected" && stepFilter !== "all") {
        return u.profiles.some(p => p.step === stepFilter);
      }

      return true;
    });
  }, [users, searchQuery, statusFilter, stepFilter]);

  const handleSearch = () => {
    const group = users.find(u => u.code === selectedCode);
    if (group) {
      setSelectedGroupedCandidate(group);
      setSelectedProfileIndex(0);
      // Fetch the first profile's data
      const firstProfile = group.profiles[0];
      if (firstProfile) {
        fetchCandidate(firstProfile.code, firstProfile.requirements);
      }
    }
  };

  const handleProfileSwitch = (index: number) => {
    if (selectedGroupedCandidate && selectedGroupedCandidate.profiles[index]) {
      setSelectedProfileIndex(index);
      const profile = selectedGroupedCandidate.profiles[index];
      fetchCandidate(profile.code, profile.requirements);
      setActiveTab("profile"); // Reset to profile tab when switching
    }
  };

  const statusCounts = useMemo(() => {
    const initial = {
      all: 0,
      inProgress: 0,
      rejected: 0,
      steps: {
        "pre-screening": 0,
        technical: 0,
        interview: 0,
      },
    };

    return users.reduce((acc, u) => {
      const isRejected = isCandidateRejected(u);
      if (isRejected) {
        acc.rejected++;
      } else {
        acc.inProgress++;
        // Count unique steps per active candidate
        const steps = new Set(u.profiles.map((p) => p.step));
        if (steps.has("pre-screening")) acc.steps["pre-screening"]++;
        if (steps.has("technical")) acc.steps.technical++;
        if (steps.has("interview")) acc.steps.interview++;
      }
      acc.all++;
      return acc;
    }, initial);
  }, [users]);

  if (status === "loading") return <div className="min-h-screen bg-gray-50 flex items-center justify-center"><Spinner size="md" /></div>;
  console.log(userData);
  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* --- VIEW TOGGLE --- */}
        <div className="flex bg-white p-1 rounded-xl shadow-sm border border-gray-200 mb-8 w-fit">
          <button
            onClick={() => { setView("candidates"); setSelectedFormId(null); }}
            className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${view === "candidates" ? "bg-blue-600 text-white shadow-md" : "text-gray-500 hover:text-blue-600"}`}
          >
            Candidatos
          </button>
          <button
            onClick={() => setView("forms")}
            className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${view === "forms" ? "bg-blue-600 text-white shadow-md" : "text-gray-500 hover:text-blue-600"}`}
          >
            Formularios
          </button>
        </div>

        {/* --- STATUS FILTER --- */}
        {view === "candidates" && (
          <div className="flex gap-4 mb-6 overflow-x-auto pb-2">
            {[
              { id: "all", label: "Todos", count: statusCounts.all, color: "bg-gray-100 text-gray-700" },
              { id: "in-progress", label: "En Proceso", count: statusCounts.inProgress, color: "bg-blue-100 text-blue-700" },
              { id: "rejected", label: "Rechazados", count: statusCounts.rejected, color: "bg-red-100 text-red-700" },
            ].map((filter) => (
              <button
                key={filter.id}
                onClick={() => {
                  setStatusFilter(filter.id as CandidateStatusFilter);
                  if (filter.id === "in-progress") setStepFilter("technical");
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all border-2 whitespace-nowrap ${statusFilter === filter.id
                  ? "border-blue-600 ring-2 ring-blue-100 bg-white"
                  : "border-transparent bg-white hover:border-gray-200 text-gray-500"
                  }`}
              >
                {filter.label}
                <span className={`px-2 py-0.5 rounded-full text-[10px] ${filter.color}`}>
                  {filter.count}
                </span>
              </button>
            ))}
          </div>
        )}

        {/* --- STEP FILTER (TAGS) --- */}
        {view === "candidates" && statusFilter === "in-progress" && (
          <div className="flex gap-2 mb-8 items-center bg-blue-50/50 p-3 rounded-2xl border border-blue-100/50 w-fit">
            <span className="text-xs font-bold text-blue-600 px-2 uppercase tracking-wider">Etapa:</span>
            {[
              { id: "all", label: "Todos", count: statusCounts.inProgress },
              { id: "pre-screening", label: "Pre-Screening", count: statusCounts.steps["pre-screening"] },
              { id: "technical", label: "Validación Técnica", count: statusCounts.steps.technical },
              { id: "interview", label: "Entrevista", count: statusCounts.steps.interview },
            ].map((tag) => (
              <button
                key={tag.id}
                onClick={() => setStepFilter(tag.id as CandidateStepFilter)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-2 ${stepFilter === tag.id
                  ? "bg-blue-600 text-white shadow-sm scale-105"
                  : "bg-white text-gray-500 border border-gray-200 hover:border-blue-400 hover:text-blue-600"
                  }`}
              >
                {tag.label}
                <span className={`opacity-70 ${stepFilter === tag.id ? "text-white" : "text-blue-600"}`}>
                  {tag.count}
                </span>
              </button>
            ))}
          </div>
        )}

        {/* --- TOP BAR: SEARCH & ACTIONS --- */}
        {view === "candidates" && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex-1 w-full flex flex-col md:flex-row gap-3">
              <div className="relative flex-1">
                <Icons.Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition outline-none"
                  placeholder="Filtrar candidatos..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <select
                value={selectedCode}
                onChange={(e) => setSelectedCode(e.target.value)}
                className="flex-[2] py-2.5 px-4 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="">-- Seleccionar Candidato --</option>
                {filteredUsers.map((group, i) => (
                  <option key={group.code + i} value={group.code} style={{ textTransform: 'uppercase' }}>
                    {group.name.toUpperCase()} ({group.profiles.length} PERFILES)
                  </option>
                ))}
              </select>
              <button
                onClick={handleSearch}
                disabled={userLoading || !selectedCode}
                className="bg-blue-600 text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-md hover:shadow-lg flex items-center justify-center gap-2"
              >
                {userLoading ? <Spinner /> : "Consultar"}
              </button>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-teal-600 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-teal-700 transition flex items-center gap-2 shadow-md hover:shadow-lg whitespace-nowrap w-full md:w-auto justify-center"
            >
              <Icons.Plus className="w-5 h-5" /> Nuevo Candidato
            </button>
          </div>
        )}

        {/* --- MAIN CONTENT --- */}
        {view === "candidates" && (
          <>
            {/* --- ERROR STATE --- */}
            {userError && (
              <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl mb-6 flex items-center gap-3">
                <Icons.X className="w-5 h-5" />
                {userError}
              </div>
            )}

            {/* --- EMPTY STATE --- */}
            {!userData && !userLoading && !userError && (
              <div className="text-center py-20 text-gray-400">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icons.Search className="w-10 h-10 opacity-50" />
                </div>
                <p className="text-lg font-medium">Selecciona un candidato para comenzar la revisión.</p>
              </div>
            )}

            {/* --- MAIN CONTENT --- */}
            {userData && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">

                {/* --- PROFILE TABS (if multiple profiles) --- */}
                {selectedGroupedCandidate && selectedGroupedCandidate.profiles.length > 1 && (
                  <div className="mb-6 bg-white rounded-xl border border-gray-200 p-4">
                    <h4 className="text-sm font-semibold text-gray-700 mb-3">Perfiles del Candidato:</h4>
                    <div className="flex gap-2 flex-wrap">
                      {selectedGroupedCandidate.profiles.map((profile, index) => (
                        <button
                          key={`${profile.code}-${profile.requirements}-${index}`}
                          onClick={() => handleProfileSwitch(index)}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${selectedProfileIndex === index
                            ? "bg-blue-600 text-white shadow-md"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            }`}
                        >
                          <div className="flex flex-col items-start">
                            <span className="font-bold">{profile.requirements.toUpperCase().replace('-', ' ')}</span>
                            <span className="text-xs opacity-75">{profile.form_id.replace('-', ' ')}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                <div className="mb-6 bg-white rounded-xl border border-gray-200">
                  <CandidateHeader user={userData} />
                </div>
                <Tabs
                  activeTab={activeTab}
                  onChange={setActiveTab}
                  tabs={[
                    { id: "profile", label: "Perfil & Pre-Screening", icon: <Icons.User className="w-4 h-4" /> },
                    ...(userData.certification_result || userData.challenge_result ? [
                      { id: "technical", label: "Validación Técnica", icon: <Icons.Target className="w-4 h-4" /> }
                    ] : []),
                    { id: "interview", label: "Entrevista & Feedback", icon: <Icons.MessageSquare className="w-4 h-4" /> }
                  ]}
                />

                <div className="grid grid-cols-1 gap-8">
                  {/* TAB 1: PROFILE */}
                  {activeTab === "profile" && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <Card title="Datos Generales" icon={<Icons.User className="w-5 h-5" />}>
                        <dl className="space-y-1">
                          <InfoRow label="Nombre" value={userData.name} />
                          <InfoRow label="Email" value={userData.email || "N/A"} />
                          <InfoRow label="Código" value={userData.code} copyable />
                          <InfoRow label="Requisito" value={<Badge>{userData.requirements}</Badge>} />
                          <InfoRow label="Etapa" value={userData.step} />
                        </dl>
                      </Card>

                      {userData.evaluation_result && (
                        <Card title="Resultados Screening" icon={<Icons.Target className="w-5 h-5" />}>
                          <div className="mb-4 flex justify-between items-center">
                            <span className="text-sm text-gray-500">Estado:</span>
                            {userData.evaluation_result.valid ? <Badge variant="success">Aprobado</Badge> : <Badge variant="danger">Rechazado</Badge>}
                          </div>
                          {userData.evaluation_result.gaps?.length > 0 && (
                            <div className="h-64 mt-4">
                              <GapAnalysisRechart gaps={userData.evaluation_result.gaps} />
                            </div>
                          )}
                        </Card>
                      )}
                    </div>
                  )}

                  {/* TAB 2: TECHNICAL */}
                  {activeTab === "technical" && (
                    <div className="space-y-8">
                      {userData.certification_result && (
                        <CertificationAnalysisCard
                          result={userData.certification_result}
                          gaps={userData.evaluation_result.gaps}
                          questionsData={userData.questions}
                        />
                      )}

                      {userData.challenge_result && (
                        <ChallengeResultCard
                          challenge={userData.challenge_result}
                          certificationResult={userData.certification_result}
                        />
                      )}
                    </div>
                  )}

                  {/* TAB 3: INTERVIEW */}
                  {activeTab === "interview" && (
                    <InterviewFeedbackCard
                      userData={userData}
                      onUpdate={() => fetchCandidate(userData.code)}
                      challenge={userData.challenge_result}
                    />
                  )}
                </div>
              </div>
            )}
          </>
        )}

        {view === "forms" && (
          <div className="animate-in fade-in duration-500">
            {selectedFormId ? (
              <FormPreview
                formId={selectedFormId}
                onBack={() => setSelectedFormId(null)}
              />
            ) : (
              <AdminFormsView onSelectForm={(id) => setSelectedFormId(id)} />
            )}
          </div>
        )}
      </div>

      {/* --- ADD CANDIDATE MODAL --- */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Crear Nuevo Candidato">
        <CreateUserForm onClose={() => setIsModalOpen(false)} />
      </Modal>
    </div>
  );
};

// --- 6. FEATURE COMPONENTS (Extracted for cleaner Main Page) ---

const CreateUserForm: FC<{ onClose: () => void }> = ({ onClose }) => {
  const [formData, setFormData] = useState({ name: "", email: "" });
  const [selectedReqs, setSelectedReqs] = useState<string[]>([]);
  const [code] = useState(() => Math.random().toString(16).substring(2, 10).toUpperCase());
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [profileSearch, setProfileSearch] = useState("");

  const toggleReq = (req: string) => {
    if (selectedReqs.includes(req)) {
      setSelectedReqs(selectedReqs.filter(r => r !== req));
    } else {
      setSelectedReqs([...selectedReqs, req]);
    }
  };

  const filteredRequirements = useMemo(() => {
    return ALL_REQUIREMENTS.filter(req =>
      req.toLowerCase().includes(profileSearch.toLowerCase())
    );
  }, [profileSearch]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (selectedReqs.length === 0) return alert("Selecciona al menos un perfil");

    setLoading(true);

    try {
      // Loop through all selected requirements and create a profile for each
      const promises = selectedReqs.map(reqString => {
        const [req, formId] = reqString.split(":");
        return fetch("/api/user", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...formData,
            code, // Same code for all
            step: "pre-screening",
            requirements: req.toLowerCase(),
            form_id: formId.toLowerCase()
          })
        });
      });

      const results = await Promise.all(promises);
      const errors = results.filter(r => !r.ok);

      if (errors.length > 0) {
        throw new Error(`Fallaron ${errors.length} peticiones de ${selectedReqs.length}`);
      }

      setSuccess(code);
    } catch (e: any) {
      alert("Error al crear candidato: " + e.message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Icons.Check className="w-8 h-8 text-green-600" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">¡Candidato Creado!</h3>
        <p className="text-gray-500 mb-6">Comparte este código con el candidato:</p>
        <div className="bg-gray-100 p-4 rounded-xl font-mono text-2xl font-bold tracking-wider mb-6 select-all">
          {success}
        </div>
        <div className="text-sm text-gray-500 mb-6">
          Perfiles asignados: {selectedReqs.join(", ")}
        </div>
        <button onClick={onClose} className="w-full bg-gray-900 text-white py-3 rounded-xl font-bold">Cerrar</button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
        <input required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
          value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
        <input required type="email" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
          value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Perfiles Técnicos</label>
        <div className="relative mb-3">
          <Icons.Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Buscar perfil (ej: angular, sr, backend)..."
            className="w-full pl-9 pr-4 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-teal-500 outline-none bg-gray-50"
            value={profileSearch}
            onChange={(e) => setProfileSearch(e.target.value)}
          />
        </div>
        <div className="grid grid-cols-1 gap-2 max-h-60 overflow-y-auto pr-1">
          {filteredRequirements.map(req => {
            const isSelected = selectedReqs.includes(req);
            return (
              <button type="button" key={req} onClick={() => toggleReq(req)}
                className={`px-4 py-3 rounded-lg border text-left text-sm font-medium transition flex justify-between items-center ${isSelected ? "border-teal-500 bg-teal-50 text-teal-700 ring-1 ring-teal-500" : "border-gray-200 hover:bg-gray-50"}`}>
                <span>{req.toUpperCase().replaceAll("-", " ").replace(":", " => ")}</span>
                {isSelected && <Icons.Check className="w-4 h-4 text-teal-600" />}
              </button>
            );
          })}
          {filteredRequirements.length === 0 && (
            <p className="text-center text-gray-400 py-4 text-sm italic">No se encontraron perfiles</p>
          )}
        </div>
        <p className="text-xs text-gray-500 mt-2 text-right">
          {selectedReqs.length} perfiles seleccionados
        </p>
      </div>
      <div className="pt-4">
        <button disabled={loading} className="w-full bg-teal-600 text-white py-3 rounded-xl font-bold hover:bg-teal-700 transition flex justify-center">
          {loading ? <Spinner /> : "Crear Candidato (Multi-Perfil)"}
        </button>
      </div>
    </form>
  );
};

// --- 4. SUB-COMPONENTS ---
// ... (Previous sub-components like InfoRow, CandidateHeader can stay, but I'll redefine them to be sure or just assume they are there if I don't touch them. Wait, I am replacing from line 561? No, I should replace large chunks to ensure everything is back).

// Let's redefine the missing types first
type InterviewQuestion = {
  id: string;
  text: string;
  guide: string;
};

type InterviewSection = {
  id: string;
  topic: string;
  questions: InterviewQuestion[];
};

type InterviewPlan = {
  sections: InterviewSection[];
};

// ... Restoring InterviewWizard ...
const InterviewWizard: FC<{
  plan: InterviewPlan;
  onClose: () => void;
  onSave: (history: any[]) => void;
}> = ({ plan, onClose, onSave }) => {
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [history, setHistory] = useState<any[]>([]);

  const currentSection = plan.sections[currentSectionIndex];
  const currentQuestion = currentSection?.questions[currentQuestionIndex];

  // Helper to finish interview
  const finishInterview = (finalHistory: any[]) => {
    onSave(finalHistory);
  };

  const handleDecision = (correct: boolean) => {
    if (!currentSection || !currentQuestion) return;

    // 1. Record Result
    const stepRecord = {
      section: currentSection.topic,
      questionId: currentQuestion.id,
      question: currentQuestion.text,
      guide: currentQuestion.guide,
      result: correct ? "Correcto" : "Incorrecto",
      timestamp: new Date().toISOString(),
    };

    const newHistory = [...history, stepRecord];
    setHistory(newHistory);

    // 2. Logic Flow
    if (correct) {
      // If Correct -> Next Question in SAME Section
      const nextQIndex = currentQuestionIndex + 1;
      if (nextQIndex < currentSection.questions.length) {
        setCurrentQuestionIndex(nextQIndex);
      } else {
        // Section Completed (All Correct or Mixed) -> Next Section
        const nextSectionIndex = currentSectionIndex + 1;
        if (nextSectionIndex < plan.sections.length) {
          setCurrentSectionIndex(nextSectionIndex);
          setCurrentQuestionIndex(0);
        } else {
          finishInterview(newHistory);
        }
      }
    } else {
      // If Incorrect -> Skip rest of section -> Next Section directly
      const nextSectionIndex = currentSectionIndex + 1;
      if (nextSectionIndex < plan.sections.length) {
        setCurrentSectionIndex(nextSectionIndex);
        setCurrentQuestionIndex(0);
      } else {
        finishInterview(newHistory);
      }
    }
  };

  if (!currentSection || !currentQuestion) {
    return null; // Should trigger onSave/Close before this renders
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b bg-gray-50">
          <div>
            <h2 className="text-xl font-bold text-gray-800">Modo Entrevista Interactiva</h2>
            <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
              <span className="font-semibold text-indigo-600 uppercase tracking-wider">{currentSection.topic}</span>
              <span>•</span>
              <span>Pregunta {currentQuestionIndex + 1} de {currentSection.questions.length}</span>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition">
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-8 flex-1 overflow-y-auto">
          {/* Progress Bar within Section */}
          <div className="w-full bg-gray-200 rounded-full h-1.5 mb-6">
            <div
              className="bg-indigo-600 h-1.5 rounded-full transition-all duration-300"
              style={{ width: `${((currentQuestionIndex + 1) / currentSection.questions.length) * 100}%` }}
            ></div>
          </div>

          <div className="mb-8">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
              Pregunta Actual
            </h3>
            <p className="text-2xl font-medium text-gray-900 leading-snug">
              {currentQuestion.text}
            </p>
          </div>

          <div className="bg-indigo-50 p-5 rounded-xl border border-indigo-100">
            <h4 className="text-xs font-bold text-indigo-800 uppercase mb-2">Guía para el Entrevistador</h4>
            <p className="text-sm text-indigo-900 leading-relaxed">{currentQuestion.guide}</p>
          </div>
        </div>

        {/* Footer / Controls */}
        <div className="p-6 border-t bg-gray-50 flex gap-4">
          <button
            onClick={() => handleDecision(false)}
            className="flex-1 py-4 bg-white border-2 border-red-100 hover:border-red-400 hover:bg-red-50 text-red-700 font-bold rounded-xl transition flex flex-col items-center gap-1 group shadow-sm hover:shadow-md"
          >
            <span className="text-2xl mb-1">❌</span>
            <span className="text-sm">Incorrecto / No Sabe</span>
            <span className="text-xs text-red-400 font-normal group-hover:text-red-600">(Salta al siguiente tema)</span>
          </button>

          <button
            onClick={() => handleDecision(true)}
            className="flex-1 py-4 bg-white border-2 border-green-100 hover:border-green-400 hover:bg-green-50 text-green-700 font-bold rounded-xl transition flex flex-col items-center gap-1 group shadow-sm hover:shadow-md"
          >
            <span className="text-2xl mb-1">✅</span>
            <span className="text-sm">Correcto / Satisfactorio</span>
            <span className="text-xs text-green-400 font-normal group-hover:text-green-600">(Profundizar en tema)</span>
          </button>
        </div>
      </div>
    </div>
  );
};


// ... Restoring CertificationAnalysisCard ...
const CertificationAnalysisCard: FC<{
  result: CertificationResult;
  gaps: EvaluationGap[];
  questionsData?: { questions: Question[] };
}> = ({ result, gaps, questionsData }) => {
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  const handleAnalyze = async () => {
    setAnalyzing(true);
    try {
      const response = await fetch("/api/certification/analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ result: { ...result, gaps } }),
      });
      const data = await response.json();
      if (data.analysis) {
        setAnalysis(data.analysis);
      }
    } catch (error) {
      console.error("Error analyzing certification:", error);
      alert("Error generando el análisis.");
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <>
      <Card title="Certificación Técnica" icon={<Icons.Target className="w-5 h-5 text-indigo-500" />} className="border-t-4 border-t-indigo-500">
        <div className="flex flex-col md:flex-row gap-8 items-center justify-between mb-6">
          <div className="text-center md:text-left">
            <p className="text-gray-500 text-sm font-bold uppercase tracking-wide">Puntaje Final</p>
            <p className="text-5xl font-black text-indigo-600 my-2">
              {result.score} <span className="text-2xl text-gray-300 font-normal">/ {result.total}</span>
            </p>
          </div>
          <div className="flex-1 bg-indigo-50 p-4 rounded-lg text-indigo-900 text-sm leading-relaxed border border-indigo-100">
            {result.analysis || "Sin análisis preliminar automático."}
          </div>
        </div>

        {/* Actions & Analysis */}
        <div className="flex flex-col gap-2 border-t pt-4">
          <div className="flex justify-between items-center">
            <h4 className="font-bold text-gray-700">Análisis y Detalles</h4>
            <div className="flex gap-2">
              <button
                onClick={() => setShowDetails(true)}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors shadow-sm"
              >
                <Icons.Search className="w-4 h-4" /> Ver Detalles
              </button>

              {!analysis && (
                <button
                  onClick={handleAnalyze}
                  disabled={analyzing}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 disabled:opacity-50 transition-colors shadow-sm"
                >
                  {analyzing ? <Spinner /> : <><Icons.Sparkles className="w-4 h-4" /> Analizar Brechas</>}
                </button>
              )}
            </div>
          </div>

          {analysis && (
            <div className="mt-4 bg-slate-50 p-4 rounded-xl border border-slate-200 animate-in fade-in">
              <div className="flex items-center gap-2 mb-2">
                <Icons.Sparkles className="text-indigo-600 w-4 h-4" />
                <h5 className="font-bold text-gray-800 text-sm">Resumen Ejecutivo de Brechas</h5>
              </div>
              <div className="prose prose-sm max-w-none text-gray-700">
                <Markdown>{analysis}</Markdown>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Details Modal */}
      <Modal isOpen={showDetails} onClose={() => setShowDetails(false)} title="Detalle de Respuestas">
        <div className="space-y-4">
          {questionsData?.questions.map((q) => {
            // Find the result matching this question ID
            const detail = result.details.find(d => d.questionId === q.id);
            const isCorrect = detail?.correct;

            return (
              <div key={q.id} className={`p-4 rounded-lg border ${isCorrect ? 'bg-green-50 border-green-100' : 'bg-red-50 border-red-100'}`}>
                <p className="font-bold text-gray-800 text-sm mb-2">{q.question}</p>

                {detail ? (
                  <div className="text-xs space-y-1">
                    <div className="flex gap-2">
                      <span className="font-semibold text-gray-500">Respuesta:</span>
                      <span className={isCorrect ? "text-green-700 font-bold" : "text-red-700 font-bold"}>
                        {detail.chosen || "Sin responder"}
                      </span>
                    </div>
                    {!isCorrect && (
                      <div className="flex gap-2">
                        <span className="font-semibold text-gray-500">Correcta:</span>
                        <span className="text-green-700 font-bold">{q.correctAnswer}</span>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-xs text-gray-400 italic">No se encontró respuesta registrada.</p>
                )}
              </div>
            );
          })}
          {!questionsData && <p className="text-center text-gray-500">No hay datos de preguntas disponibles.</p>}
        </div>
        <div className="mt-6 flex justify-end">
          <button onClick={() => setShowDetails(false)} className="bg-gray-800 text-white px-4 py-2 rounded-lg font-bold">Cerrar</button>
        </div>
      </Modal>
    </>
  );
};

// --- New ChallengeResultCard with AI Context Logic ---
const ChallengeResultCard: FC<{
  challenge: ChallengeResult;
  certificationResult?: CertificationResult;
}> = ({ challenge, certificationResult }) => {
  const [aiData, setAiData] = useState<{
    technicalContext: string;
    successIndicators: string[];
    suggestedQuestions: string[];
  } | null>(null);
  const [aiLoading, setAiLoading] = useState(false);

  const handleAskAI = async () => {
    setAiLoading(true);
    try {
      const response = await fetch("/api/challenge/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          challenge: challenge,
          certification: certificationResult,
        }),
      });
      if (!response.ok) throw new Error("Error fetching AI data");
      const data = await response.json();
      setAiData(data);
    } catch (error) {
      console.error("Failed to fetch AI assistant data", error);
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <Card title="Reto (Question Challenge)" icon={<Icons.Sparkles className="w-5 h-5 text-purple-500" />}
      action={
        !aiData && (
          <button
            onClick={handleAskAI}
            disabled={aiLoading}
            className="bg-purple-600 text-white text-xs font-bold px-3 py-2 rounded hover:bg-purple-700 transition disabled:bg-purple-300 flex items-center gap-2 shadow-sm"
          >
            {aiLoading ? <Spinner /> : "Analizar Contexto"}
          </button>
        )
      }
    >
      <h3 className="text-lg font-bold mb-2">{challenge.title}</h3>
      <div className="prose prose-sm max-w-none bg-gray-50 p-4 rounded-lg border mb-4">
        <Markdown>{challenge.description}</Markdown>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h4 className="font-bold text-xs uppercase text-gray-500 mb-2">Criterios</h4>
          <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
            {challenge.evaluationCriteria.map((c, i) => <li key={i}>{c}</li>)}
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-xs uppercase text-gray-500 mb-2">Cobertura Técnica</h4>
          <div className="flex flex-wrap gap-2 mb-4">
            {challenge.coverages.map((c, i) => <Badge key={i} variant="neutral">{c}</Badge>)}
          </div>

          {challenge.coverageQuestions && challenge.coverageQuestions.length > 0 && (
            <>
              <h4 className="font-bold text-xs uppercase text-indigo-500 mb-2">Preguntas Sugeridas (IA)</h4>
              <ul className="list-disc list-inside text-sm text-indigo-900 space-y-1 bg-indigo-50 p-3 rounded-lg border border-indigo-100">
                {challenge.coverageQuestions.map((q, i) => <li key={i}>{q}</li>)}
              </ul>
            </>
          )}
        </div>
      </div>

      {/* AI Context Display (Moved Here) */}
      {aiData && (
        <div className="mt-6 border-t pt-4 animate-in fade-in duration-300">
          <h4 className="font-bold text-gray-800 text-sm mb-4 flex items-center gap-2">
            <span className="text-xl">🤖</span> Análisis de Contexto & IA
          </h4>
          <div className="bg-purple-50 p-4 rounded-lg border border-purple-100 space-y-4">
            <div>
              <h5 className="font-semibold text-purple-900 text-sm mb-1 uppercase tracking-wider">Contexto Técnico</h5>
              <p className="text-sm text-purple-800 leading-relaxed">{aiData.technicalContext}</p>
            </div>
            <div>
              <h5 className="font-semibold text-green-800 text-sm mb-2 uppercase tracking-wider">Indicadores de Éxito</h5>
              <ul className="space-y-1">
                {aiData.successIndicators?.map((indicator, idx) => (
                  <li key={idx} className="text-sm text-purple-900 flex items-start gap-2">
                    <span className="text-green-600 font-bold">✓</span> {indicator}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h5 className="font-semibold text-purple-900 text-sm mb-2 uppercase tracking-wider">Preguntas de Profundización</h5>
              <ul className="list-disc list-inside space-y-1">
                {aiData.suggestedQuestions.map((q, idx) => (
                  <li key={idx} className="text-sm text-purple-800">{q}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};


// ... Restoring Full InterviewFeedbackCard (UPDATED: Removed AI Context) ...
const InterviewFeedbackCard: FC<{
  userData: UserData;
  onUpdate: () => void;
  challenge?: ChallengeResult;
}> = ({ userData, onUpdate, challenge }) => {
  const [feedback, setFeedback] = useState(userData.interview_feedback || "");
  const [status, setStatus] = useState(userData.interview_status || "");
  const [technicalLevel, setTechnicalLevel] = useState(userData.technical_level || "");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Interview Plan State
  const [interviewPlan, setInterviewPlan] = useState<InterviewPlan | null>(null);
  const [generatingPlan, setGeneratingPlan] = useState(false);

  // Sync state
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

  const handleStartInterview = async () => {
    if (!challenge) return;
    setGeneratingPlan(true);
    try {
      const response = await fetch("/api/challenge/interview-tree", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          challengeTitle: challenge.title,
          challengeDescription: challenge.description,
        }),
      });

      if (!response.ok) throw new Error("Failed to generate plan");
      const plan = await response.json();
      setInterviewPlan(plan);
    } catch (error) {
      console.error(error);
      alert("Error iniciando el modo entrevista.");
    } finally {
      setGeneratingPlan(false);
    }
  };

  const handleInterviewSave = async (history: any[]) => {
    setInterviewPlan(null);
    setLoading(true);
    setMessage({ type: "success", text: "Generando feedback con IA..." });

    try {
      const response = await fetch("/api/challenge/interview-feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          history,
          candidateName: userData.name
        })
      });

      if (!response.ok) throw new Error("Error generando feedback");
      const data = await response.json();

      const newFeedback = (feedback ? feedback + "\n\n" : "") + data.feedback;
      setFeedback(newFeedback);
      setMessage({ type: "success", text: "Feedback generado. Revisa y guarda." });

    } catch (err: any) {
      console.error(err);
      setMessage({ type: "error", text: "Error generando feedback IA: " + err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Card title="Evaluación del Entrevistador" icon={<Icons.MessageSquare className="w-5 h-5" />}>
        {/* AI Controls Header */}
        <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🤖</span>
            <div>
              <h4 className="font-bold text-gray-800 text-sm">Asistente de Entrevista</h4>
              <p className="text-xs text-gray-500">Herramientas de IA para el reclutador</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleStartInterview}
              disabled={generatingPlan || loading || !challenge}
              className="bg-teal-600 text-white text-xs font-bold px-3 py-2 rounded hover:bg-teal-700 transition disabled:bg-teal-300 flex items-center gap-2 shadow-sm"
            >
              {generatingPlan ? <Spinner /> : <><Icons.Sparkles className="w-3 h-3" /> Modo Guía (Wizard)</>}
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Feedback de la Entrevista</label>
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 min-h-[120px] text-sm font-mono"
              placeholder="Escribe el feedback detallado o usa el Asistente de Entrevista para generarlo..."
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

          <div className="flex justify-between items-center">
            {message && (
              <div className={`px-3 py-2 rounded-lg text-sm font-medium ${message.type === "success" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
                {message.text}
              </div>
            )}
            <button
              type="submit"
              disabled={loading}
              className="bg-indigo-600 text-white font-bold px-6 py-2 rounded-lg hover:bg-indigo-700 transition disabled:bg-indigo-300 flex items-center shadow-md ml-auto"
            >
              {loading ? <Spinner /> : "Guardar Feedback"}
            </button>
          </div>
        </form>
      </Card>

      {/* Render Wizard Modal if Plan exists */}
      {interviewPlan && (
        <InterviewWizard
          plan={interviewPlan}
          onClose={() => setInterviewPlan(null)}
          onSave={handleInterviewSave}
        />
      )}
    </>
  );
};