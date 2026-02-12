import { NextResponse } from "next/server";
import { db, initDb } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ code: string }> }
) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user) {
            return NextResponse.json({ message: "No autorizado" }, { status: 401 });
        }

        const { code } = await params;

        if (!code) {
            return NextResponse.json({ message: "Código de candidato requerido" }, { status: 400 });
        }

        await initDb();

        // Verify reminder count before deletion
        const result = await db.execute({
            sql: "SELECT reminder_count FROM users WHERE code = ? LIMIT 1",
            args: [code]
        });

        if (result.rows.length === 0) {
            return NextResponse.json({ message: "Candidato no encontrado" }, { status: 404 });
        }

        const reminderCount = (result.rows[0].reminder_count as number) || 0;

        if (reminderCount < 3) {
            return NextResponse.json({
                message: `El candidato debe tener al menos 3 recordatorios para ser eliminado. Actual: ${reminderCount}`
            }, { status: 400 });
        }

        // Perform hardware deletion
        await db.execute({
            sql: "DELETE FROM users WHERE code = ?",
            args: [code]
        });

        return NextResponse.json({ message: "Candidato eliminado permanentemente" });
    } catch (error: any) {
        console.error("Error en deletion API:", error);
        return NextResponse.json({ message: "Error al eliminar el candidato", error: error.message }, { status: 500 });
    }
}
