import { NextResponse } from "next/server";
import { db, initDb } from "@/lib/db";
import { sendCandidateReminderEmail } from "@/lib/email";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user) {
            return NextResponse.json({ message: "No autorizado" }, { status: 401 });
        }

        const { candidateCode } = await req.json();

        if (!candidateCode) {
            return NextResponse.json({ message: "Código de candidato requerido" }, { status: 400 });
        }

        await initDb();

        // Fetch candidate profiles that are in 'pre-screening'
        const result = await db.execute({
            sql: "SELECT name, email, code, reminder_count FROM users WHERE code = ? AND step = 'pre-screening'",
            args: [candidateCode]
        });

        if (result.rows.length === 0) {
            return NextResponse.json({ message: "Candidato no encontrado o no está en pre-screening" }, { status: 404 });
        }

        const candidate = result.rows[0];
        const name = candidate.name as string;
        const email = candidate.email as string;
        const code = candidate.code as string;

        if (!email) {
            return NextResponse.json({ message: "El candidato no tiene un correo electrónico asociado" }, { status: 400 });
        }

        // Send email
        await sendCandidateReminderEmail(name, email, code);

        // Update reminder stats for ALL profiles with this code that are in pre-screening
        await db.execute({
            sql: "UPDATE users SET reminder_count = reminder_count + 1, last_reminder_at = CURRENT_TIMESTAMP WHERE code = ? AND step = 'pre-screening'",
            args: [candidateCode]
        });

        return NextResponse.json({ message: "Recordatorio enviado con éxito" });
    } catch (error: any) {
        console.error("Error en reminders API:", error);
        return NextResponse.json({ message: "Error al enviar el recordatorio", error: error.message }, { status: 500 });
    }
}
