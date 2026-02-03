import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user || (session.user as any).role !== 'admin') {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const formsDirectory = path.join(process.cwd(), 'data', 'forms');
        const files = await fs.readdir(formsDirectory);

        const forms = await Promise.all(
            files
                .filter((file) => file.endsWith('.json'))
                .map(async (file) => {
                    const filePath = path.join(formsDirectory, file);
                    const content = await fs.readFile(filePath, 'utf-8');
                    const data = JSON.parse(content);
                    return {
                        id: data.id || file.replace('.json', ''),
                        title: data.title || file.replace('.json', ''),
                    };
                })
        );

        return NextResponse.json(forms);
    } catch (error) {
        console.error('Error reading forms directory:', error);
        return NextResponse.json({ error: 'Failed to load forms' }, { status: 500 });
    }
}
