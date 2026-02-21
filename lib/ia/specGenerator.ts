import { BaseGenerator } from './baseGenerator';
import { z } from 'zod';

const SpecResultSchema = z.object({
    bigPicture: z.string().describe("High-level system architecture and components involved in the solution."),
    readModels: z.array(z.object({
        name: z.string(),
        description: z.string(),
        structure: z.string().describe("Fields and data types for this read model.")
    })).describe("Data structures optimized for querying and displaying information."),
    processes: z.array(z.object({
        name: z.string(),
        description: z.string(),
        flow: z.string().describe("Step-by-step logic or state transitions.")
    })).describe("Business logic and process flows.")
});

const SpecInputSchema = z.object({
    challengeTitle: z.string(),
    challengeDescription: z.string(),
    requirements: z.any().optional(),
});

export type SpecInput = z.infer<typeof SpecInputSchema>;
export type SpecResult = z.infer<typeof SpecResultSchema>;

class SpecGenerator extends BaseGenerator<typeof SpecInputSchema, typeof SpecResultSchema> {
    constructor() {
        super('gemini-2.0-flash');
    }

    get name() {
        return 'specGenerator';
    }

    get inputSchema() {
        return SpecInputSchema;
    }

    get outputSchema() {
        return SpecResultSchema;
    }

    get promptTemplate() {
        return (input: SpecInput) => {
            return `
        Eres un Arquitecto de Software Senior experto en Diseño Guiado por el Dominio (DDD) y Arquitecturas Limpias.
        Tu tarea es generar la ESPECIFICACIÓN TÉCNICA DE REFERENCIA para un desafío técnico.
        
        DESAFÍO:
        Título: ${input.challengeTitle}
        Descripción: ${input.challengeDescription}
        
        INSTRUCCIONES:
        Genera una especificación técnica detallada dividida en tres partes:
        
        1. **Big Picture**: Describe la arquitectura general, los componentes principales (Frontend, Backend, DB, Servicios Externos) y cómo interactúan.
        2. **Read Models**: Define las estructuras de datos optimizadas para la lectura que el sistema debería tener para soportar este desafío.
        3. **Processes**: Describe la lógica de negocio y los flujos de procesos principales (ej: transacciones, cambios de estado, validaciones complejas).
        
        La especificación debe ser clara, técnica y servir como guía para que un desarrollador implemente la solución.
        Responde estrictamente en formato JSON según el esquema proporcionado.
      `;
        };
    }
}

export const specGenerator = new SpecGenerator();
