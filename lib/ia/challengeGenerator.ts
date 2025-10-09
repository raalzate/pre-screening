import {genkit} from 'genkit';
import {config} from 'dotenv';
import {googleAI} from '@genkit-ai/googleai';
import * as z from 'zod';
import { v4 as uuidv4 } from 'uuid';


config();

export const ai = genkit({
  plugins: [googleAI()],
  model: googleAI.model('gemini-2.5-flash'),
});


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
      - La pregunta y el diagrama deben estar **separados**:
        - La **descripción** contiene el caso y la pregunta en HTML <b> ... </b>.
        - El **atributo mermaid** contiene únicamente el código del diagrama.
      - La pregunta debe poder resolverse en entrevista en línea.
      - Ajusta la complejidad según el nivel (got vs required):
        - 0 → caso complejo y retador que exija explicar razonamiento y decisiones.
        - 1–2 → caso intermedio (teoría aplicada con práctica básica).
        - 3 → caso práctico que evidencie áreas de mejora.
        - 4–5 → no generar pregunta.
      - La pregunta debe permitir exponer razonamiento, enfoque y trade-offs.
      - El diagrama Mermaid debe ser un **sequenceDiagram válido**, mostrando mensajes, actores y flujos clave que el candidato deba interpretar y ademas señala los puntos de enfoque o mejora según la pregunta y asegúrate de que las líneas dentro de los bloques alt, else, opt, y loop no tengan sangría (indentación). Deben estar al mismo nivel que el bloque al que pertenecen.
      - **Formatea cada elemento de la lista "gaps" como una pregunta en el nuevo array "coverageQuestions". Ejemplo: si un gap es "arquitectura", el coverageQuestions debe contener una pregunta como "¿Cómo mejoraría la arquitectura?" o "¿Qué cambios propondría a la arquitectura?".**
      
      ### Datos de entrada
      ${gaps}

      ### Formato de salida
      Devuelve solo un JSON válido con el siguiente esquema:

      {
        "title": "string",
        "description": "string (el caso de estudio con la pregunta redactada en <b>negrilla</b>, sin incluir el diagrama)",
        "coverages": ["string"],
        "coverageQuestions": ["string"],
        "evaluationCriteria": ["string"],
        "mermaid": "string (solo el código del diagrama Mermaid, encerrado en triple backticks \`\`\`mermaid ... \`\`\` y usando sequenceDiagram)"
      }
    `;

    const llmResponse = await ai.generate({
      prompt: prompt,
      config: {
        temperature: 0.5,
      },
      output: {
        format: 'json',
        schema: ChallengeResultSchema.omit({ challengeId: true }),
      },
    });

    if (!llmResponse || !llmResponse.output) {
      throw new Error("No se obtuvo una respuesta válida del modelo.");
    }

    const challengeData = llmResponse.output;

    if (!challengeData) {
      throw new Error("No se obtuvo una respuesta válida del modelo.");
    }

    return {
      ...challengeData,
      challengeId: uuidv4(),
    };
  }
);

export const challengeGenerator = {
  async generate(input: ChallengeInput): Promise<ChallengeResult> {
    const validatedInput = ChallengeInputSchema.parse(input);
    return await challengeFlow(validatedInput);
  },
};


