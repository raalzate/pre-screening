// Si tu Next.js no soporta after(), puedes hacer:

import { compareAnswers } from "@/lib/Comparator";
import { EvaluationGenerator, EvaluationInput } from "@/lib/EvaluationGenerator";
import { NextResponse } from "next/server";
import { waitUntil } from "@vercel/functions";
import fs from "fs/promises";
import path from "path";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { formId, answers, requirements } = (await req.json()) as EvaluationInput;
    const generator = new EvaluationGenerator();

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

    const userCode = req.headers.get("x-user-code");

    if (userCode) {
      waitUntil((async () => {
        try {
          const questions = await generator.generate({ formId, answers });
          await db.execute(
            `UPDATE users
             SET evaluation_result = ?, questions = ?, step = ?
             WHERE code = ?`,
            [JSON.stringify(result), JSON.stringify(questions), 'certified', userCode]
          );
          console.log("✅ Datos guardados en la base de datos del codigo:", userCode);
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
