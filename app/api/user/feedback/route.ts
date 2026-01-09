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

        await db.execute(`
      UPDATE users 
      SET 
        step = ?,
        interview_feedback = ?, 
        interview_status = ?, 
        technical_level = ?, 
        interviewer_name = ?
      WHERE code = ?
    `, ["feedback", feedback, status, technicalLevel, interviewerName, code]);

        return NextResponse.json({ message: "Feedback de entrevista guardado correctamente" });
    } catch (error: any) {
        console.error("Error en feedback API:", error);
        return NextResponse.json({ message: "Error al guardar el feedback" }, { status: 500 });
    }
}
