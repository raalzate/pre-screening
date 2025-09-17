import { NextResponse } from 'next/server';
import db from '@/lib/db';
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
    const stmt = db.prepare('SELECT  name, code, requirements, step, evaluation_result, form_id, certification_result, challenge_result FROM users WHERE code = ?');
    const user = stmt.get(code) as { 
      name: string; 
      code: string; 
      requirements: string; 
      step: number, 
      evaluation_result: string, 
      certification_result: string,
      challenge_result: string,
      form_id: string
    } | undefined;

    if (!user) {
      return NextResponse.json({ message: 'Invalid code' }, { status: 401 });
    }
    return NextResponse.json({ ...user });
  } catch (error) {
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}