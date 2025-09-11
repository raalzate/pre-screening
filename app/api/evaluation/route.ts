import { compareAnswers } from "@/lib/Comparator";
import { EvaluationGenerator, EvaluationInput } from "@/lib/LLMClient";
import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";


// Ejemplo de POST opcional para guardar datos de un formulario
export async function POST(req: Request) {
    try {
        const opportunityId = "deuna"
        const { formId, answers, } = (await req.json()) as EvaluationInput;;

        const generator = new EvaluationGenerator();
        const result = await generator.generate({ formId, answers });

        // Ruta al archivo de requerimientos
        const filePath = path.join(
            process.cwd(),
            "data",
            "requirements",
            `${opportunityId}.json`
        );

        // Leer JSON del cliente
        const file = await fs.readFile(filePath, "utf-8");
        const clientConfig = JSON.parse(file);

        const clientRequirements = clientConfig.requirements;

        const comparisonResult = compareAnswers(answers, clientRequirements);

        return NextResponse.json({
            formId,
            answers,
            opportunityId,
            opportunityTitle: clientConfig.title,
            ...comparisonResult,
            ...result
        });
    } catch (error: any) {
        console.error("❌ Error en evaluate API:", error);
        return NextResponse.json(
            { error: "Error generando preguntas de evaluación" },
            { status: 500 }
        );
    }
}
