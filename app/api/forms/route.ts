import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { db } from '@/lib/db';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const code = (session.user as any).code;

    if (!code) {
      return NextResponse.json({ message: 'Invalid session: No user code found' }, { status: 401 });
    }

    const formsDirectory = path.join(process.cwd(), 'data', 'forms');
    const files = await fs.readdir(formsDirectory);

    const user = (await db.execute('SELECT form_id FROM users WHERE code = ?', [code])).rows[0];

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 401 });
    }


    const formIds = files
      .filter((file) => file.endsWith('.json'))
      .map((file) => file.replace('.json', ''))
      .filter((id) => id === user.form_id); // Filtrar solo el formulario asignado al usuario
    return NextResponse.json(formIds);
  } catch (error) {
    console.error('Error reading forms directory:', error);
    return NextResponse.json({ error: 'Failed to load forms' }, { status: 500 });
  }
}
