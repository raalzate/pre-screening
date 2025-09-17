
import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET(req: Request) {
  try {
  
    // Obtener el código de usuario del header
    const code = req.headers.get('x-user-code');

    const stmt = db.prepare('SELECT questions FROM users WHERE code = ?');
    const user = stmt.get(code) as { questions: string } | undefined;

    if (!user) {
      return NextResponse.json({ message: 'Invalid code' }, { status: 401 });
    }

 // Filtrar solo el formulario asignado al usuario
    return NextResponse.json({ ...JSON.parse(user.questions) });
  } catch (error) {
    console.error('Error reading forms directory:', error);
    return NextResponse.json({ error: 'Failed to load forms' }, { status: 500 });
  }
}




export async function POST(req: Request) {
    try {
        const { result } = (await req.json()) as { result: any };
       

        const userCode = req.headers.get('x-user-code');

        // Si hay código de usuario, actualiza evaluation_result
        if (userCode) {
            const stmt = db.prepare(`
                UPDATE users
                SET certification_result = ?
                WHERE code = ?
            `);
            stmt.run(JSON.stringify(result), userCode);
        }

        return NextResponse.json(result);
    } catch (error: any) {
        console.error("❌ Error en evaluate API:", error);
        return NextResponse.json(
            { error: "Error generando preguntas de evaluación" },
            { status: 500 }
        );
    }
}