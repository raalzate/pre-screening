import { NextResponse } from "next/server";
import { initDb, restoreCandidate } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user) {
            return NextResponse.json({ message: "No autorizado" }, { status: 401 });
        }

        const { code } = await req.json();

        if (!code) {
            return NextResponse.json({ message: "Falta el código del candidato" }, { status: 400 });
        }

        await initDb();
        await restoreCandidate(code);

        return NextResponse.json({ message: "Candidato restaurado correctamente" });
    } catch (error: any) {
        console.error("Error en restore API:", error);
        return NextResponse.json({ message: "Error al restaurar el candidato" }, { status: 500 });
    }
}
