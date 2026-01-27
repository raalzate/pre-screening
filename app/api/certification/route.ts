import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { sendCertificationCompleteEmail } from '@/lib/email';

export async function GET() {
  try {

    const session = await getServerSession(authOptions);
    const code = (session?.user as any)?.code;
    const requirements = (session?.user as any)?.requirements;

    const user = (await db.execute('SELECT questions FROM users WHERE code = ? AND requirements = ?', [code, requirements])).rows[0];

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


    const session = await getServerSession(authOptions);
    const userCode = (session?.user as any)?.code;
    const requirements = (session?.user as any)?.requirements;

    if (userCode) {
      await db.execute(`
                UPDATE users
                SET certification_result = ?, step = ?
                WHERE code = ? AND requirements = ?
            `, [JSON.stringify(result), 'challenge', userCode, requirements]);

      // Enviar correo de notificación de fin de certificación
      try {
        const userStmt = await db.execute("SELECT name, email FROM users WHERE code = ? AND requirements = ?", [userCode, requirements]);
        const user = userStmt.rows[0];
        if (user && user.email) {
          await sendCertificationCompleteEmail(user.name as string, user.email as string, userCode);
        }
      } catch (emailErr) {
        console.error("❌ Error enviando correo de fin de certificación:", emailErr);
      }
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