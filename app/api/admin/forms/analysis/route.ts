import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { formAnalysisGenerator } from '@/lib/ia/formAnalysisGenerator';
import { initDb, saveFormAnalysis } from '@/lib/db';
import { RateLimitError, UnauthorizedError } from '@/lib/ia/baseGenerator';

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user || (session.user as any).role !== 'admin') {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const { formId, title, answers, resultData } = body;

        if (!formId || !title || !answers || !resultData) {
            return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
        }

        await initDb();

        const { analysis } = await formAnalysisGenerator.generate({
            formId,
            title,
            answers,
            resultData,
        });

        // Persist analysis in DB
        await saveFormAnalysis({
            formId,
            analysisText: analysis,
            score: resultData.score,
            totalPossible: resultData.totalPossible,
            percentage: resultData.percentage
        });

        return NextResponse.json({ analysis });
    } catch (error: any) {
        console.error('Error generating AI form analysis:', error);

        if (error instanceof RateLimitError) {
            return NextResponse.json({ error: error.message }, { status: 429 });
        }

        if (error instanceof UnauthorizedError) {
            return NextResponse.json({ error: error.message }, { status: 401 });
        }

        return NextResponse.json({ error: 'Failed to generate analysis' }, { status: 500 });
    }
}

