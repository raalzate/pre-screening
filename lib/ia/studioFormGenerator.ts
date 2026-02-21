import { BaseGenerator } from './baseGenerator';
import { z } from 'zod';
import * as fs from 'fs';
import * as path from 'path';

const FormGeneratorInputSchema = z.object({
    requirementId: z.string(),
    requirementTitle: z.string(),
    requirements: z.record(z.string(), z.number()),
});

const FormGeneratorOutputSchema = z.object({
    id: z.string(),
    title: z.string(),
    requirementId: z.string(),
    categories: z.array(z.object({
        id: z.string(),
        title: z.string(),
        questions: z.array(z.object({
            id: z.string(), // Must match a skill key
            question: z.string(),
            type: z.string().describe("Must be 'scale'"),
            scaleMax: z.number().describe("Must be 5"),
            example: z.string().optional()
        }))
    }))
});

export type FormGeneratorInput = z.infer<typeof FormGeneratorInputSchema>;
export type FormGeneratorOutput = z.infer<typeof FormGeneratorOutputSchema>;

export class StudioFormGenerator extends BaseGenerator<typeof FormGeneratorInputSchema, typeof FormGeneratorOutputSchema> {
    private descriptors: Record<string, string> = {};

    constructor() {
        super('gemini-2.0-flash');
        const descriptorsPath = path.join(process.cwd(), 'data', 'descriptors.json');
        const rawDescriptors = JSON.parse(fs.readFileSync(descriptorsPath, 'utf8'));

        // Flatten descriptors for easy lookup
        Object.values(rawDescriptors).forEach((skills: any) => {
            Object.assign(this.descriptors, skills);
        });
    }

    get name() {
        return 'studioFormGenerator';
    }

    get inputSchema() {
        return FormGeneratorInputSchema;
    }

    get outputSchema() {
        return FormGeneratorOutputSchema;
    }

    get promptTemplate() {
        return (input: FormGeneratorInput) => {
            const skillsToEvaluate = Object.keys(input.requirements)
                .map(key => `- **${key}**: ${this.descriptors[key] || 'Sin descripción'}`)
                .join('\n');

            return `Actúa como un experto en diseño de evaluaciones técnicas y pre-screening.
Tu objetivo es generar un formulario de evaluación completo basado en un perfil de requisitos predefinido.

**Perfil de Requisitos:**
- **ID:** ${input.requirementId}
- **Título:** ${input.requirementTitle}
- **Habilidades a evaluar:**
${skillsToEvaluate}

**Instrucciones:**
1. Elige un ID para el formulario (ej: 'form-${input.requirementId}').
2. Organiza las preguntas en 3 o 4 categorías lógicas (ej: "Fundamentos", "Arquitectura", "Prácticas de Ingeniería").
3. Cada pregunta DEBE estar vinculada a uno de los IDs de habilidades proporcionados arriba pasándolo al campo 'id' de la pregunta.
4. Asegúrate de cubrir TODAS las habilidades listadas.
5. Las preguntas deben ser abiertas para un pre-screening (ej: "¿Qué tanto dominas...?", "¿Cómo has aplicado...?").
6. El tipo de pregunta debe ser siempre 'scale' con scaleMax 5.
7. Incluye un campo 'example' con un ejemplo técnico (código o escenario) que ilustre qué se espera en un nivel avanzado (3 o 4).

Devuelve el resultado en el formato JSON especificado.`;
        };
    }
}
