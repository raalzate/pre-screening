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
import { sendEvaluationCompleteEmail } from "@/lib/email";

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
