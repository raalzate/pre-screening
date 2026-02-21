import { NextResponse } from "next/server";
import { interviewFeedbackGenerator } from "@/lib/ia/interviewFeedbackGenerator";
import { RateLimitError, UnauthorizedError } from "@/lib/ia/baseGenerator";

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

        if (error instanceof RateLimitError) {
            return NextResponse.json({ message: error.message }, { status: 429 });
        }

        if (error instanceof UnauthorizedError) {
            return NextResponse.json({ message: error.message }, { status: 401 });
        }

        return NextResponse.json(
            { message: error.message || "Error generating feedback" },
            { status: 500 }
        );
    }
}
