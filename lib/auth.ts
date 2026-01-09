import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { db } from "@/lib/db";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "Code",
      credentials: {
        code: { label: "Code", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.code) return null;

        try {
          const stmt = await db.execute(
            'SELECT name, code, email, requirements, step, evaluation_result, form_id, certification_result, challenge_result, interview_feedback, interview_status, technical_level, interviewer_name FROM users WHERE code = ?',
            [credentials.code]
          );
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
        const allowedDomain = process.env.ALLOWED_DOMAIN;

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
    async jwt({ token, user }) {
      // Al iniciar sesión, solo guardamos los datos básicos en el token (JWT)
      // para mantener la cookie pequeña (evita error 431).
      if (user) {
        token.id = user.id;
        token.code = (user as any).code;
        token.email = user.email;
        token.name = user.name;
      }
      return token;
    },
    async session({ session, token }) {
      // Cuando se solicita la sesión, recuperamos los datos completos de la DB
      // usando el código guardado en el JWT.
      if (token.code) {
        try {
          const stmt = await db.execute(
            'SELECT name, code, email, requirements, step, evaluation_result, form_id, certification_result, challenge_result, interview_feedback, interview_status, technical_level, interviewer_name FROM users WHERE code = ?',
            [token.code as string]
          );
          const user = stmt.rows.length ? stmt.rows[0] : null;

          if (user) {
            session.user = {
              ...session.user,
              ...user
            } as any;
          }
        } catch (error) {
          console.error("Error fetching session user from DB:", error);
        }
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET!,
};