import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { db } from '@/lib/db';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const code = (session.user as any).code;
    const requirements = (session.user as any).requirements;


    if (!code) {
      return NextResponse.json({ message: 'Invalid session: No user code found' }, { status: 401 });
    }

    if (!requirements) {
      return NextResponse.json({ message: 'Invalid session: No requirements found' }, { status: 401 });
    }

    const formsDirectory = path.join(process.cwd(), 'data', 'forms');
    const files = await fs.readdir(formsDirectory);

    // Query with both code AND requirements to get the correct profile
    const result = await db.execute(
      'SELECT form_id FROM users WHERE code = ? AND requirements = ?',
      [code, requirements]
    );


    const user = result.rows[0];

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 401 });
    }


    const formIds = files
      .filter((file) => file.endsWith('.json'))
      .map((file) => file.replace('.json', ''))
      .filter((id) => id === user.form_id);


    return NextResponse.json(formIds);
  } catch (error) {
    console.error('[/api/forms] Error:', error);
    return NextResponse.json({ error: 'Failed to load forms' }, { status: 500 });
  }
}
