import { genkit, z } from 'genkit';
import { googleAI } from '@genkit-ai/googleai';
import { config } from 'dotenv';

config();

export const ai = genkit({
    plugins: [googleAI()],
    model: googleAI.model('gemini-2.5-flash'), // Usando versión estable
});

// --- Schemas de Entrada (Iguales) ---

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

// --- NUEVO Output Schema ---

const AssistantOutputSchema = z.object({
    // 1. Contexto técnico muy breve
    technicalContext: z.string().describe(
        "Resumen ultra-conciso (máx 30 palabras) de los conceptos técnicos y stack necesarios para entender el reto."
    ),

    // 2. Elementos clave para validar la respuesta (Lo que pediste)
    successIndicators: z.array(z.string()).describe(
        "Lista de 3 a 5 puntos clave técnicos que la solución del candidato DEBE tener. Sirve como checklist para saber si está respondiendo bien (Ej: 'Uso de transacciones', 'Complejidad O(n)', 'Manejo de nulos')."
    ),

    // 3. Preguntas para profundizar
    suggestedQuestions: z.array(z.string()).describe(
        "Preguntas cortas para retar la solución propuesta o cubrir brechas detectadas en la certificación."
    ),
});

// --- Flow ---

export const challengeAssistantFlow = ai.defineFlow(
    {
        name: 'challengeAssistantFlow',
        inputSchema: AssistantInputSchema,
        outputSchema: AssistantOutputSchema,
    },
    async (input) => {
        const challengeStr = JSON.stringify(input.challenge);
        const certificationStr = input.certification
            ? JSON.stringify(input.certification)
            : "N/A";

        const prompt = `
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
         - Ejemplo: "Requiere conocimientos de promesas en JS, manipulación de Arrays y complejidad algorítmica."
      
      2. field "successIndicators" (CRÍTICO):
         - Dame los indicadores de que el candidato está respondiendo BIEN.
         - ¿Qué palabras clave, patrones de diseño o lógica específica debe mencionar?
         - Sé específico técnicamente (ej: "Debe mencionar el uso de un Set para evitar duplicados").
      
      3. field "suggestedQuestions":
         - Basado en las 'coverageQuestions' originales y las fallas en la certificación (si las hay).
         - Genera preguntas de seguimiento para verificar que no memorizó la respuesta.
    `;

        try {
            const llmResponse = await ai.generate({
                prompt: prompt,
                config: {
                    temperature: 0.3, // Baja temperatura para ser preciso y conciso
                },
                output: {
                    format: 'json',
                    schema: AssistantOutputSchema,
                },
            });

            if (!llmResponse || !llmResponse.output) {
                throw new Error("Respuesta vacía del modelo.");
            }

            return llmResponse.output;
        } catch (error: any) {
            console.error("AI Error:", error);
            throw new Error(`Error generando asistencia: ${error.message}`);
        }
    }
);

export const challengeAssistant = {
    generate: (input: z.infer<typeof AssistantInputSchema>) => challengeAssistantFlow(input),
};