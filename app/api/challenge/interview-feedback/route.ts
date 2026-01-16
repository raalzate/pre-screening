import { NextResponse } from "next/server";
import { interviewFeedbackGenerator } from "@/lib/ia/interviewFeedbackGenerator";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { history, candidateName } = body;

        if (!history || !Array.isArray(history)) {
            return NextResponse.json(
                { message: "El historial de entrevista es requerido." },
                { status: 400 }
            );
        }

        const feedback = await interviewFeedbackGenerator.generate({
            history,
            candidateName,
        });

        return NextResponse.json({ feedback });
    } catch (error: any) {
        console.error("Error generating feedback:", error);
        return NextResponse.json(
            { message: error.message || "Error generating feedback" },
            { status: 500 }
        );
    }
}
