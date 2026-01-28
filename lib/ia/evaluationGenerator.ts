import { BaseGenerator } from './baseGenerator';
import { z } from 'zod';

const QuestionSchema = z.object({
  id: z.string(),
  question: z.string(),
  relatedTo: z.array(z.string()),
  options: z.array(z.string()).length(4),
  correctAnswer: z.string(),
  rationale: z.string(),
});

const EvaluationInputSchema = z.object({
  formId: z.string(),
  answers: z.record(z.string(), z.number()),
  gaps: z.array(z.string()).optional(),
  requirements: z.string().optional(),
});

const EvaluationResultSchema = z.object({
  validityScore: z.number().min(1).max(5),
  scoreExplanation: z.string(),
  questions: z.array(QuestionSchema),
});

export type EvaluationInput = z.infer<typeof EvaluationInputSchema>;
export type EvaluationResult = z.infer<typeof EvaluationResultSchema>;

class EvaluationGenerator extends BaseGenerator<typeof EvaluationInputSchema, typeof EvaluationResultSchema> {
  constructor() {
    super('gemini-2.5-flash');
  }

  get name() {
    return 'evaluationGenerator';
  }

  get inputSchema() {
    return EvaluationInputSchema;
  }

  get outputSchema() {
    return EvaluationResultSchema;
  }

  get promptTemplate() {
    return (input: EvaluationInput) => {
      const answers = JSON.stringify(input.answers, null, 2);
      const formId = input.formId;
      const storedGaps = input.gaps;
      const numQuestions = 15;

      return `
        Eres un evaluador técnico experto en escenarios o casos de usos reales. Tu tarea es generar exactamente ${numQuestions} preguntas de opción múltiple (MCQ) de estilo de un caso de uso basadas en las respuestas de un formulario técnico con escalas (0–5). 
        Las preguntas deben ser realistas, y con 4 opciones: 1 correcta y 3 distractores plausibles. 
        Siempre responde únicamente con JSON válido y nada más, siguiendo exactamente el esquema especificado.

        Quiero generar un cuestionario de opción múltiple con base en un formulario identificado como ${formId}.

        Input:
        Un objeto JSON donde las keys representan categorías técnicas (questionId) and los values son enteros de 0 a 5 que indican el nivel de dominio declarado por el candidato.
        Ejemplo:
        ${answers}

        Haz foco en los siguientes gaps, refuerza las áreas que faltan:
        ${storedGaps}

        Reglas de salida:

        1. Devuelve exactamente ${numQuestions} preguntas en el arreglo "questions".
        2. Cada pregunta debe ser estilo certificación:
          - basada en escenarios reales
          - con opciones plausibles (1 correcta + 3 distractores)
          - debe relacionar al menos dos categorías del objeto (ejemplo: redux y context, o props-state y lifecycle).
          - evita que el usuario use la técnica de descarte, las opciones deben ser muy similares entre ellas
        3. Cada pregunta debe contener:
          - id (q1..q10)
          - question (enunciado estilo escenario)
          - relatedTo (arreglo con las categorías vinculadas, ej: ["redux","context"])
          - options (4 opciones plausibles)
          - correctAnswer (el string exacto de la opción correcta)
          - rationale (explicación breve estilo de certificación, indicando por qué la opción correcta lo es y por qué las demás no)

        4. Calcula un "validityScore" (1..5) que refleje cuán consistentes parecen las respuestas del candidato comparando entre categorías relacionadas.
        5. Responde únicamente con JSON válido siguiendo este esquema:

        {
          "validityScore": <1..5>,
          "scoreExplanation": "frase corta separando por comas las razones del score",
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
    };
  }
}

export const evaluationGenerator = new EvaluationGenerator();
