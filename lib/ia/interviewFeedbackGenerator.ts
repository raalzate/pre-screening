import { BaseGenerator } from './baseGenerator';
import { z } from 'zod';

const InterviewHistoryItemSchema = z.object({
    section: z.string(),
    questionId: z.string(),
    question: z.string(),
    guide: z.string(),
    result: z.string(),
    timestamp: z.string(),
});

const FeedbackInputSchema = z.object({
    candidateName: z.string().optional(),
    history: z.array(InterviewHistoryItemSchema),
});

export type FeedbackInput = z.infer<typeof FeedbackInputSchema>;

class InterviewFeedbackGenerator extends BaseGenerator<typeof FeedbackInputSchema, z.ZodString> {
    constructor() {
        super('gemini-2.0-flash');
    }

    get name() {
        return 'interviewFeedback';
    }

    get inputSchema() {
        return FeedbackInputSchema;
    }

    get outputSchema() {
        return z.string();
    }

    get promptTemplate() {
        return (input: FeedbackInput) => {
            const { candidateName, history } = input;
            return `
      Actúa como un Reclutador Técnico Senior. Analiza el siguiente historial de entrevista y genera un feedback ejecutivo ultra-conciso.

Candidato: ${candidateName || "N/A"} 
Contexto: ${JSON.stringify(history)}

Instrucciones de formato:

Resumen: Una sola frase sobre el desempeño global (resumen detallado máximo 100 palabras).
Fortalezas: Máximo 3-6 puntos clave (solo keywords/temas).
Brechas: Máximo 3-6 puntos críticos a mejorar (solo keywords/temas).
Nivel Estimado: Junior, Semi Senior, o Senior en una palabra y agrega el porque.

Restricción: Sé directo, constructivo y evita introducciones innecesarias.
    `;
        };
    }

    // Override to handle non-JSON output (string)
    protected defineFlow() {
        return this.ai.defineFlow(
            {
                name: `${this.name}Flow`,
                inputSchema: this.inputSchema,
                outputSchema: this.outputSchema,
            },
            async (input) => {
                const response = await this.ai.generate({
                    prompt: this.promptTemplate(input),
                    // For string output, we don't specify output schema in AI.generate
                });

                return response.text;
            }
        );
    }
}

export const interviewFeedbackGenerator = new InterviewFeedbackGenerator();
