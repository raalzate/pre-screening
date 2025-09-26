import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],

  pages: {
    signIn: "/admin/sign-in",
    error: "/admin/sign-in",
  },

  callbacks: {
    async signIn({ profile }) {
      const allowedDomain = process.env.ALLOWED_DOMAIN;

      if (!profile?.email) {
        throw new Error("No hay perfil de email.");
      }

      if (profile.email.endsWith(`@${allowedDomain}`)) {
        return true; // El usuario está en el dominio, permitir inicio de sesión
      } else {
        return `/admin/sign-in?error=DomainNotAllowed`;
      }
    },
  },
  secret: process.env.NEXTAUTH_SECRET!,
};