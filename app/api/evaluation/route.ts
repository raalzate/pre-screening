// Si tu Next.js no soporta after(), puedes hacer:

import { compareAnswers } from "@/lib/comparator";
import { evaluationGenerator, EvaluationInput } from "@/lib/ia/evaluationGenerator";
import { NextResponse } from "next/server";
import { waitUntil } from "@vercel/functions";
import fs from "fs/promises";
import path from "path";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { sendEvaluationCompleteEmail, sendRejectionEmail } from "@/lib/email";

export async function POST(req: Request) {
  try {
    const { formId, answers, requirements } = (await req.json()) as EvaluationInput;

    const filePath = path.join(process.cwd(), "data", "requirements", `${requirements}.json`);
    const file = await fs.readFile(filePath, "utf-8");
    const clientConfig = JSON.parse(file);

    const comparisonResult = compareAnswers(answers, clientConfig.requirements);

    const result = {
      formId,
      answers,
      requirements,
      opportunityTitle: clientConfig.title,
      ...comparisonResult,
    };

    const session = await getServerSession(authOptions);
    const userCode = (session?.user as any)?.code;

    if (userCode) {
      waitUntil((async () => {
        try {
          if (!session || !session.user) return;

          if (!comparisonResult.valid) {
            // Caso de rechazo automático
            const name = (session.user as any).name || "Candidato";
            const feedback = `Hola ${name},\n\nAgradecemos tu interés en Sofka. Tras evaluar tu pre-screening técnico, hemos identificado que en este momento existe una brecha significativa respecto a los requerimientos del rol.\n\nPor el momento no continuaremos con tu proceso, pero te invitamos a seguir fortaleciendo tu perfil para futuras oportunidades.`;

            await db.execute(
              `UPDATE users
               SET evaluation_result = ?, step = ?, interview_status = ?, interview_feedback = ?, interviewer_name = ?
               WHERE code = ?`,
              [JSON.stringify(result), 'feedback', 'no_pasa', feedback, 'IA Assistant', userCode]
            );
            console.log("❌ Candidato rechazado automáticamente por falta de cobertura:", userCode);

            // Enviar correo de rechazo
            try {
              const userStmt = await db.execute("SELECT name, email FROM users WHERE code = ?", [userCode]);
              const user = userStmt.rows[0];
              if (user && user.email) {
                await sendRejectionEmail(user.name as string, user.email as string);
              }
            } catch (emailErr) {
              console.error("❌ Error enviando correo de rechazo:", emailErr);
            }
            return;
          }

          // Caso de éxito: Generar certificación
          const questions = await evaluationGenerator.generate({ formId, answers });
          await db.execute(
            `UPDATE users
             SET evaluation_result = ?, questions = ?, step = ?
             WHERE code = ?`,
            [JSON.stringify(result), JSON.stringify(questions), 'certified', userCode]
          );
          console.log("✅ Datos guardados en la base de datos del codigo:", userCode);

          // Enviar correo de notificación de fin de evaluación
          try {
            const userStmt = await db.execute("SELECT name, email FROM users WHERE code = ?", [userCode]);
            const user = userStmt.rows[0];
            if (user && user.email) {
              await sendEvaluationCompleteEmail(user.name as string, user.email as string, userCode);
            }
          } catch (emailErr) {
            console.error("❌ Error enviando correo de fin de evaluación:", emailErr);
          }
        } catch (err) {
          console.error("❌ Error guardando con waitUntil():", err);
        }
      })());
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("❌ Error en evaluate API:", error);
    return NextResponse.json({ error: "Error generando evaluación" }, { status: 500 });
  }
}
