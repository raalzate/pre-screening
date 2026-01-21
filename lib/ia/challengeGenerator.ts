import { BaseGenerator } from './baseGenerator';
import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';

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

const ChallengeResultSchemaRaw = z.object({
  title: z.string(),
  description: z.string(),
  mermaid: z.string(),
  coverages: z.array(z.string()),
  coverageQuestions: z.array(z.string()),
  evaluationCriteria: z.array(z.string()),
});

export type ChallengeInput = z.infer<typeof ChallengeInputSchema>;
export type ChallengeResult = z.infer<typeof ChallengeResultSchemaRaw> & { challengeId: string };

type InputSchemaType = typeof ChallengeInputSchema;
type OutputSchemaType = typeof ChallengeResultSchemaRaw;

class ChallengeGenerator extends BaseGenerator<InputSchemaType, OutputSchemaType> {
  constructor() {
    super('gemini-2.5-flash');
  }

  get name() {
    return 'challengeGenerator';
  }

  get inputSchema() {
    return ChallengeInputSchema;
  }

  get outputSchema() {
    return ChallengeResultSchemaRaw;
  }

  get promptTemplate() {
    return (input: ChallengeInput) => {
      const gaps = JSON.stringify(input.gaps, null, 2);
      const formId = input.formId.replaceAll('-', ' ');

      return `
        Eres un experto en ${formId}.
        Genera una **pregunta práctica, abierta y desafiante** redactada como un **caso de estudio hipotético (use case)**.
        La salida debe ser una **pregunta clara** (no un reto ni instrucción), siempre planteada en términos de un escenario o situación.
        El caso de estudio debe incluir además un **diagrama en Mermaid (sequenceDiagram)** que represente el flujo de interacción entre actores o componentes principales del escenario.
        La persona deberá analizar el gráfico junto con el caso para responder.

        ### Reglas
        - La salida debe ser una **pregunta redactada como tal**, dentro de un **caso de estudio hipotético**.
        - La **pregunta debe estar siempre en negrilla usando formato HTML (<b> ... </b>)** dentro de la descripción, para que sea fácil de identificar.
        - El diagrama Mermaid debe ser un **sequenceDiagram válido**, mostrando mensajes, actores y flujos clave que el candidato deba interpretar.
        - Asegúrate de que las líneas dentro de los bloques alt, else, opt, y loop no tengan sangría (indentación).
        - **Formatea cada elemento de la lista "gaps" como una pregunta en el nuevo array "coverageQuestions".**
        
        ### Influencia
        - La pregunta debe tener un contexto bancario.
        - La pregunta debe ser **práctica, abierta y desafiante**.
        - La debe resolver problemas de negocio con un grado de dificultad técnica.
        
        ### Datos de entrada (gaps)
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
    };
  }

  async generateChallenge(input: ChallengeInput): Promise<ChallengeResult> {
    const data = await this.generate(input);
    return {
      ...data,
      challengeId: uuidv4(),
    };
  }
}

export const challengeGenerator = new ChallengeGenerator();
