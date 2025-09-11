// src/lib/evaluationGenerator.ts
import OpenAI from "openai";


export type EvaluationInput = { formId: string; answers: Record<string, number>, gaps?: string[] };
export type EvaluationResult = {
  validityScore: number;
  scoreExplanation: string;
  questions: Array<{ id: string; question: string; relatedTo: string; expectedEvidence: string }>;
};


export class EvaluationGenerator {
  private client: any;


  constructor() {
    this.client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }


  private buildMessages(input: EvaluationInput) {
    const answers = JSON.stringify(
      input.answers,
      null,
      2
    );
    const formId = input.formId;
    const system = `Eres un evaluador técnico experto en escenarios o casos de usos reales. Tu tarea es generar exactamente 3 preguntas de opción múltiple (MCQ) de estilo de un caso de uso basadas en las respuestas de un formulario técnico con escalas (0–5). 
Las preguntas deben ser realistas, y con 4 opciones: 1 correcta y 3 distractores plausibles. 
Siempre responde únicamente con JSON válido y nada más, siguiendo exactamente el esquema especificado.
`;


    const user = `Quiero generar un cuestionario de opción múltiple con base en un formulario identificado como ${formId}.

Input:
Un objeto JSON donde las keys representan categorías técnicas (questionId) y los values son enteros de 0 a 5 que indican el nivel de dominio declarado por el candidato.
Ejemplo:
${answers}

Reglas de salida:

1. Devuelve exactamente 3 preguntas en el arreglo "questions".
2. Cada pregunta debe ser estilo certificación:
  - basada en escenarios reales
  - con opciones plausibles (1 correcta + 3 distractores)
  - debe relacionar al menos dos categorías del objeto (ejemplo: redux y context, o props-state y lifecycle).
3. Cada pregunta debe contener:
  - id (q1..q5)
  - question (enunciado estilo escenario)
  - relatedTo (arreglo con las categorías vinculadas, ej: ["redux","context"])
  - options (4 opciones plausibles)
  - correctAnswer (el string exacto de la opción correcta)
  - rationale (explicación breve estilo de certificación, indicando por qué la opción correcta lo es y por qué las demás no)

4. Calcula un "validityScore" (1..5) que refleje cuán consistentes parecen las respuestas del candidato comparando entre categorías relacionadas.
5. Responde únicamente con JSON válido siguiendo este esquema:

{
  "validityScore": <1..5>,
  "scoreExplanation": "frase corta",
  "questions": [
    {
      "id": "q1",
      "question": "Texto estilo escenario",
      "relatedTo": ["categoria1","categoria2"],
      "options": ["opción A", "opción B", "opción C", "opción D"],
      "correctAnswer": "opción A",
      "rationale": "Explicación"
    }
  ]
}
`;


    return [
      { role: "system", content: system },
      { role: "user", content: user },
    ];
  }


  async generate(input: EvaluationInput): Promise<EvaluationResult> {
    const messages = this.buildMessages(input);


    const resp = await this.client.chat.completions.create({
      model: "gpt-4o-mini",
      messages,
      temperature: 0,
      max_tokens: 800,
    });


    const raw = resp.choices?.[0]?.message?.content ?? "";

    // Intentar extraer JSON puro
    const first = raw.indexOf("{");
    const last = raw.lastIndexOf("}");
    if (first === -1 || last === -1) throw new Error("No se obtuvo JSON válido del modelo");


    const jsonStr = raw.slice(first, last + 1);
    const parsed = JSON.parse(jsonStr);


    // Validaciones mínimas
    if (!parsed.questions || parsed.questions.length !== 3) {
      throw new Error("El modelo no devolvió 3 preguntas exactamente");
    }


    return parsed as EvaluationResult;
  }
}