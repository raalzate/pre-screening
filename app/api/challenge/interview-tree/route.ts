import { NextResponse } from "next/server";
import { interviewTreeGenerator } from "@/lib/ia/interviewTreeGenerator";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { challengeTitle, challengeDescription } = body;

        if (!challengeTitle || !challengeDescription) {
            return NextResponse.json(
                { message: "Faltan datos del reto (título o descripción)." },
                { status: 400 }
            );
        }

        const tree = await interviewTreeGenerator.generate({
            challengeTitle,
            challengeDescription,
        });

        return NextResponse.json(tree);
    } catch (error: any) {
        console.error("Error generating interview tree:", error);
        return NextResponse.json(
            { message: error.message || "Error generating tree" },
            { status: 500 }
        );
    }
}
