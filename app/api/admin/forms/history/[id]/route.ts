import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getFormAnalysesByFormId, initDb } from '@/lib/db';

export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const { id: formId } = await params;

        if (!formId) {
            return NextResponse.json({ message: 'Missing form ID' }, { status: 400 });
        }

        await initDb();
        const records = await getFormAnalysesByFormId(formId);

        return NextResponse.json(records);
    } catch (error) {
        console.error('Error fetching form analysis history:', error);
        return NextResponse.json({ error: 'Failed to fetch history' }, { status: 500 });
    }
}
