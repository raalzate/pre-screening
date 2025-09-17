
import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import db from '@/lib/db';

export async function GET(req: Request) {
  try {
    const formsDirectory = path.join(process.cwd(), 'data', 'forms');
    const files = await fs.readdir(formsDirectory);


    // Obtener el código de usuario del header
    const code = req.headers.get('x-user-code');

    const stmt = db.prepare('SELECT form_id FROM users WHERE code = ?');
    const user = stmt.get(code) as { form_id: string } | undefined;

    if (!user) {
      return NextResponse.json({ message: 'Invalid code' }, { status: 401 });
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
