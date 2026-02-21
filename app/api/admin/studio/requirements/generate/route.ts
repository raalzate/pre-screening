import { NextResponse } from 'next/server';
import { StudioRequirementGenerator } from '@/lib/ia/studioRequirementGenerator';
import { RateLimitError, UnauthorizedError } from '@/lib/ia/baseGenerator';

export async function POST(req: Request) {
    try {
        const { role, seniority, jobDescription } = await req.json();

        if (!role || !seniority) {
            return NextResponse.json({ error: 'Role and Seniority are required' }, { status: 400 });
        }

        const generator = new StudioRequirementGenerator();
        const result = await generator.generate({ role, seniority, jobDescription });

        return NextResponse.json(result);
    } catch (error: any) {
        console.error('Error generating requirements:', error);

        if (error instanceof RateLimitError) {
            return NextResponse.json({ error: error.message }, { status: 429 });
        }

        if (error instanceof UnauthorizedError) {
            return NextResponse.json({ error: error.message }, { status: 401 });
        }

        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
