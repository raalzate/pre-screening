import { EvaluationGenerator, EvaluationInput } from "@/lib/LLMClient";
import { NextResponse } from "next/server";


// Ejemplo de POST opcional para guardar datos de un formulario
export async function POST(req: Request) {
    try {
        const body = (await req.json()) as EvaluationInput;

        const generator = new EvaluationGenerator();
        const result = await generator.generate(body);

        return NextResponse.json({
            formId: body.formId,
            ...result,
        });
    } catch (error: any) {
        console.error("❌ Error en evaluate API:", error);
        return NextResponse.json(
            { error: "Error generando preguntas de evaluación" },
            { status: 500 }
        );
    }
}