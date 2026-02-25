import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { initDb, withdrawCandidate, createAdminNotification } from "@/lib/db";

export async function POST() {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user) {
            return NextResponse.json({ message: "No autorizado" }, { status: 401 });
        }

        const user = session.user as any;
        const candidateCode = user.code;
        const requirements = user.requirements;
        const formId = user.form_id;
        const candidateName = user.name || "Candidato";

        await initDb();

        // 1. Move to history and delete from active users
        await withdrawCandidate(candidateCode, requirements, formId);

        // 2. Create admin notification
        await createAdminNotification({
            type: "withdrawal",
            candidateName,
            candidateCode,
            message: `El candidato ${candidateName} se ha dado de baja voluntariamente del proceso.`
        });

        return NextResponse.json({ message: "Baja procesada correctamente" });
    } catch (error: any) {
        console.error("Error in withdrawal API:", error);
        return NextResponse.json({ message: "Error al procesar la baja" }, { status: 500 });
    }
}
