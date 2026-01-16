import { genkit } from 'genkit';
import { config } from 'dotenv';
import { googleAI } from '@genkit-ai/googleai';
import * as z from 'zod';

config();

export const ai = genkit({
    plugins: [googleAI()],
    model: googleAI.model('gemini-2.5-flash'),
});

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

export const interviewFeedbackFlow = ai.defineFlow(
    {
        name: "interviewFeedbackFlow",
        inputSchema: FeedbackInputSchema,
        outputSchema: z.string(),
    },
    async ({ candidateName, history }) => {
        const prompt = `
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

        const llmResponse = await ai.generate({
            prompt: prompt,
            config: {
                temperature: 0.4,
            },
        });

        return llmResponse.text;
    }
);

export const interviewFeedbackGenerator = {
    generate: async (input: z.infer<typeof FeedbackInputSchema>) => {
        return await interviewFeedbackFlow(input);
    },
};
