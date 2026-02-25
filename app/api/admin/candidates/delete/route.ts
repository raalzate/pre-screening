import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db, createAdminNotification, deleteCandidatePermanently } from "@/lib/db";
import { sendCandidateDeletionEmail } from "@/lib/email";

export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions);

    if (!session || (session.user as any).role !== "admin") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    try {
        const { candidateCode, requirements, formId, reason, customReason } = await req.json();

        if (!candidateCode || !requirements || !formId || !reason) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const finalReason = reason === "CUSTOM" ? customReason : reason;

        if (reason === "CUSTOM" && !customReason) {
            return NextResponse.json({ error: "Custom reason description is required" }, { status: 400 });
        }

        // 1. Fetch candidate details for notification (Check both tables)
        const stmt = await db.execute({
            sql: `
                SELECT name, email FROM users WHERE code = ? AND requirements = ? AND form_id = ?
                UNION
                SELECT name, email FROM history_candidates WHERE code = ? AND requirements = ? AND form_id = ?
            `,
            args: [candidateCode, requirements, formId, candidateCode, requirements, formId]
        });

        const candidate = stmt.rows.length ? stmt.rows[0] : null;

        if (!candidate) {
            return NextResponse.json({ error: "Candidate not found" }, { status: 404 });
        }

        // 2. Send email notification
        await sendCandidateDeletionEmail(
            candidate.name as string,
            candidate.email as string,
            finalReason
        );

        // 3. Delete candidate permanently
        await deleteCandidatePermanently(candidateCode, requirements, formId);

        // 4. Log the action
        await createAdminNotification({
            type: "CANDIDATE_DELETED",
            candidateName: candidate.name as string,
            candidateCode: candidateCode,
            message: `Candidato eliminado por administrador. Razón: ${finalReason}`
        });

        return NextResponse.json({ success: true, message: "Candidato eliminado y notificado exitosamente." });
    } catch (error: any) {
        console.error("Error in candidate deletion API:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
