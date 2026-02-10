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

        const { code, feedback, status, technicalLevel, requirement } = await request.json();

        if (!code || !feedback || !status || !technicalLevel || !requirement) {
            console.error("Faltan campos:", { code, feedback, status, technicalLevel, requirement });
            return NextResponse.json({ message: "Faltan campos obligatorios" }, { status: 400 });
        }

        const interviewerName = session.user.name || session.user.email || "Admin";

        // 1. Fetch current user to get all requirements
        // NOTE: Since PK is (code, requirements), we fetch by code and find the row containing the target requirement
        // Ideally, we should receive the full 'requirements' string from frontend to identify the exact row,
        // but for now we search by code and filter in memory if needed.
        const userResult = await db.execute({
            sql: "SELECT * FROM users WHERE code = ?",
            args: [code]
        });

        if (userResult.rows.length === 0) {
            return NextResponse.json({ message: "Candidato no encontrado" }, { status: 404 });
        }

        // Find the specific row that contains the target requirement
        const targetRow = userResult.rows.find((row: any) => {
            const reqs = (row.requirements as string).split(',').map(r => r.trim());
            return reqs.includes(requirement);
        });

        if (!targetRow) {
            return NextResponse.json({ message: "El candidato no tiene asignado ese requerimiento" }, { status: 404 });
        }

        const currentReqsString = targetRow.requirements as string;
        const currentReqsList = currentReqsString.split(',').map(r => r.trim());

        // 2. Logic to Split
        // New requirements list for the active row (remove the target one)
        const newReqsList = currentReqsList.filter(r => r !== requirement);
        const newReqsString = newReqsList.join(',');

        const timestamp = new Date().toISOString();

        const operations = [];

        // Operation A: Insert into History (for the target requirement)
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

        // Operation B: Update or Delete the Active Row
        if (newReqsList.length > 0) {
            // Update the existing row with the remaining requirements
            // WE MUST BE CAREFUL WITH PRIMARY KEY UPDATE.
            // PK is (code, requirements). We cannot simply update 'requirements' if it's part of PK in some SQL dialects without issues,
            // but in SQLite/LibSQL it usually works if no conflict.
            // However, it's safer to DELETE and INSERT, or just UPDATE if we are sure.
            // Let's try UPDATE 'requirements' = newReqsString WHERE code = ? AND requirements = currentReqsString
            operations.push({
                sql: "UPDATE users SET requirements = ? WHERE code = ? AND requirements = ?",
                args: [newReqsString, code, currentReqsString]
            });
        } else {
            // No requirements left, delete the row entirely
            operations.push({
                sql: "DELETE FROM users WHERE code = ? AND requirements = ?",
                args: [code, currentReqsString]
            });
        }

        await db.batch(operations, "write");

        return NextResponse.json({ message: "Feedback guardado y perfil archivado correctamente" });
    } catch (error: any) {
        console.error("Error en feedback API:", error);
        return NextResponse.json({ message: "Error al guardar el feedback: " + error.message }, { status: 500 });
    }
}
