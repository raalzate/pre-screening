import { NextResponse } from 'next/server';
import { saveStudioRequirement, getStudioRequirements } from '@/lib/db';

export async function GET() {
    try {
        const requirements = await getStudioRequirements();
        return NextResponse.json(requirements);
    } catch (error: any) {
        console.error('Error fetching requirements:', error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const { id, title, requirements, metadata, job_description, source_url } = await req.json();

        if (!id || !title || !requirements) {
            return NextResponse.json({ error: 'ID, Title, and Requirements are required' }, { status: 400 });
        }

        await saveStudioRequirement({
            id,
            title,
            content: JSON.stringify(requirements),
            metadata: metadata ? JSON.stringify(metadata) : undefined,
            job_description,
            source_url
        });

        return NextResponse.json({ success: true }, { status: 201 });
    } catch (error: any) {
        console.error('Error saving requirement:', error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
