"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  useCallback,
} from "react";
import { useSession, signIn, signOut } from "next-auth/react";

interface User {
  name: string;
  code: string;
  requirements: string;
  step: string;
  evaluation_result: string;
  certification_result: string;
  challenge_result: string;
  interview_feedback: string;
  interview_status: string;
  technical_level: string;
  interviewer_name: string;
  form_id: string;
  retry_count?: number;
}

export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (code: string, requirements?: string, formId?: string) => Promise<User>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { data: session, status } = useSession();
  const [user, setUser] = useState<User | null>(null);
  const isLoading = status === "loading";

  useEffect(() => {
    if (session?.user) {
      setUser(session.user as any);
    } else {
      setUser(null);
    }
  }, [session]);

  const login = useCallback(async (code: string, requirements?: string, formId?: string) => {
    const result = await signIn("credentials", {
      code,
      requirements,
      formId,
      redirect: false,
    });

    if (result?.error) {
      throw new Error(result.error);
    }

    // Fetch full user data after successful login to maintain compatibility
    let url = `/api/user?code=${encodeURIComponent(code)}`;
    if (requirements) {
      url += `&requirements=${encodeURIComponent(requirements)}`;
    }
    if (formId) {
      url += `&formId=${encodeURIComponent(formId)}`;
    }

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("No se pudo recuperar la información del usuario tras el inicio de sesión.");
    }

    return await response.json();
  }, []);

  const logout = useCallback(() => {
    signOut({ redirect: true, callbackUrl: "/login" });
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
