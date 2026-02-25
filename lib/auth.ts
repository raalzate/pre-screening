import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { db } from "@/lib/db";
import { config } from "./config";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: config.GOOGLE_CLIENT_ID,
      clientSecret: config.GOOGLE_CLIENT_SECRET,
    }),
    CredentialsProvider({
      name: "Code",
      credentials: {
        code: { label: "Code", type: "text" },
        requirements: { label: "Requirements", type: "text" },
        formId: { label: "Form ID", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.code) return null;

        try {
          let stmt;
          if (credentials.requirements && credentials.formId) {
            stmt = await db.execute(
              'SELECT name, code, email, requirements, step, evaluation_result, form_id, certification_result, challenge_result, interview_feedback, interview_status, technical_level, interviewer_name FROM users WHERE code = ? AND requirements = ? AND form_id = ?',
              [credentials.code, credentials.requirements, credentials.formId]
            );
          } else {
            // Fallback for single profile or auto-select first (legacy behavior safety)
            // However, login flow should handle selection before calling this if multiple exist.
            stmt = await db.execute(
              'SELECT name, code, email, requirements, step, evaluation_result, form_id, certification_result, challenge_result, interview_feedback, interview_status, technical_level, interviewer_name FROM users WHERE code = ?',
              [credentials.code]
            );
          }

          const user = stmt.rows.length ? stmt.rows[0] : null;

          if (user) {
            return {
              id: user.code as string,
              name: user.name as string,
              email: user.email as string,
              code: user.code as string,
              step: user.step as string,
              requirements: user.requirements as string,
              evaluation_result: user.evaluation_result as string,
              certification_result: user.certification_result as string,
              challenge_result: user.challenge_result as string,
              interview_feedback: user.interview_feedback as string,
              interview_status: user.interview_status as string,
              technical_level: user.technical_level as string,
              interviewer_name: user.interviewer_name as string,
              form_id: user.form_id as string,
            };
          }
          return null;
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },

  pages: {
    signIn: "/admin/sign-in",
    error: "/admin/sign-in",
  },

  callbacks: {
    async signIn({ account, profile }) {
      if (account?.provider === "google") {
        const allowedDomain = config.ALLOWED_DOMAIN;

        if (!profile?.email) {
          throw new Error("No hay perfil de email en la cuenta de Google.");
        }

        if (profile.email.endsWith(`@${allowedDomain}`)) {
          return true; // El usuario está en el dominio, permitir inicio de sesión
        } else {
          return `/admin/sign-in?error=DomainNotAllowed`;
        }
      }

      // Para otros proveedores (como Credentials), permitir el inicio de sesión
      // ya que la lógica de validación ya ocurrió en 'authorize'
      return true;
    },
    async jwt({ token, user, account }) {
      // Al iniciar sesión, solo guardamos los datos básicos en el token (JWT)
      // para mantener la cookie pequeña (evita error 431).
      if (user) {
        token.id = user.id;
        token.code = (user as any).code;
        token.email = user.email;
        token.name = user.name;
        // Persist the specific requirements chosen
        token.requirements = (user as any).requirements;
        token.formId = (user as any).form_id;

        // Role assignment
        if (account?.provider === "google") {
          token.role = "admin";
        } else {
          token.role = "candidate";
        }
      }
      return token;
    },
    async session({ session, token }) {
      // Devolver el rol al objeto session
      if (session.user) {
        (session.user as any).role = token.role;
      }

      // Cuando se solicita la sesión, recuperamos los datos completos de la DB
      // usando el código guardado en el JWT.
      if (token.code && typeof token.code === 'string') {
        try {
          let stmt;
          const code = token.code;
          const reqs = token.requirements as string | undefined;
          const fId = token.formId as string | undefined;

          if (reqs && fId && typeof reqs === 'string' && typeof fId === 'string') {
            // Query with requirements and formId if available (multi-profile case)
            stmt = await db.execute(
              'SELECT name, code, email, requirements, step, evaluation_result, form_id, certification_result, challenge_result, interview_feedback, interview_status, technical_level, interviewer_name FROM users WHERE code = ? AND requirements = ? AND form_id = ?',
              [code, reqs, fId]
            );
          } else {
            // Fallback for sessions without full keys or during transition
            stmt = await db.execute(
              'SELECT name, code, email, requirements, step, evaluation_result, form_id, certification_result, challenge_result, interview_feedback, interview_status, technical_level, interviewer_name FROM users WHERE code = ? LIMIT 1',
              [code]
            );
          }

          const userFromDb = stmt.rows.length ? stmt.rows[0] : null;

          if (userFromDb) {
            session.user = {
              ...session.user,
              ...userFromDb,
              role: token.role as string
            } as any;
          }
        } catch (error) {
          console.error("Error fetching session user from DB:", error);
        }
      }
      return session;
    },
  },
  secret: config.NEXTAUTH_SECRET,
};