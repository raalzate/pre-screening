import { BaseGenerator } from './baseGenerator';
import { z } from 'zod';

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

const InterviewPlanInputSchema = z.object({
    challengeTitle: z.string(),
    challengeDescription: z.string(),
});

export type InterviewPlanInput = z.infer<typeof InterviewPlanInputSchema>;
export type InterviewPlan = z.infer<typeof InterviewPlanSchema>;

class InterviewTreeGenerator extends BaseGenerator<typeof InterviewPlanInputSchema, typeof InterviewPlanSchema> {
    constructor() {
        super('gemini-2.5-flash');
    }

    get name() {
        return 'interviewPlan';
    }

    get inputSchema() {
        return InterviewPlanInputSchema;
    }

    get outputSchema() {
        return InterviewPlanSchema;
    }

    get promptTemplate() {
        return (input: InterviewPlanInput) => {
            return `
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
        };
    }
}

export const interviewTreeGenerator = new InterviewTreeGenerator();
