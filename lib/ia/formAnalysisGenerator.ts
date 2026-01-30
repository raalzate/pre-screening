import { BaseGenerator } from './baseGenerator';
import { z } from 'zod';

const FormAnalysisInputSchema = z.object({
    formId: z.string(),
    title: z.string(),
    answers: z.record(z.number()),
    resultData: z.object({
        score: z.number(),
        totalPossible: z.number(),
        percentage: z.number(),
        improvements: z.array(z.object({
            id: z.string(),
            question: z.string(),
            score: z.number(),
            example: z.string().optional(),
        })),
    }),
});

const FormAnalysisResultSchema = z.object({
    analysis: z.string()
});

export type FormAnalysisInput = z.infer<typeof FormAnalysisInputSchema>;

class FormAnalysisGenerator extends BaseGenerator<typeof FormAnalysisInputSchema, typeof FormAnalysisResultSchema> {
    constructor() {
        super('gemini-2.5-flash');
    }

    get name() {
        return 'formAnalysis';
    }

    get inputSchema() {
        return FormAnalysisInputSchema;
    }

    get outputSchema() {
        return FormAnalysisResultSchema;
    }

    get promptTemplate() {
        return (input: FormAnalysisInput) => {
            return `
      Actúa como un Lead Technical Interviewer y genera un ANÁLISIS TÉCNICO PROFUNDO basado en los resultados de una evaluación de prescreening.

      CONTEXTO DE LA EVALUACIÓN:
      Formulario: ${input.title}
      Puntaje Total: ${input.resultData.score} / ${input.resultData.totalPossible} (${input.resultData.percentage}%)

      BRECHAS IDENTIFICADAS (Áreas donde el candidato obtuvo puntajes bajos):
      ${JSON.stringify(input.resultData.improvements, null, 2)}

      TU TAREA:
      Genera un informe detallado pero ejecutivo en formato Markdown. El informe debe ser útil para que el administrador tome una decisión rápida sobre el perfil técnico del candidato.

      ESTRUCTURA REQUERIDA (en Markdown):
      1.  ### 📊 Resumen Ejecutivo
          Una breve síntesis (2-3 frases) sobre el nivel de afinidad del candidato con el rol técnico evaluado.
      2.  ### 💪 Fortalezas Detectadas
          Menciona las áreas donde el candidato parece tener un dominio sólido (basado en que no aparecen en la lista de brechas o son fortalezas relativas), has una lista pero resumida no debes ser tan verboso.
      3.  ### 🔍 Análisis de Brechas Críticas
          Analiza los puntos específicos donde el candidato falló. Explica el impacto técnico de estas brechas en un entorno de producción real, resume los puntos y no debes ser tan verboso.
  
      IMPORTANTE: Mantén un tono profesional, objetivo y técnico. Usa viñetas para que sea fácil de leer. Responde en ESPAÑOL y lo mas simple posible no tan verboso.
    `;
        };
    }
}

export const formAnalysisGenerator = new FormAnalysisGenerator();
