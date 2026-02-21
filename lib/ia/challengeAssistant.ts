import { BaseGenerator } from './baseGenerator';
import { z } from 'zod';

const ChallengeSchema = z.object({
    title: z.string(),
    description: z.string(),
    coverages: z.array(z.string()),
    evaluationCriteria: z.array(z.string()),
    coverageQuestions: z.array(z.string()),
});

const CertificationDetailSchema = z.object({
    questionId: z.string(),
    correct: z.boolean(),
    chosen: z.union([z.string(), z.null(), z.undefined(), z.number()]),
});

const CertificationSchema = z.object({
    score: z.number(),
    total: z.number(),
    analysis: z.string().optional(),
    details: z.array(CertificationDetailSchema),
});

const AssistantInputSchema = z.object({
    challenge: ChallengeSchema,
    certification: CertificationSchema.optional(),
});

const AssistantOutputSchema = z.object({
    technicalContext: z.string().describe(
        "Resumen ultra-conciso (máx 30 palabras) de los conceptos técnicos y stack necesarios para entender el reto."
    ),
    successIndicators: z.array(z.string()).describe(
        "Lista de 3 a 5 puntos clave técnicos que la solución del candidato DEBE tener."
    ),
    suggestedQuestions: z.array(z.string()).describe(
        "Preguntas cortas para retar la solución propuesta o cubrir brechas detectadas en la certificación."
    ),
});

export type AssistantInput = z.infer<typeof AssistantInputSchema>;
export type AssistantOutput = z.infer<typeof AssistantOutputSchema>;

class ChallengeAssistant extends BaseGenerator<typeof AssistantInputSchema, typeof AssistantOutputSchema> {
    constructor() {
        super('gemini-2.0-flash');
    }

    get name() {
        return 'challengeAssistant';
    }

    get inputSchema() {
        return AssistantInputSchema;
    }

    get outputSchema() {
        return AssistantOutputSchema;
    }

    get promptTemplate() {
        return (input: AssistantInput) => {
            const challengeStr = JSON.stringify(input.challenge);
            const certificationStr = input.certification
                ? JSON.stringify(input.certification)
                : "N/A";

            return `
      Actúa como un CTO experto evaluando una entrevista técnica.
      
      DATOS DEL CANDIDATO:
      - Reto Técnico: ${challengeStr}
      - Test previo (Certificación): ${certificationStr}
      
      OBJETIVO:
      Generar una guía rápida para el entrevistador humano.
      
      INSTRUCCIONES PARA EL JSON DE SALIDA:
      
      1. field "technicalContext":
         - DEBE ser muy corto y directo al grano.
         - Solo menciona qué conocimientos técnicos son prerrequisito.
      
      2. field "successIndicators":
         - Dame los indicadores de que el candidato está respondiendo BIEN.
         - ¿Qué palabras clave, patrones de diseño o lógica específica debe mencionar?
      
      3. field "suggestedQuestions":
         - Basado en las 'coverageQuestions' originales y las fallas en la certificación (si las hay).
         - Genera preguntas de seguimiento para verificar que no memorizó la respuesta.
    `;
        };
    }
}

export const challengeAssistant = new ChallengeAssistant();