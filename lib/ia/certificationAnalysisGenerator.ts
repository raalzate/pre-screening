import { genkit } from 'genkit';
import { config } from 'dotenv';
import { googleAI } from '@genkit-ai/googleai';
import * as z from 'zod';

config();

export const ai = genkit({
    plugins: [googleAI()],
    model: googleAI.model('gemini-2.5-flash'), // Using 2.5 flash for deeper analysis
});

const GapDetailSchema = z.object({
    skill: z.string(),
    required: z.number(),
    got: z.number(),
});

const CertificationAnalysisInputSchema = z.object({
    score: z.number(),
    gaps: z.array(GapDetailSchema),
    details: z.any().optional(), // Can include question details for deeper context if available
});

export const certificationAnalysisFlow = ai.defineFlow(
    {
        name: "certificationAnalysisFlow",
        inputSchema: CertificationAnalysisInputSchema,
        outputSchema: z.string(),
    },
    async ({ score, gaps }) => {
        const prompt = `
      Actúa como un Lead Evaluator generando un RESUMEN DE CONTROL EJECUTIVO sobre un candidato.
      
      CONTEXTO:
      Puntuación: ${score}/100.
      Brechas identificadas:
      ${JSON.stringify(gaps, null, 2)}
      
      TU TAREA:
      Genera un resumen MUY CONCISO (Bullet points) para toma de decisiones rápida.
      
      ESTRUCTURA REQUERIDA:
      1. **Diagnóstico Flash:** 1 o 2 frases sobre el nivel del candidato.
      2. **Top Brechas Críticas:** Lista punteada de las 3 brechas más graves y su impacto inmediato.
      3. **Acciones de Cierre:** ¿Qué debe estudiar específicamente? (Max 3 items, muy concretos).
      4. **Tiempo Estimado:** (Semanas) para alcanzar el nivel requerido.
      
      IMPORTANTE: Sé breve, directo y elimina explicaciones innecesarias.
    `;

        const llmResponse = await ai.generate({
            prompt: prompt,
            config: {
                temperature: 0.3, // Lower temperature for analytical precision
            },
        });

        return llmResponse.text;
    }
);

export const certificationAnalysisGenerator = {
    generate: async (input: z.infer<typeof CertificationAnalysisInputSchema>) => {
        return await certificationAnalysisFlow(input);
    },
};
