import { NextResponse } from "next/server";
import { challengeAssistant } from "@/lib/ia/challengeAssistant";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { challenge, certification } = body;

        if (!challenge) {
            return NextResponse.json(
                { message: "Faltan datos del reto (challenge)." },
                { status: 400 }
            );
        }

        const start = Date.now();
        const assistantResult = await challengeAssistant.generate({
            challenge,
            certification,
        });
        console.log(`AI Assistant took ${Date.now() - start}ms`);

        return NextResponse.json(assistantResult);
    } catch (error) {
        console.error("Error in AI Assistant:", error);
        return NextResponse.json(
            { message: "Error generando la asistencia con IA." },
            { status: 500 }
        );
    }
}
