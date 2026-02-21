import { NextResponse } from 'next/server';
import { saveStudioForm, getStudioForms } from '@/lib/db';

export async function GET() {
    try {
        const forms = await getStudioForms();
        return NextResponse.json(forms);
    } catch (error: any) {
        console.error('Error fetching forms:', error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const { id, requirementId, title, categories, metadata } = await req.json();

        if (!id || !requirementId || !title || !categories) {
            return NextResponse.json({ error: 'ID, RequirementID, Title, and Categories are required' }, { status: 400 });
        }

        await saveStudioForm({
            id,
            requirement_id: requirementId,
            title,
            content: JSON.stringify({ categories }),
            metadata: metadata ? JSON.stringify(metadata) : undefined
        });

        return NextResponse.json({ success: true }, { status: 201 });
    } catch (error: any) {
        console.error('Error saving form:', error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
