import { BaseGenerator } from './baseGenerator';
import { z } from 'zod';
import * as fs from 'fs';
import * as path from 'path';

const RequirementGeneratorInputSchema = z.object({
    role: z.string(),
    seniority: z.string(),
    jobDescription: z.string().optional(),
});

const RequirementGeneratorOutputSchema = z.object({
    id: z.string(),
    title: z.string(),
    benchmark: z.array(z.object({
        skillId: z.string(),
        level: z.number().min(1).max(5),
    })).min(10).max(15),
});

export type RequirementGeneratorInput = z.infer<typeof RequirementGeneratorInputSchema>;
export type RequirementGeneratorOutput = {
    id: string;
    title: string;
    requirements: Record<string, number>;
};

export class StudioRequirementGenerator extends BaseGenerator<typeof RequirementGeneratorInputSchema, typeof RequirementGeneratorOutputSchema, RequirementGeneratorOutput> {
    private descriptors: any;

    constructor() {
        super('gemini-2.0-flash');
        const descriptorsPath = path.join(process.cwd(), 'data', 'descriptors.json');
        this.descriptors = JSON.parse(fs.readFileSync(descriptorsPath, 'utf8'));
    }

    get name() {
        return 'studioRequirementGenerator';
    }

    get inputSchema() {
        return RequirementGeneratorInputSchema;
    }

    get outputSchema() {
        return RequirementGeneratorOutputSchema;
    }

    get promptTemplate() {
        return (input: RequirementGeneratorInput) => {
            const descriptorsList = Object.entries(this.descriptors)
                .map(([category, skills]: [string, any]) => {
                    const skillsList = Object.entries(skills)
                        .map(([key, desc]) => `- **${key}**: ${desc}`)
                        .join('\n');
                    return `### ${category.replace(/_/g, ' ').toUpperCase()}\n${skillsList}`;
                })
                .join('\n\n');

            const jdSection = input.jobDescription
                ? `\n**CONTEXTO ADICIONAL (Descripción del Puesto):**\n${input.jobDescription}\n\n**INSTRUCCIÓN CRÍTICA:** Debes priorizar la selección de descriptores que se alineen directamente con las responsabilidades y tecnologías mencionadas en el Contexto Adicional arriba.\n`
                : "";

            return `Actúa como un experto en arquitectura técnica y reclutamiento especializado.
Tu objetivo es ayudar a definir un perfil de requisitos técnicos para el cargo: **${input.role}** con nivel **${input.seniority}**.
${jdSection}
Debes seleccionar entre 10 y 15 descriptores técnicos que sean relevantes para este perfil de la lista estándar proporcionada abajo.
Para cada descriptor seleccionado, asigna un nivel de importancia del 1 al 5 (donde 5 es crítico/obligatorio y 1 es deseable).

**Catálogo Estándar de Descriptores:**
${descriptorsList}

**Instrucciones:**
1. Genera un ID único en kebab-case combinando el rol y el seniority (ej: 'nodejs-backend-senior').
2. Genera un Título formal para el perfil.
3. Completa el arreglo 'benchmark' con objetos que contengan 'skillId' (el ID del descriptor, ej: 'backend-framework-mastery') y 'level' (1-5).
4. DEBES incluir al menos 10 descriptores relevantes.
5. NO inventes descriptores que no estén en la lista. Si necesitas algo similar, usa el que mejor se aproxime.

Devuelve el resultado en el formato JSON especificado.`;
        };
    }

    async generate(input: RequirementGeneratorInput): Promise<RequirementGeneratorOutput> {
        const rawResult = await this.generateRaw(input);

        // Transform array-based benchmark back to record-based requirements for the dashboard
        const requirements: Record<string, number> = {};
        rawResult.benchmark.forEach((item: { skillId: string; level: number }) => {
            requirements[item.skillId] = item.level;
        });

        return {
            id: rawResult.id,
            title: rawResult.title,
            requirements
        };
    }
}
