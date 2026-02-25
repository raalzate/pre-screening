import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { sendRecruiterNotification } from "@/lib/email";
import { config } from "@/lib/config";

export async function POST() {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return NextResponse.json({ message: "No autorizado" }, { status: 401 });
        }

        const { code, requirements, form_id: formId } = session.user as any;

        if (!code || !requirements || !formId) {
            return NextResponse.json({ message: "Sesión inválida" }, { status: 400 });
        }

        // 1. Obtener estado actual del usuario
        const userResult = await db.execute({
            sql: "SELECT name, retry_count, step, created_by FROM users WHERE code = ? AND requirements = ? AND form_id = ?",
            args: [code, requirements, formId]
        });

        if (userResult.rows.length === 0) {
            return NextResponse.json({ message: "Usuario no encontrado" }, { status: 404 });
        }

        const user = userResult.rows[0];
        const retryCount = (user.retry_count as number) || 0;

        // 2. Validar límite de reintentos
        if (retryCount >= 3) {
            return NextResponse.json({ message: "Has alcanzado el límite máximo de reintentos (3)" }, { status: 403 });
        }

        // 3. Reiniciar evaluación e incrementar contador
        await db.execute({
            sql: `UPDATE users 
            SET step = 'pre-screening',
                evaluation_result = NULL,
                questions = NULL,
                certification_result = NULL,
                challenge_result = NULL,
                interview_status = NULL,
                interview_feedback = NULL,
                interviewer_name = NULL,
                retry_count = ?
            WHERE code = ? AND requirements = ? AND form_id = ?`,
            args: [retryCount + 1, code, requirements, formId]
        });

        // 4. Notificar al reclutador (non-blocking)
        const recruiterEmail = (user.created_by as string) || config.DEFAULT_RECRUITER_EMAIL;
        sendRecruiterNotification(
            recruiterEmail,
            user.name as string,
            'RETRY',
            `El candidato ha iniciado su reintento número ${retryCount + 1} para ${requirements}.`
        ).catch(err => console.error("❌ Error notificando reintento:", err));

        return NextResponse.json({
            message: "Evaluación reiniciada correctamente",
            retry_count: retryCount + 1,
            next_step: "pre-screening"
        });

    } catch (error) {
        console.error("❌ Error en retry API:", error);
        return NextResponse.json({ message: "Error interno del servidor" }, { status: 500 });
    }
}
