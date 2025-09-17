import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
/*
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"code": "12345"}'
  */
export async function POST(request: Request) {
  try {
    const { code } = await request.json();

    if (!code) {
      return NextResponse.json({ message: 'Code is required' }, { status: 400 });
    }

    // Consulta el usuario en la base de datos
    const stmt = await db.execute('SELECT  name, code, requirements, step, evaluation_result, form_id, certification_result, challenge_result FROM users WHERE code = ?', [code]);
    const user = stmt.rows.length ? stmt.rows[0] : null;
    if (!user) {
      return NextResponse.json({ message: 'Invalid code' }, { status: 401 });
    }
    return NextResponse.json(user);
  } catch (error) {
    console.error('Error in login API:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}