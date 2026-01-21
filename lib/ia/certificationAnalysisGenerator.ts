import { BaseGenerator } from './baseGenerator';
import { z } from 'zod';

const GapDetailSchema = z.object({
    skill: z.string(),
    required: z.number(),
    got: z.number(),
});

const CertificationAnalysisInputSchema = z.object({
    score: z.number(),
    gaps: z.array(GapDetailSchema),
    details: z.any().optional(),
});

export type CertificationAnalysisInput = z.infer<typeof CertificationAnalysisInputSchema>;

class CertificationAnalysisGenerator extends BaseGenerator<typeof CertificationAnalysisInputSchema, z.ZodString> {
    constructor() {
        super('gemini-2.5-flash');
    }

    get name() {
        return 'certificationAnalysis';
    }

    get inputSchema() {
        return CertificationAnalysisInputSchema;
    }

    get outputSchema() {
        return z.string();
    }

    get promptTemplate() {
        return (input: CertificationAnalysisInput) => {
            return `
      Actúa como un Lead Evaluator generando un RESUMEN DE CONTROL EJECUTIVO sobre un candidato.
      
      CONTEXTO:
      Puntuación: ${input.score}/100.
      Brechas identificadas:
      ${JSON.stringify(input.gaps, null, 2)}
      
      TU TAREA:
      Genera un resumen MUY CONCISO (Bullet points) para toma de decisiones rápida.
      
      ESTRUCTURA REQUERIDA:
      1. **Diagnóstico Flash:** 1 o 2 frases sobre el nivel del candidato.
      2. **Top Brechas Críticas:** Lista punteada de las 3 brechas más graves y su impacto inmediato.
      3. **Acciones de Cierre:** ¿Qué debe estudiar específicamente? (Max 3 items, muy concretos).
      4. **Tiempo Estimado:** (Semanas) para alcanzar el nivel requerido.
      
      IMPORTANTE: Sé breve, directo y elimina explicaciones innecesarias.
    `;
        };
    }
}

export const certificationAnalysisGenerator = new CertificationAnalysisGenerator();
