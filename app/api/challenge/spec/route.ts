import { NextResponse } from 'next/server';
import { specGenerator } from '@/lib/ia/specGenerator';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { challengeTitle, challengeDescription } = body;

        if (!challengeTitle || !challengeDescription) {
            return NextResponse.json({ error: 'Missing challenge info' }, { status: 400 });
        }

        const spec = await specGenerator.generate({
            challengeTitle,
            challengeDescription,
        });

        return NextResponse.json(spec);
    } catch (error: any) {
        console.error('Spec Route Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
