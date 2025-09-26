import NextAuth from "next-auth";

import { authOptions } from "@/lib/auth"; // Ajusta la ruta si es necesario

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };

