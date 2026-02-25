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
    const formId = (session?.user as any)?.form_id;

    const user = (await db.execute('SELECT questions, certification_started_at FROM users WHERE code = ? AND requirements = ? AND form_id = ?', [code, requirements, formId])).rows[0];

    if (!user) {
      return NextResponse.json({ message: 'Invalid code' }, { status: 401 });
    }

    // Set start time if not already set
    if (!user.certification_started_at) {
      console.log(`Setting certification_started_at for user ${code} - ${requirements} - ${formId}`);
      await db.execute('UPDATE users SET certification_started_at = datetime("now") WHERE code = ? AND requirements = ? AND form_id = ?', [code, requirements, formId]);
    }
    // Filtrar solo el formulario asignado al usuario
    const questionsStr = user.questions ? user.questions : null;
    if (!questionsStr) {
      return NextResponse.json({ questions: [] });
    }

    const fullForm = JSON.parse(questionsStr as string);

    // US1: Stripping correct answers and rationales
    const sanitizedQuestions = fullForm.questions?.map((q: any) => {
      const { id, question, options } = q;
      return { id, question, options };
    }) ?? [];

    return NextResponse.json({
      ...fullForm,
      questions: sanitizedQuestions
    });
  } catch (error) {
    console.error('Error reading forms :', error);
    return NextResponse.json({ error: 'Failed to load forms' }, { status: 500 });
  }
}




import { calculateCertificationResult } from '@/lib/ia/certification';

export async function POST(req: Request) {
  try {
    const { answers } = (await req.json()) as { answers: Record<number, string> };

    const session = await getServerSession(authOptions);
    const userCode = (session?.user as any)?.code;
    const requirements = (session?.user as any)?.requirements;
    const formId = (session?.user as any)?.form_id;

    if (!userCode) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch full questions from DB for validation
    const userStmt = await db.execute('SELECT questions, name, email, certification_started_at FROM users WHERE code = ? AND requirements = ? AND form_id = ?', [userCode, requirements, formId]);
    const userData = userStmt.rows[0];

    if (!userData || !userData.questions) {
      return NextResponse.json({ error: "Questions not found" }, { status: 404 });
    }

    const fullForm = JSON.parse(userData.questions as string);

    // T012: Server-side time validation
    if (userData.certification_started_at) {
      const startTime = new Date(userData.certification_started_at as string).getTime();
      const now = new Date().getTime();
      const elapsedSeconds = (now - startTime) / 1000;

      const timeLimitPerQuestion = 125;
      const bufferFactor = 1.5;
      const allowedTime = fullForm.questions.length * timeLimitPerQuestion * bufferFactor;

      if (elapsedSeconds > allowedTime) {
        return NextResponse.json({ error: "Time limit exceeded. Submission blocked." }, { status: 403 });
      }
    }

    const result = calculateCertificationResult(answers, fullForm.questions);

    await db.execute(`
                UPDATE users
                SET certification_result = ?, step = ?
                WHERE code = ? AND requirements = ? AND form_id = ?
            `, [JSON.stringify(result), 'challenge', userCode, requirements, formId]);

    // Enviar correo de notificación de fin de certificación
    try {
      if (userData.email) {
        await sendCertificationCompleteEmail(userData.name as string, userData.email as string, userCode);
      }
    } catch (emailErr) {
      console.error("❌ Error enviando correo de fin de certificación:", emailErr);
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