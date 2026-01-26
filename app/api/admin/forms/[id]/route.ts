import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;
        const formsDirectory = path.join(process.cwd(), 'data', 'forms');
        const filePath = path.join(formsDirectory, `${id}.json`);

        try {
            const content = await fs.readFile(filePath, 'utf-8');
            const data = JSON.parse(content);
            return NextResponse.json(data);
        } catch (e) {
            return NextResponse.json({ message: 'Form not found' }, { status: 404 });
        }
    } catch (error) {
        console.error('Error reading form detail:', error);
        return NextResponse.json({ error: 'Failed to load form detail' }, { status: 500 });
    }
}
