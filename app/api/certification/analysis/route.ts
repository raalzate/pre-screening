import { NextRequest, NextResponse } from "next/server";
import { certificationAnalysisGenerator } from "@/lib/ia/certificationAnalysisGenerator";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { result } = body;

        if (!result) {
            return NextResponse.json(
                { error: "Certification result is required" },
                { status: 400 }
            );
        }

        const analysis = await certificationAnalysisGenerator.generate({
            score: result.score,
            gaps: result.gaps,
            details: result.details,
        });

        return NextResponse.json({ analysis });
    } catch (error) {
        console.error("Error generating certification analysis:", error);
        return NextResponse.json(
            { error: "Failed to generate analysis" },
            { status: 500 }
        );
    }
}
