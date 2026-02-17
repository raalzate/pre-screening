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
import { sendEvaluationCompleteEmail, sendRejectionEmail, sendRecruiterNotification } from "@/lib/email";
import { config } from "@/lib/config";

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
               WHERE code = ? AND requirements = ?`,
              [JSON.stringify(result), 'feedback', 'no_pasa', feedback, 'IA Assistant', userCode, requirements]
            );
            console.log("❌ Candidato rechazado automáticamente por falta de cobertura:", userCode, requirements);

            // Enviar correo de rechazo
            try {
              const userStmt = await db.execute("SELECT name, email, created_by FROM users WHERE code = ? AND requirements = ?", [userCode, requirements]);
              const user = userStmt.rows[0];
              if (user && user.email) {
                await sendRejectionEmail(user.name as string, user.email as string);

                // Notify Recruiter
                const recruiterEmail = (user.created_by as string) || config.DEFAULT_RECRUITER_EMAIL;
                await sendRecruiterNotification(
                  recruiterEmail,
                  user.name as string,
                  'REJECTION',
                  `El candidato no cumplió con los requerimientos técnicos para ${requirements}.`
                );
              }
            } catch (emailErr) {
              console.error("❌ Error enviando correos de rechazo/notificación:", emailErr);
            }
            return;
          }

          // Caso de éxito: Generar certificación
          const questions = await evaluationGenerator.generate({
            formId, answers, gaps: comparisonResult.gaps
              .filter(gap => gap.got >= gap.required).map(gap => gap.skill)
          });
          await db.execute(
            `UPDATE users
             SET evaluation_result = ?, questions = ?, step = ?
             WHERE code = ? AND requirements = ?`,
            [JSON.stringify(result), JSON.stringify(questions), 'certified', userCode, requirements]
          );
          console.log("✅ Datos guardados en la base de datos del codigo:", userCode, requirements);

          // Enviar correo de notificación de fin de evaluación
          try {
            const userStmt = await db.execute("SELECT name, email FROM users WHERE code = ? AND requirements = ?", [userCode, requirements]);
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
