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

        const { code, feedback, status, technicalLevel, requirement, formId } = await request.json();

        if (!code || !feedback || !status || !technicalLevel || !requirement || !formId) {
            console.error("Faltan campos:", { code, feedback, status, technicalLevel, requirement, formId });
            return NextResponse.json({ message: "Faltan campos obligatorios" }, { status: 400 });
        }

        const interviewerName = session.user.name || session.user.email || "Admin";

        // 1. Fetch current profile row
        const userResult = await db.execute({
            sql: "SELECT * FROM users WHERE code = ? AND requirements = ? AND form_id = ?",
            args: [code, requirement, formId]
        });

        if (userResult.rows.length === 0) {
            return NextResponse.json({ message: "Perfil de candidato no encontrado" }, { status: 404 });
        }

        const targetRow = userResult.rows[0] as any;

        const timestamp = new Date().toISOString();

        const operations = [];

        // Operation A: Insert into History
        operations.push({
            sql: `
                INSERT INTO history_candidates (
                    name, email, code, requirements, step, form_id, 
                    evaluation_result, questions, certification_result, 
                    challenge_result, interview_feedback, interview_status, 
                    technical_level, interviewer_name, moved_at
                ) 
                VALUES (?, ?, ?, ?, 'feedback', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `,
            args: [
                targetRow.name, targetRow.email, targetRow.code, requirement, targetRow.form_id,
                targetRow.evaluation_result, targetRow.questions, targetRow.certification_result,
                targetRow.challenge_result, feedback, status, technicalLevel, interviewerName, timestamp
            ]
        });

        // Operation B: Delete the row from active users
        operations.push({
            sql: "DELETE FROM users WHERE code = ? AND requirements = ? AND form_id = ?",
            args: [code, requirement, formId]
        });

        await db.batch(operations, "write");

        return NextResponse.json({ message: "Feedback guardado y perfil archivado correctamente" });
    } catch (error: any) {
        console.error("Error en feedback API:", error);
        return NextResponse.json({ message: "Error al guardar el feedback: " + error.message }, { status: 500 });
    }
}
