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
        super('gemini-2.5-flash');
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
      Actúa como un reclutador técnico experto y senior.
      
      Tienes el historial de una entrevista técnica realizada a un candidato${candidateName ? ` llamado ${candidateName}` : ""}.
      La entrevista se estructuró en secciones temáticas.
      
      Aquí está el historial de preguntas y respuestas (donde "Correcto" significa que respondió satisfactoriamente y "Incorrecto" que falló o no supo):
      
      ${JSON.stringify(history, null, 2)}
      
      Genera un feedback detallado y profesional para el candidato (y para el reclutador).
      El feedback debe incluir:
      1. **Resumen General:** Una visión rápida de su desempeño.
      2. **Fortalezas:** Áreas donde demostró conocimiento (preguntas correctas).
      3. **Áreas de Mejora:** Temas donde falló (preguntas incorrectas o saltadas).
      4. **Recomendación Final:** ¿Parece un perfil sólido, junior, mid o senior basado en esto? (Estimación).
      
      Usa formato Markdown para que sea legible. Sé constructivo pero directo sobre las brechas técnicas.
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
