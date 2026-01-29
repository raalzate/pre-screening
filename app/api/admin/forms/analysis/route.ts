import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { formAnalysisGenerator } from '@/lib/ia/formAnalysisGenerator';

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const { formId, title, answers, resultData } = body;

        if (!formId || !title || !answers || !resultData) {
            return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
        }

        const { analysis } = await formAnalysisGenerator.generate({
            formId,
            title,
            answers,
            resultData,
        });

        return NextResponse.json({ analysis });
    } catch (error) {
        console.error('Error generating AI form analysis:', error);
        return NextResponse.json({ error: 'Failed to generate analysis' }, { status: 500 });
    }
}
