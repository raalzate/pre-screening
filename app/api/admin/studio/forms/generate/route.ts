import { NextResponse } from 'next/server';
import { StudioFormGenerator } from '@/lib/ia/studioFormGenerator';
import { getStudioRequirementById } from '@/lib/db';
import { RateLimitError, UnauthorizedError } from '@/lib/ia/baseGenerator';

export async function POST(req: Request) {
    try {
        const { requirementId } = await req.json();

        if (!requirementId) {
            return NextResponse.json({ error: 'Requirement ID is required' }, { status: 400 });
        }

        const requirement = await getStudioRequirementById(requirementId);
        if (!requirement) {
            return NextResponse.json({ error: 'Requirement profile not found' }, { status: 404 });
        }

        const generator = new StudioFormGenerator();
        const result = await generator.generate({
            requirementId: requirement.id as string,
            requirementTitle: requirement.title as string,
            requirements: JSON.parse(requirement.content as string)
        });

        return NextResponse.json(result);
    } catch (error: any) {
        console.error('Error generating form:', error);

        if (error instanceof RateLimitError) {
            return NextResponse.json({ error: error.message }, { status: 429 });
        }

        if (error instanceof UnauthorizedError) {
            return NextResponse.json({ error: error.message }, { status: 401 });
        }

        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
