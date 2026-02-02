import { NextResponse } from "next/server";
import { initDb, getHistoryCandidates } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user) {
            return NextResponse.json({ message: "No autorizado" }, { status: 401 });
        }

        await initDb();
        const records = await getHistoryCandidates();

        return NextResponse.json(records);
    } catch (error: any) {
        console.error("Error en history API:", error);
        return NextResponse.json({ message: "Error al obtener el historial" }, { status: 500 });
    }
}
