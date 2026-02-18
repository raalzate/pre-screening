import { BaseGenerator } from './baseGenerator';
import { z } from 'zod';

const RejectionFeedbackInputSchema = z.object({
    opportunityTitle: z.string(),
    requirementsDescription: z.string().optional(),
    gaps: z.array(z.object({
        skill: z.string(),
        required: z.number(),
        got: z.number(),
    })),
    candidateName: z.string().optional(),
});

const RejectionFeedbackOutputSchema = z.object({
    feedback: z.string(),
});

export type RejectionFeedbackInput = z.infer<typeof RejectionFeedbackInputSchema>;
export type RejectionFeedbackOutput = z.infer<typeof RejectionFeedbackOutputSchema>;

class RejectionFeedbackGenerator extends BaseGenerator<typeof RejectionFeedbackInputSchema, typeof RejectionFeedbackOutputSchema> {
    constructor() {
        super('gemini-2.0-flash');
    }

    get name() {
        return 'rejectionFeedbackGenerator';
    }

    get inputSchema() {
        return RejectionFeedbackInputSchema;
    }

    get outputSchema() {
        return RejectionFeedbackOutputSchema;
    }

    get promptTemplate() {
        return (input: RejectionFeedbackInput) => {
            const gapsList = input.gaps
                .filter(gap => gap.got < gap.required)
                .map(gap => `- **${gap.skill}**: Nivel requerido ${gap.required}, nivel obtenido ${gap.got}`)
                .join('\n');

            return `
        Eres un mentor técnico senior y reclutador con un enfoque humano y empático. 
        Tu tarea es proporcionar feedback constructivo y recomendaciones de mejora a un candidato que no ha superado el pre-screening técnico para la posición de "${input.opportunityTitle}".

        Contexto del Requerimiento de "${input.opportunityTitle}":
        ${input.requirementsDescription || 'No se proporcionó descripción detallada.'}

        Brechas Identificadas (Gaps) - Comparación entre nivel requerido y obtenido:
        ${gapsList}

        Instrucciones de Respuesta:
        1. Comienza con un saludo amistoso a ${input.candidateName || 'el candidato'} y agradece su interés en la oportunidad de ${input.opportunityTitle}.
        2. Analiza las brechas identificadas contra el "Contexto del Requerimiento" para dar consejos que sean REALMENTE relevantes para este puesto específico.
        3. Mantén un tono alentador, profesional y de mentoría. Evita frases como "fallaste" o "fuiste rechazado". Usa "áreas de oportunidad" o "pasos para tu crecimiento".
        4. Para cada brecha donde el nivel obtenido sea menor al requerido, proporciona una recomendación específica:
           - Si la diferencia es de 1 punto: Sugiere refinamiento o práctica en casos de uso avanzados.
           - Si la diferencia es de 2 o más puntos: Sugiere cursos, documentación base o proyectos iniciales para aprender la tecnología desde los cimientos.
        5. Sugiere al menos dos recursos (documentación oficial, libros o tipos de proyectos) que ayuden a cerrar estos gaps.
        6. Estructura la respuesta usando Markdown (títulos, negritas, listas).
        7. Responde únicamente con el esquema JSON especificado.

        Ejemplo de estructura de feedback:
        ### Recomendaciones para tu Crecimiento como ${input.opportunityTitle}
        Hola ${input.candidateName || ''}, muchas gracias por participar...
        Basado en los requerimientos específicos de ${input.opportunityTitle}, hemos identificado áreas donde puedes fortalecer tu perfil para futuras convocatorias:
        
        #### [Habilidad]
        [Consejo basado en la descripción del cargo y el gap específico]
        
        #### Recursos Sugeridos
        - [Recurso 1]
        - [Recurso 2]
      `;
        };
    }
}

export const rejectionFeedbackGenerator = new RejectionFeedbackGenerator();
