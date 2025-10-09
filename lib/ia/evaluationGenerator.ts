import { genkit } from 'genkit';
import { config } from 'dotenv';
import { googleAI } from '@genkit-ai/googleai';
import * as z from 'zod';
import { v4 as uuidv4 } from 'uuid';

config();

// 1. Configuración e Inicialización de Genkit
// Se utiliza una sintaxis más concisa para configurar Genkit y el modelo por defecto.
export const ai = genkit({
  plugins: [googleAI()],
  model: googleAI.model('gemini-2.5-flash'),
});

// ===================================================================================
// GENERADOR DE DESAFÍOS (CHALLENGE GENERATOR)
// ===================================================================================

// 2. Definición de Esquemas para Challenge
const GapSchema = z.object({
  skill: z.string(),
  required: z.number(),
  got: z.number(),
});

const ChallengeInputSchema = z.object({
  formId: z.string(),
  answers: z.record(z.string(), z.number()),
  gaps: z.array(GapSchema),
});

type ChallengeInput = z.infer<typeof ChallengeInputSchema>;

const ChallengeResultSchema = z.object({
  challengeId: z.string(),
  title: z.string(),
  description: z.string(),
  mermaid: z.string(),
  coverages: z.array(z.string()),
  coverageQuestions: z.array(z.string()),
  evaluationCriteria: z.array(z.string()),
});

type ChallengeResult = z.infer<typeof ChallengeResultSchema>;

// 3. Creación del Flow para Challenge
const challengeFlow = ai.defineFlow(
  {
    name: 'challengeGeneratorFlow',
    inputSchema: ChallengeInputSchema,
    outputSchema: ChallengeResultSchema,
  },
  async (input) => {
    const gaps = JSON.stringify(input.gaps, null, 2);
    const formId = input.formId.replaceAll('-', ' ');

    const prompt = `
      Eres un experto en ${formId}.
      Genera una **pregunta práctica, abierta y desafiante** redactada como un **caso de estudio hipotético (use case)**.
      La salida debe ser una **pregunta clara** (no un reto ni instrucción), siempre planteada en términos de un escenario o situación.
      El caso de estudio debe incluir además un **diagrama en Mermaid (sequenceDiagram)** que represente el flujo de interacción entre actores o componentes principales del escenario.
      La persona deberá analizar el gráfico junto con el caso para responder.

      ### Reglas
      - La salida debe ser una **pregunta redactada como tal**, dentro de un **caso de estudio hipotético**.
      - La **pregunta debe estar siempre en negrilla usando formato HTML (<b> ... </b>)** dentro de la descripción, para que sea fácil de identificar.
      - El diagrama Mermaid debe ser un **sequenceDiagram válido**.
      - **Formatea cada elemento de la lista "gaps" como una pregunta en el nuevo array "coverageQuestions".**
      
      ### Datos de entrada
      ${gaps}

      ### Formato de salida
      Devuelve solo un JSON válido con el siguiente esquema:
      {
        "title": "string",
        "description": "string (el caso de estudio con la pregunta redactada en <b>negrilla</b>)",
        "coverages": ["string"],
        "coverageQuestions": ["string"],
        "evaluationCriteria": ["string"],
        "mermaid": "string (solo el código del diagrama Mermaid)"
      }
    `;

    const llmResponse = await ai.generate({
      prompt: prompt,
      config: { temperature: 0.5 },
      output: {
        format: 'json',
        schema: ChallengeResultSchema.omit({ challengeId: true }),
      },
    });

    const challengeData = llmResponse.output;
    if (!challengeData) {
      throw new Error("No se obtuvo una respuesta válida del modelo para el desafío.");
    }

    return {
      ...challengeData,
      challengeId: uuidv4(),
    };
  }
);

// 4. Objeto exportado para Challenge
export const challengeGenerator = {
  async generate(input: ChallengeInput): Promise<ChallengeResult> {
    const validatedInput = ChallengeInputSchema.parse(input);
    return await challengeFlow(validatedInput);
  },
};

// ===================================================================================
// GENERADOR DE EVALUACIONES (EVALUATION GENERATOR)
// ===================================================================================

// 5. Definición de Esquemas para Evaluation
const EvaluationInputSchema = z.object({
  formId: z.string(),
  answers: z.record(z.string(), z.number()),
  gaps: z.array(z.string()).optional(),
  requirements: z.string().optional(),
});

export type EvaluationInput = z.infer<typeof EvaluationInputSchema>;

const QuestionSchema = z.object({
  id: z.string(),
  question: z.string(),
  relatedTo: z.array(z.string()),
  options: z.array(z.string()).length(4),
  correctAnswer: z.string(),
  rationale: z.string(),
});

const EvaluationResultSchema = z.object({
  validityScore: z.number().min(1).max(5),
  scoreExplanation: z.string(),
  questions: z.array(QuestionSchema),
});

type EvaluationResult = z.infer<typeof EvaluationResultSchema>;

// 6. Creación del Flow para Evaluation
const evaluationFlow = ai.defineFlow(
  {
    name: 'evaluationGeneratorFlow',
    inputSchema: EvaluationInputSchema,
    outputSchema: EvaluationResultSchema,
  },
  async (input) => {
    const answers = JSON.stringify(input.answers, null, 2);
    const formId = input.formId;
    const numQuestions = 10;

    const prompt = `
      Eres un evaluador técnico experto en escenarios o casos de usos reales. Tu tarea es generar exactamente ${numQuestions} preguntas de opción múltiple (MCQ) de estilo de un caso de uso basadas en las respuestas de un formulario técnico con escalas (0–5). 
      Las preguntas deben ser realistas, y con 4 opciones: 1 correcta y 3 distractores plausibles. 
      Siempre responde únicamente con JSON válido y nada más, siguiendo exactamente el esquema especificado.

      Quiero generar un cuestionario de opción múltiple con base en un formulario identificado como ${formId}.

      Input:
      Un objeto JSON donde las keys representan categorías técnicas (questionId) y los values son enteros de 0 a 5 que indican el nivel de dominio declarado por el candidato.
      Ejemplo:
      ${answers}

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

    const llmResponse = await ai.generate({
      prompt: prompt,
      output: {
        format: 'json',
        schema: EvaluationResultSchema,
      },
    });

    const evaluationData = llmResponse.output;
    if (!evaluationData) {
      throw new Error("No se obtuvo una respuesta válida del modelo para la evaluación.");
    }
    
    // Validación adicional por si el modelo no sigue la instrucción de la cantidad de preguntas.
    if (evaluationData.questions.length !== numQuestions) {
        throw new Error(`El modelo no devolvió exactamente ${numQuestions} preguntas.`);
    }

    return evaluationData;
  }
);

// 7. Objeto exportado para Evaluation
export const evaluationGenerator = {
  async generate(input: EvaluationInput): Promise<EvaluationResult> {
    const validatedInput = EvaluationInputSchema.parse(input);
    return await evaluationFlow(validatedInput);
  },
};

