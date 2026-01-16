import { genkit } from 'genkit';
import { config } from 'dotenv';
import { googleAI } from '@genkit-ai/googleai';
import * as z from 'zod';

config();

export const ai = genkit({
    plugins: [googleAI()],
    model: googleAI.model('gemini-2.5-flash'),
});

// New Schema for Section-Based Interview
const QuestionSchema = z.object({
    id: z.string(),
    text: z.string().describe("La pregunta técnica que el entrevistador debe formular."),
    guide: z.string().describe("Guía para el entrevistador: qué esperar en la respuesta, keywords clave."),
});

const SectionSchema = z.object({
    id: z.string(),
    topic: z.string().describe("El tema o área técnica de esta sección (ej: 'Arquitectura', 'Seguridad', 'Bases de Datos')."),
    questions: z.array(QuestionSchema).describe("Lista de 3 preguntas progresivas: Básica -> Intermedia -> Avanzada."),
});

const InterviewPlanSchema = z.object({
    sections: z.array(SectionSchema).describe("Plan de 4 a 5 secciones cubriendo todo el reto."),
});

export type InterviewPlan = z.infer<typeof InterviewPlanSchema>;

export const interviewPlanFlow = ai.defineFlow(
    {
        name: 'interviewPlanFlow',
        inputSchema: z.object({
            challengeTitle: z.string(),
            challengeDescription: z.string(),
        }),
        outputSchema: InterviewPlanSchema,
    },
    async (input) => {
        const prompt = `
      Eres un Tech Lead diseñando una entrevista técnica profunda (15-20 min).
      
      RETOS:
      Título: ${input.challengeTitle}
      Descripción: ${input.challengeDescription}
      
      TU TAREA:
      Genera un PLAN DE ENTREVISTA dividido en SECCIONES (Contextos).
      
      ESTRATEGIA:
      - Crea entre 4 y 5 SECCIONES distintas (ej: Diseño de Sistema, Backend Check, Seguridad, Escalamiento, etc.).
      - En cada sección, incluye exactamente 3 PREGUNTAS progresivas:
        1. **Validación Básica:** Para confirmar que entiende los fundamentos del tema.
        2. **Profundización:** Si pasó la 1, esta explora el "por qué" y "cómo".
        3. **Escenario Complejo:** Si pasó la 2, esta busca límites de conocimiento o trade-offs.
      
      La lógica de la entrevista (que implementará el frontend) será:
      - Si responde BIEN -> Pasa a la siguiente pregunta de la MISMA sección.
      - Si responde MAL -> Salta inmediatamente a la SIGUIENTE SECCIÓN (para no frustrar y probar otro tema).
      
      Asegúrate de que las preguntas cubran todo el espectro del reto descrito.
    `;

        const llmResponse = await ai.generate({
            prompt: prompt,
            config: {
                temperature: 0.5,
            },
            output: {
                format: 'json',
                schema: InterviewPlanSchema,
            },
        });

        if (!llmResponse || !llmResponse.output) {
            throw new Error("Error generando el plan de entrevista.");
        }

        return llmResponse.output;
    }
);

export const interviewTreeGenerator = {
    async generate(input: { challengeTitle: string; challengeDescription: string }) {
        return await interviewPlanFlow(input);
    },
};
