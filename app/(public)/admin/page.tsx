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
import { toast } from "react-hot-toast";
import { groupCandidatesByCode, GroupedCandidate, User as AdminUser, isCandidateRejected } from "@/lib/adminUtils";
import { DeleteCandidateDialog } from "../../(protected)/admin/candidates/components/DeleteCandidateDialog";

// UI Components
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Modal from "@/components/ui/Modal";
import Input from "@/components/ui/Input";

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
  "diners-payment-sr:payment-architect",
  "pichincha-fullstack-sr:fullstack-java-angular",
] as const;

type AdminView = "candidates" | "forms" | "history";
type CandidateStatusFilter = "all" | "in-progress" | "rejected";
type CandidateStepFilter = "all" | "pre-screening" | "challenge" | "interview";

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

  const fetchCandidate = useCallback(async (code: string, requirements?: string, formId?: string) => {
    if (!code) return;
    setLoading(true);
    setError(null);
    setData(null);
    try {
      let url = `/api/user?code=${encodeURIComponent(code.trim())}`;
      if (requirements) url += `&requirements=${encodeURIComponent(requirements)}`;
      if (formId) url += `&formId=${encodeURIComponent(formId)}`;
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

const useHistoryList = () => {
  const [users, setUsers] = useState<GroupedCandidate[]>([]);
  const [loading, setLoading] = useState(true);

  const refreshAction = useCallback(() => {
    setLoading(true);
    fetch("/api/admin/candidates/history")
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

  useEffect(() => {
    refreshAction();
  }, [refreshAction]);

  return { users, loading, refreshHistory: refreshAction };
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
  Bell: (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"></path><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"></path></svg>,
  Trash: (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>,
  Trophy: (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" /><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" /><path d="M4 22h16" /><path d="M10 14.66V17" /><path d="M14 14.66V17" /><path d="M18 2h-6c-2.76 0-5 2.24-5 5v7c0 2.76 2.24 5 5 5h6c2.76 0 5-2.24 5-5V7c0-2.76-2.24-5-5-5z" /></svg>,
};

const Spinner = ({ size = "sm" }: { size?: "sm" | "md" }) => (
  <div className={`animate-spin rounded-full border-2 border-sofka-light-blue/30 border-t-sofka-light-blue ${size === "sm" ? "h-4 w-4" : "h-6 w-6"}`} />
);

const Tabs: FC<{ tabs: { id: string; label: string; icon?: ReactNode }[]; activeTab: string; onChange: (id: string) => void }> = ({ tabs, activeTab, onChange }) => (
  <div className="flex gap-2 border-b border-gray-100 mb-8 overflow-x-auto pb-0">
    {tabs.map((tab) => (
      <button
        key={tab.id}
        onClick={() => onChange(tab.id)}
        className={`flex items-center gap-2 px-6 py-3 text-sm font-extrabold transition-all duration-300 whitespace-nowrap border-b-2 -mb-[2px] ${activeTab === tab.id
          ? "border-sofka-light-blue text-sofka-blue bg-sofka-light-blue/5"
          : "border-transparent text-gray-500 hover:text-sofka-light-blue hover:bg-gray-50"
          }`}
      >
        {tab.icon && <span className={activeTab === tab.id ? "text-sofka-light-blue" : "text-gray-400"}>{tab.icon}</span>}
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
          <button onClick={handleCopy} className="text-gray-400 hover:text-sofka-blue transition" title="Copiar">
            {copied ? <Icons.Check className="w-4 h-4 text-green-500" /> : <Icons.Copy className="w-4 h-4" />}
          </button>
        )}
      </dd>
    </div>
  );
};

const CandidateHeader: FC<{ user: UserData }> = ({ user }) => (
  <div className="top-0 z-30 m-4 flex flex-col md:flex-row justify-between items-center gap-4">
    <div className="flex items-center gap-4">
      <div className="w-14 h-14 rounded-2xl bg-sofka-blue flex items-center justify-center text-white font-bold text-2xl shadow-md">
        {user.name.charAt(0)}
      </div>
      <div>
        <h1 className="text-xl font-extrabold text-sofka-blue">{user.name}</h1>
        <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
          <Icons.Target className="w-4 h-4 text-sofka-orange" />
          <span className="font-semibold">{user.requirements}</span>
          <span className="text-gray-300">|</span>
          <Badge variant="neutral" className="font-mono text-[10px]">{user.code}</Badge>
        </div>
      </div>
    </div>
    <div className="flex gap-3">
      <Button
        variant="outline"
        size="sm"
        onClick={() => window.open(`/login?code=${user.code}`, '_blank')}
        className="gap-2"
      >
        <Icons.ExternalLink className="w-4 h-4" /> Link Candidato
      </Button>
    </div>
  </div>
);

// --- 5. PAGE LOGIC (MAIN COMPONENT) ---

export default function App() {
  const { status } = useSession();
  const router = useRouter();

  // Hooks
  const { users } = useUserList();
  const { users: historyUsers } = useHistoryList();
  const { data: userData, loading: userLoading, error: userError, fetchCandidate, setData } = useCandidate();

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
  const [stepFilter, setStepFilter] = useState<CandidateStepFilter>("challenge");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [restoring, setRestoring] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Auth Guard
  useEffect(() => {
    if (status === "unauthenticated") router.push("/admin/sign-in");
  }, [status, router]);

  // Derived State
  const currentSourceList = view === "history" ? historyUsers : users;

  const filteredUsers = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;

    return currentSourceList.filter((u: GroupedCandidate) => {
      const matchesSearch = u.name.toLowerCase().includes(q) || u.code.toLowerCase().includes(q);
      const isRejected = isCandidateRejected(u);

      let matchesStatus = true;
      if (statusFilter === "in-progress") matchesStatus = !isRejected;
      else if (statusFilter === "rejected") matchesStatus = isRejected;

      if (!matchesStatus || !matchesSearch) return false;

      // Date range filtering (only for history)
      if (view === "history" && (start || end)) {
        // We check if at least one profile matches the date range
        return u.profiles.some((p: any) => {
          if (!p.moved_at) return false;
          const movedAt = new Date(p.moved_at);
          if (start && movedAt < start) return false;
          if (end && movedAt > end) return false;
          return true;
        });
      }

      // Step filtering (only relevant for In-Process or All) - and only for active candidates
      if (view !== "history" && statusFilter !== "rejected" && stepFilter !== "all") {
        return u.profiles.some((p: any) => p.step === stepFilter);
      }

      return true;
    });
  }, [currentSourceList, searchQuery, statusFilter, stepFilter, view, startDate, endDate]);

  const handleSearch = () => {
    const source = view === "history" ? historyUsers : users;
    const group = source.find((u: GroupedCandidate) => u.code === selectedCode);
    if (group) {
      setSelectedGroupedCandidate(group);
      setSelectedProfileIndex(0);
      // Fetch the first profile's data
      const firstProfile = group.profiles[0];
      if (firstProfile) {
        fetchCandidate(firstProfile.code, firstProfile.requirements, firstProfile.form_id);
      }
    }
  };


  const handleProfileSwitch = (index: number) => {
    if (selectedGroupedCandidate && selectedGroupedCandidate.profiles[index]) {
      setSelectedProfileIndex(index);
      const profile = selectedGroupedCandidate.profiles[index];
      fetchCandidate(profile.code, profile.requirements, profile.form_id);
      setActiveTab("profile"); // Reset to profile tab when switching
    }
  };

  const handleRestore = async () => {
    if (!userData?.code) return;
    if (!confirm("¿Estás seguro de que deseas restaurar este candidato al proceso activo?")) return;

    setRestoring(true);
    try {
      const res = await fetch("/api/admin/candidates/restore", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: userData.code,
          requirements: userData.requirements,
          formId: userData.form_id
        }),
      });

      if (!res.ok) throw new Error("Error al restaurar");

      // Reload lists
      window.location.reload(); // Simplest way to ensure everything is in sync
    } catch (err) {
      console.error(err);
      toast.error("Error al restaurar el candidato");
    } finally {
      setRestoring(false);
    }
  };

  const statusCounts = useMemo(() => {
    const initial = {
      all: 0,
      inProgress: 0,
      rejected: 0,
      steps: {
        "pre-screening": 0,
        challenge: 0,
        interview: 0,
      },
    };

    const source = view === "history" ? historyUsers : users;

    return source.reduce((acc: any, u: GroupedCandidate) => {
      const isRejected = isCandidateRejected(u);
      if (isRejected) {
        acc.rejected++;
      } else {
        acc.inProgress++;
        // Count unique steps per active candidate
        const steps = new Set(u.profiles.map((p: any) => p.step));
        if (steps.has("pre-screening")) acc.steps["pre-screening"]++;
        if (steps.has("challenge")) acc.steps.challenge++;
        if (steps.has("interview")) acc.steps.interview++;
      }
      acc.all++;
      return acc;
    }, initial);
  }, [users, historyUsers, view]);


  if (status === "loading") return <div className="min-h-screen bg-gray-50 flex items-center justify-center"><Spinner size="md" /></div>;
  console.log(userData);
  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* --- VIEW TOGGLE --- */}
        <div className="flex bg-white p-1.5 rounded-xl shadow-sm border border-gray-200 mb-8 w-fit gap-1">
          <Button
            variant={view === "candidates" ? "primary" : "ghost"}
            size="sm"
            onClick={() => {
              setView("candidates");
              setSelectedFormId(null);
              setSelectedCode("");
              setData(null);
            }}
            className="px-6 font-bold"
          >
            Candidatos
          </Button>
          <Button
            variant={view === "history" ? "primary" : "ghost"}
            size="sm"
            onClick={() => {
              setView("history");
              setSelectedFormId(null);
              setSelectedCode("");
              setData(null);
            }}
            className="px-6 font-bold"
          >
            Historial
          </Button>
          <Button
            variant={view === "forms" ? "primary" : "ghost"}
            size="sm"
            onClick={() => {
              setView("forms");
              setSelectedFormId(null);
              setSelectedCode("");
              setData(null);
            }}
            className="px-6 font-bold"
          >
            Formularios
          </Button>

        </div>

        {/* --- STATUS FILTER --- */}
        {view === "candidates" && (
          <div className="flex gap-4 mb-6 overflow-x-auto pb-2">
            {[
              { id: "all", label: "Todos", count: statusCounts.all, variant: "neutral" as const },
              { id: "in-progress", label: "En Proceso", count: statusCounts.inProgress, variant: "primary" as const },
              { id: "rejected", label: "Rechazados", count: statusCounts.rejected, variant: "danger" as const },
            ].map((filter) => (
              <Button
                key={filter.id}
                variant={statusFilter === filter.id ? "primary" : "outline"}
                size="sm"
                onClick={() => {
                  setStatusFilter(filter.id as CandidateStatusFilter);
                  if (filter.id === "in-progress") setStepFilter("challenge");
                }}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all border-2 whitespace-nowrap ${statusFilter === filter.id ? "border-sofka-blue" : "border-gray-100"
                  }`}
              >
                {filter.label}
                <Badge variant={filter.variant}>
                  {filter.count}
                </Badge>
              </Button>
            ))}
          </div>
        )}

        {/* --- STEP FILTER (TAGS) --- */}
        {view === "candidates" && statusFilter === "in-progress" && (
          <div className="flex gap-2 mb-8 items-center bg-sofka-gray/30 p-3 rounded-2xl border border-gray-100 w-fit">
            <span className="text-xs font-bold text-sofka-blue px-2 uppercase tracking-wider">Etapa:</span>
            {[
              { id: "all", label: "Todos", count: statusCounts.inProgress },
              { id: "pre-screening", label: "Pre-Screening", count: statusCounts.steps["pre-screening"] },
              { id: "challenge", label: "Validación Técnica", count: statusCounts.steps.challenge },
              { id: "interview", label: "Entrevista", count: statusCounts.steps.interview },
            ].map((tag) => (
              <Button
                key={tag.id}
                variant={stepFilter === tag.id ? "primary" : "ghost"}
                size="sm"
                onClick={() => setStepFilter(tag.id as CandidateStepFilter)}
                className={`px-4 py-1.5 rounded-full transition-all border ${stepFilter === tag.id ? 'border-sofka-blue border-transparent shadow-sm' : 'border-gray-200'
                  }`}
              >
                {tag.label}
                <Badge variant={stepFilter === tag.id ? "primary" : "neutral"} className="ml-2">
                  {tag.count}
                </Badge>
              </Button>
            ))}
          </div>
        )}

        {/* --- TOP BAR: SEARCH & ACTIONS --- */}
        {(view === "candidates" || view === "history") && (
          <Card className="mb-8" action={
            view === "candidates" && (
              <Button variant="secondary" size="sm" onClick={() => router.push("/admin/studio/requirements/new")} className="gap-2">
                <Icons.Plus className="w-4 h-4" /> Nuevo Perfil
              </Button>
            )
          }>
            <div className="flex flex-col md:flex-row gap-4 items-end">
              <div className="flex-1 w-full space-y-4 md:space-y-0 md:grid md:grid-cols-3 md:gap-4">
                <div className="relative">
                  <Icons.Search className="absolute left-3 top-[38px] text-gray-400 w-4 h-4 z-10" />
                  <Input
                    label="Buscador"
                    placeholder="Nombre o código..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 ml-1">Candidato</label>
                  <select
                    value={selectedCode}
                    onChange={(e) => setSelectedCode(e.target.value)}
                    className="w-full py-2.5 px-4 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-sofka-light-blue outline-none text-sm transition-all"
                  >
                    <option value="">-- Seleccionar --</option>
                    {filteredUsers.map((group, i) => (
                      <option key={group.code + i} value={group.code} style={{ textTransform: 'uppercase' }}>
                        {group.name.toUpperCase()} ({group.profiles.length})
                      </option>
                    ))}
                  </select>
                </div>
                <Button
                  onClick={handleSearch}
                  disabled={userLoading || !selectedCode}
                  isLoading={userLoading}
                  className="w-full h-[42px]"
                >
                  Consultar
                </Button>
              </div>
            </div>
          </Card>
        )}

        {view === "candidates" && (
          <div className="mb-8 flex justify-end">
            <Button
              onClick={() => setIsModalOpen(true)}
              variant="accent"
              className="gap-2 shadow-md"
            >
              <Icons.Plus className="w-5 h-5" /> Nuevo Candidato
            </Button>
          </div>
        )}

        {/* Advanced Filters (Date range for History) */}
        {view === "history" && (
          <div className="flex flex-col md:flex-row gap-4 items-end bg-white p-4 rounded-xl border border-gray-100 mb-8">
            <div className="flex-1 space-y-1 w-full">
              <label className="text-xs font-bold text-gray-500 uppercase px-1">Movido desde:</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full py-2 px-3 rounded-lg border border-gray-200 bg-white focus:ring-2 focus:ring-sofka-light-blue outline-none text-sm"
              />
            </div>
            <div className="flex-1 space-y-1 w-full">
              <label className="text-xs font-bold text-gray-500 uppercase px-1">Hasta:</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full py-2 px-3 rounded-lg border border-gray-200 bg-white focus:ring-2 focus:ring-sofka-light-blue outline-none text-sm"
              />
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => { setStartDate(""); setEndDate(""); }}
              className="text-sofka-blue font-bold"
            >
              Limpiar Fechas
            </Button>
          </div>
        )}

        {/* --- MAIN CONTENT --- */}
        {(view === "candidates" || view === "history") && (
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
                  <Card className="mb-6" title="Perfiles del Candidato" icon={<Icons.User className="w-4 h-4 text-sofka-light-blue" />}>
                    <div className="flex gap-2 flex-wrap">
                      {selectedGroupedCandidate.profiles.map((profile, index) => (
                        <Button
                          key={`${profile.code}-${profile.requirements}-${index}`}
                          variant={selectedProfileIndex === index ? "primary" : "ghost"}
                          onClick={() => handleProfileSwitch(index)}
                          className="h-auto py-2 border border-gray-100"
                        >
                          <div className="flex flex-col items-start">
                            <span className="font-bold text-xs uppercase">{profile.requirements.replace('-', ' ')}</span>
                            <span className="text-[10px] opacity-75">{profile.form_id.replace('-', ' ')}</span>
                          </div>
                        </Button>
                      ))}
                    </div>
                  </Card>
                )}

                <div className="mb-6 bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                  <CandidateHeader user={userData} />
                  {view === "history" && (
                    <div className="px-6 pb-6 pt-0 flex justify-end">
                      <Button
                        variant="success"
                        onClick={handleRestore}
                        disabled={restoring}
                        isLoading={restoring}
                        className="gap-2"
                      >
                        <Icons.Check className="w-4 h-4" /> Restaurar Proceso
                      </Button>
                    </div>
                  )}
                </div>

                <Tabs
                  activeTab={activeTab}
                  onChange={setActiveTab}
                  tabs={[
                    { id: "profile", label: "Perfil & Pre-Screening", icon: <Icons.User className="w-4 h-4" /> },
                    ...(userData.certification_result || userData.challenge_result ? [
                      { id: "challenge", label: "Validación Técnica", icon: <Icons.Target className="w-4 h-4" /> }
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
                          <InfoRow label="Requisito" value={<Badge variant="primary">{userData.requirements}</Badge>} />
                          <InfoRow label="Etapa" value={userData.step} />
                          {userData.retry_count !== undefined && (
                            <InfoRow label="Reintentos" value={userData.retry_count} />
                          )}
                          <InfoRow label="Recordatorios" value={userData.reminder_count || 0} />
                          {userData.last_reminder_at && (
                            <InfoRow label="Último Envío" value={new Date(userData.last_reminder_at).toLocaleString()} />
                          )}
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

                      {/* ADMINISTRATIVE ACTIONS CARD */}
                      <Card title="Acciones" icon={<Icons.Plus className="w-5 h-5" />}>
                        <div className="space-y-4">
                          <Button
                            onClick={async () => {
                              if (userData.step !== 'pre-screening') {
                                toast.error("Los recordatorios solo están disponibles para la etapa de pre-screening.");
                                return;
                              }
                              try {
                                const res = await fetch("/api/admin/reminders", {
                                  method: "POST",
                                  headers: { "Content-Type": "application/json" },
                                  body: JSON.stringify({ candidateCode: userData.code }),
                                });
                                if (!res.ok) throw new Error(await res.text());
                                toast.success("Recordatorio enviado correctamente");
                                fetchCandidate(userData.code, userData.requirements);
                              } catch (e: any) {
                                toast.error("Error al enviar recordatorio: " + e.message);
                              }
                            }}
                            disabled={userData.step !== 'pre-screening'}
                            className="w-full gap-2 py-6"
                          >
                            <Icons.Bell className="w-5 h-5" /> Enviar Recordatorio
                          </Button>

                          <Button
                            variant="ghost"
                            onClick={() => setIsDeleteModalOpen(true)}
                            className="w-full gap-2 py-6 text-sofka-blue hover:bg-red-50 hover:text-sofka-light-blue border border-red-100"
                          >
                            <Icons.Trash className="w-5 h-5" /> Eliminar Candidato
                          </Button>
                        </div>
                      </Card>
                    </div>
                  )}

                  {/* TAB 2: TECHNICAL */}
                  {activeTab === "challenge" && (
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

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Crear Nuevo Candidato">
        <CreateUserForm onClose={() => setIsModalOpen(false)} />
      </Modal>

      <DeleteCandidateDialog
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        candidateName={userData?.name || ""}
        isDeleting={isDeleting}
        onConfirm={async (reason: string, customReason?: string) => {
          setIsDeleting(true);
          try {
            const res = await fetch("/api/admin/candidates/delete", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                candidateCode: userData?.code,
                requirements: userData?.requirements,
                formId: userData?.form_id,
                reason,
                customReason
              }),
            });

            if (!res.ok) throw new Error(await res.text());

            toast.success("Candidato eliminado y notificado exitosamente.");
            window.location.reload();
          } catch (e: any) {
            toast.error("Error al eliminar candidato: " + e.message);
          } finally {
            setIsDeleting(false);
            setIsDeleteModalOpen(false);
          }
        }}
      />
    </div >
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
    if (selectedReqs.length === 0) return toast.error("Selecciona al menos un perfil");

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
      toast.error("Error al crear candidato: " + e.message);
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
        <input required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-sofka-light-blue outline-none"
          value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
        <input required type="email" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-sofka-light-blue outline-none"
          value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Perfiles Técnicos</label>
        <div className="relative mb-3">
          <Icons.Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Buscar perfil (ej: angular, sr, backend)..."
            className="w-full pl-9 pr-4 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-sofka-light-blue outline-none bg-gray-50"
            value={profileSearch}
            onChange={(e) => setProfileSearch(e.target.value)}
          />
        </div>
        <div className="grid grid-cols-1 gap-2 max-h-60 overflow-y-auto pr-1">
          {filteredRequirements.map(req => {
            const isSelected = selectedReqs.includes(req);
            return (
              <button type="button" key={req} onClick={() => toggleReq(req)}
                className={`px-4 py-3 rounded-lg border text-left text-sm font-medium transition flex justify-between items-center ${isSelected ? "border-sofka-light-blue/20 bg-sofka-gray/10 text-sofka-light-blue ring-1 ring-teal-500" : "border-gray-200 hover:bg-gray-50"}`}>
                <span>{req.toUpperCase().replaceAll("-", " ").replace(":", " => ")}</span>
                {isSelected && <Icons.Check className="w-4 h-4 text-sofka-blue" />}
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
        <button disabled={loading} className="w-full bg-sofka-blue text-white py-3 rounded-xl font-bold hover:bg-teal-700 transition flex justify-center">
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

  const handleDecision = (result: "correct" | "incorrect" | "intermediate") => {
    if (!currentSection || !currentQuestion) return;

    // 1. Record Result
    const stepRecord = {
      section: currentSection.topic,
      questionId: currentQuestion.id,
      question: currentQuestion.text,
      guide: currentQuestion.guide,
      result: result === "correct" ? "Correcto" : result === "intermediate" ? "Intermedio" : "Incorrecto",
      timestamp: new Date().toISOString(),
    };

    const newHistory = [...history, stepRecord];
    setHistory(newHistory);

    // 2. Logic Flow
    if (result === "correct" || result === "intermediate") {
      // If Correct or Intermediate -> Next Question in SAME Section
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
              <span className="font-semibold text-sofka-blue uppercase tracking-wider">{currentSection.topic}</span>
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
          <div className="w-full bg-gray-100 rounded-full h-2 mb-8 overflow-hidden">
            <div
              className="bg-sofka-light-blue h-full transition-all duration-700 ease-out shadow-[0_0_8px_rgba(0,172,236,0.4)]"
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

          <div className="bg-sofka-gray/10 p-5 rounded-xl border border-sofka-light-blue/20">
            <h4 className="text-xs font-bold text-sofka-blue uppercase mb-2">Guía para el Entrevistador</h4>
            <p className="text-sm text-gray-700 leading-relaxed">{currentQuestion.guide}</p>
          </div>
        </div>

        {/* Footer / Controls */}
        <div className="p-6 border-t bg-sofka-blue/10 flex gap-4">
          <button
            onClick={() => handleDecision("incorrect")}
            className="flex-1 py-4 bg-white border border-gray-100 hover:border-sofka-error/30 hover:bg-sofka-error/5 text-sofka-error font-extrabold rounded-2xl transition-all flex flex-col items-center gap-1 group shadow-sm hover:shadow-md"
          >
            <span className="text-2xl mb-1">❌</span>
            <span className="text-xs uppercase tracking-wider">Incorrecto</span>
            <span className="text-[10px] text-gray-400 font-medium group-hover:text-sofka-error/60">(Siguiente tema)</span>
          </button>

          <button
            onClick={() => handleDecision("intermediate")}
            className="flex-1 py-4 bg-white border border-gray-100 hover:border-sofka-orange/30 hover:bg-sofka-orange/5 text-sofka-orange font-extrabold rounded-2xl transition-all flex flex-col items-center gap-1 group shadow-sm hover:shadow-md"
          >
            <span className="text-2xl mb-1">⚠️</span>
            <span className="text-xs uppercase tracking-wider">Parcial</span>
            <span className="text-[10px] text-gray-400 font-medium group-hover:text-sofka-orange/60">(Siguiente pregunta)</span>
          </button>

          <button
            onClick={() => handleDecision("correct")}
            className="flex-1 py-4 bg-white border border-gray-100 hover:border-sofka-success/30 hover:bg-sofka-success/5 text-sofka-success font-extrabold rounded-2xl transition-all flex flex-col items-center gap-1 group shadow-sm hover:shadow-md"
          >
            <span className="text-2xl mb-1">✅</span>
            <span className="text-xs uppercase tracking-wider">Correcto</span>
            <span className="text-[10px] text-gray-400 font-medium group-hover:text-sofka-success/60">(Siguiente pregunta)</span>
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
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al analizar");
      }
      const data = await response.json();
      if (data.analysis) {
        setAnalysis(data.analysis);
      }
    } catch (error: any) {
      console.error("Error analyzing certification:", error);
      toast.error(error.message || "Error generando el análisis.");
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <>
      <Card title="Certificación Técnica" icon={<Icons.Target className="w-5 h-5" />} className="border-t-4 border-t-sofka-light-blue shadow-lg">
        <div className="flex flex-col md:flex-row gap-8 items-center justify-between mb-6">
          <div className="text-center md:text-left">
            <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">Puntaje Final</p>
            <p className="text-5xl font-black text-sofka-blue my-2">
              {result.score} <span className="text-2xl text-gray-200 font-normal">/ {result.total}</span>
            </p>
          </div>
          <div className="flex-1 bg-sofka-gray/10 p-5 rounded-2xl text-gray-700 text-sm leading-relaxed border border-gray-100">
            {result.analysis || "Sin análisis preliminar automático."}
          </div>
        </div>

        {/* Actions & Analysis */}
        <div className="flex flex-col gap-2 border-t border-gray-100 pt-6">
          <div className="flex justify-between items-center">
            <h4 className="font-extrabold text-sofka-blue">Análisis y Detalles</h4>
            <div className="flex gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowDetails(true)}
                className="gap-2"
              >
                <Icons.Search className="w-4 h-4" /> Ver Detalles
              </Button>

              {!analysis && (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleAnalyze}
                  disabled={analyzing}
                  isLoading={analyzing}
                  className="gap-2 shadow-md shadow-sofka-blue/20"
                >
                  <Icons.Sparkles className="w-4 h-4" /> Analizar Brechas
                </Button>
              )}
            </div>
          </div>

          {analysis && (
            <div className="mt-4 bg-sofka-gray/10 p-4 rounded-xl border border-slate-200 animate-in fade-in">
              <div className="flex items-center gap-2 mb-2">
                <Icons.Sparkles className="text-sofka-blue w-4 h-4" />
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
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al consultar la IA");
      }
      const data = await response.json();
      setAiData(data);
    } catch (error: any) {
      console.error("Failed to fetch AI assistant data", error);
      toast.error(error.message || "Error consultando a la IA");
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <Card title="Reto (Question Challenge)" icon={<Icons.Trophy className="w-5 h-5 text-sofka-orange" />}
      action={
        !aiData && (
          <Button
            variant="accent"
            size="sm"
            onClick={handleAskAI}
            disabled={aiLoading}
            isLoading={aiLoading}
            className="gap-2 shadow-md shadow-sofka-orange/20"
          >
            <Icons.Sparkles className="w-4 h-4" /> Analizar Contexto
          </Button>
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
              <h4 className="font-bold text-xs uppercase text-sofka-light-blue mb-2">Preguntas Sugeridas (IA)</h4>
              <ul className="list-disc list-inside text-sm text-indigo-900 space-y-1 bg-sofka-gray/10 p-3 rounded-lg border border-sofka-light-blue/20">
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

  // Requirements Handling
  const availableRequirements = useMemo(() => {
    return (userData.requirements || "").split(',').map(r => r.trim()).filter(Boolean);
  }, [userData.requirements]);

  const [selectedRequirement, setSelectedRequirement] = useState<string>(availableRequirements[0] || "");

  // Update selected requirement when userData changes
  useEffect(() => {
    const reqs = (userData.requirements || "").split(',').map(r => r.trim()).filter(Boolean);
    if (reqs.length > 0) {
      setSelectedRequirement(reqs[0]);
    }
  }, [userData]);


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
      if (!selectedRequirement) {
        throw new Error("Debes seleccionar un perfil/requerimiento para calificar.");
      }

      const response = await fetch("/api/user/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: userData.code,
          feedback,
          status,
          technicalLevel,
          requirement: selectedRequirement,
        }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || "Error al guardar el feedback");
      }

      setMessage({ type: "success", text: "Feedback guardado y perfil archivado correctamente" });
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

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || errorData.message || "Failed to generate plan");
      }
      const plan = await response.json();
      setInterviewPlan(plan);
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Error iniciando el modo entrevista.");
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
        <div className="mb-8 p-6 bg-sofka-gray/10 rounded-2xl border border-gray-100 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white rounded-2xl shadow-sm">
              <span className="text-2xl">🤖</span>
            </div>
            <div>
              <h4 className="font-extrabold text-sofka-blue">Asistente de Entrevista</h4>
              <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Herramientas de IA Sofka</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="success"
              size="sm"
              onClick={handleStartInterview}
              disabled={generatingPlan || loading || !challenge}
              isLoading={generatingPlan}
              className="gap-2 shadow-md shadow-sofka-success/20"
            >
              <Icons.Sparkles className="w-4 h-4" /> Modo Guía (Wizard)
            </Button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Requirement Selector */}
          {availableRequirements.length > 1 && (
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg mb-4">
              <label className="block text-sm font-bold text-yellow-800 mb-1">
                ⚠️ Este candidato tiene múltiples perfiles activos.
              </label>
              <p className="text-xs text-yellow-700 mb-2">Selecciona a cuál perfil corresponde este feedback. El perfil seleccionado se moverá al historial, los otros seguirán activos.</p>
              <select
                value={selectedRequirement}
                onChange={(e) => setSelectedRequirement(e.target.value)}
                className="w-full px-3 py-2 border border-yellow-300 rounded focus:ring-yellow-500 focus:border-yellow-500 text-sm bg-white"
                required
              >
                {availableRequirements.map(req => (
                  <option key={req} value={req}>{req}</option>
                ))}
              </select>
            </div>
          )}

          {/* If single requirement, show it as info but hidden input */}
          {availableRequirements.length === 1 && (
            <input type="hidden" value={availableRequirements[0]} />
          )}


          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Feedback de la Entrevista</label>
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-sofka-light-blue focus:border-indigo-500 min-h-[120px] text-sm font-mono"
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
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-sofka-light-blue focus:border-indigo-500 text-sm"
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
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-sofka-light-blue focus:border-indigo-500 text-sm"
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
            <Button
              type="submit"
              disabled={loading}
              isLoading={loading}
              className="px-8 shadow-lg shadow-sofka-blue/20 ml-auto"
            >
              Guardar y Archivar
            </Button>
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