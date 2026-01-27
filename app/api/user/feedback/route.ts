import { NextResponse } from "next/server";
import { db, initDb } from '@/lib/db';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user) {
            return NextResponse.json({ message: "No autorizado" }, { status: 401 });
        }

        await initDb();

        const { code, feedback, status, technicalLevel } = await request.json();

        if (!code || !feedback || !status || !technicalLevel) {
            return NextResponse.json({ message: "Faltan campos obligatorios" }, { status: 400 });
        }

        const interviewerName = session.user.name || session.user.email || "Admin";

        // Mover a histórico de forma transaccional
        await db.batch([
            {
                sql: `
                    INSERT INTO history_candidates (
                        name, email, code, requirements, step, form_id, 
                        evaluation_result, questions, certification_result, 
                        challenge_result, interview_feedback, interview_status, 
                        technical_level, interviewer_name
                    ) 
                    SELECT 
                        name, email, code, requirements, 'feedback', form_id, 
                        evaluation_result, questions, certification_result, 
                        challenge_result, ?, ?, ?, ?
                    FROM users 
                    WHERE code = ?
                `,
                args: [feedback, status, technicalLevel, interviewerName, code]
            },
            {
                sql: "DELETE FROM users WHERE code = ?",
                args: [code]
            }
        ], "write");

        return NextResponse.json({ message: "Feedback guardado y candidato archivado correctamente" });
    } catch (error: any) {
        console.error("Error en feedback API:", error);
        return NextResponse.json({ message: "Error al guardar el feedback" }, { status: 500 });
    }
}
