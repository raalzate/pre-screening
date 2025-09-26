
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(req: Request) {
  try {
  
    // Obtener el código de usuario del header
    const code = req.headers.get('x-user-code');

    const user = (await db.execute('SELECT questions FROM users WHERE code = ?', [code])).rows[0];

    if (!user) {
      return NextResponse.json({ message: 'Invalid code' }, { status: 401 });
    }
 // Filtrar solo el formulario asignado al usuario
    const questions = user.questions ? user.questions : null;
    return NextResponse.json({ ...JSON.parse(questions as string) });
  } catch (error) {
    console.error('Error reading forms :', error);
    return NextResponse.json({ error: 'Failed to load forms' }, { status: 500 });
  }
}




export async function POST(req: Request) {
    try {
        const { result } = (await req.json()) as { result: any };
       

        const userCode = req.headers.get('x-user-code');

        if (userCode) {
            await db.execute(`
                UPDATE users
                SET certification_result = ?, step = ?
                WHERE code = ?
            `, [JSON.stringify(result), 'challenge', userCode]);
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