import { compareAnswers } from "@/lib/Comparator";
import { EvaluationGenerator, EvaluationInput } from "@/lib/EvaluationGenerator";
import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { db } from '@/lib/db';

export async function POST(req: Request) {
    try {
        const { formId, answers, requirements } = (await req.json()) as EvaluationInput;
        const generator = new EvaluationGenerator();
        // Ruta al archivo de requerimientos
        const filePath = path.join(
            process.cwd(),
            "data",
            "requirements",
            `${requirements}.json`
        );

        // Leer JSON del cliente
        const file = await fs.readFile(filePath, "utf-8");
        const clientConfig = JSON.parse(file);

        const clientRequirements = clientConfig.requirements;

        const comparisonResult = compareAnswers(answers, clientRequirements);
        const result = {
            formId,
            answers,
            requirements,
            opportunityTitle: clientConfig.title,
            ...comparisonResult,
        }
        // Obtener el código de usuario del header
        const userCode = req.headers.get('x-user-code');

        // Si hay código de usuario, actualiza evaluation_result
        if (userCode) {
            const questions = await generator.generate({formId, answers});
            await db.execute(`
                UPDATE users
                SET evaluation_result = ?, questions = ?
                WHERE code = ?
            `, [JSON.stringify(result), JSON.stringify(questions), userCode]);
        }

        return NextResponse.json(result);
    } catch (error) {
        console.error("❌ Error en evaluate API:", error);
        return NextResponse.json(
            { error: "Error generando preguntas de evaluación" },
            { status: 500 }
        );
    }
}