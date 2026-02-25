import { genkit, Genkit } from 'genkit';
import { googleAI } from '@genkit-ai/googleai';
import { z } from 'zod';
import { getServerSession } from "next-auth/next";
import { authOptions } from '@/lib/auth';
import { aiRateLimiter } from './rateLimiter';

export class RateLimitError extends Error {
    constructor(message: string = 'Has superado el límite de peticiones de IA. Por favor, espera un minuto antes de reintentar.') {
        super(message);
        this.name = 'RateLimitError';
    }
}

export class UnauthorizedError extends Error {
    constructor(message: string = 'Autenticación requerida para usar funciones de IA.') {
        super(message);
        this.name = 'UnauthorizedError';
    }
}

export abstract class BaseGenerator<I extends z.ZodTypeAny, O extends z.ZodTypeAny, R = z.infer<O>> {
    protected ai: Genkit;

    constructor(modelName: string = 'gemini-2.0-flash') {
        this.ai = genkit({
            plugins: [googleAI({ apiKey: process.env.GEMINI_API_KEY })],
            model: googleAI.model(modelName),
        });
    }

    abstract get name(): string;
    abstract get inputSchema(): I;
    abstract get outputSchema(): O;
    abstract get promptTemplate(): (input: z.infer<I>) => string;

    protected defineFlow() {
        return this.ai.defineFlow(
            {
                name: `${this.name}Flow`,
                inputSchema: this.inputSchema,
                outputSchema: this.outputSchema,
            },
            async (input) => {
                const response = await this.ai.generate({
                    prompt: this.promptTemplate(input),
                    output: {
                        format: 'json',
                        schema: this.outputSchema,
                    },
                });

                const data = response.output;
                if (!data) {
                    throw new Error(`No output from ${this.name} flow`);
                }
                return data;
            }
        );
    }

    protected async generateRaw(input: z.infer<I>): Promise<z.infer<O>> {
        const validatedInput = this.inputSchema.parse(input);
        const flow = this.defineFlow();

        let lastError: any;
        const maxRetries = 3;
        const baseDelay = 2000;

        for (let attempt = 0; attempt <= maxRetries; attempt++) {
            try {
                return await flow(validatedInput);
            } catch (error: any) {
                lastError = error;
                // 429: Too Many Requests
                if (error?.status === 429 || error?.message?.includes('429')) {
                    if (attempt < maxRetries) {
                        const delay = baseDelay * Math.pow(2, attempt);
                        console.warn(`[${this.name}] AI rate limit (429) hit. Retrying in ${delay}ms... (Attempt ${attempt + 1}/${maxRetries})`);
                        await new Promise(resolve => setTimeout(resolve, delay));
                        continue;
                    }
                }
                throw error;
            }
        }
        throw lastError;
    }

    async generate(input: z.infer<I>): Promise<R> {
        // 1. Authentication Check
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            throw new UnauthorizedError();
        }

        const userId = (session.user as any).code || (session.user as any).email;

        // 2. Rate Limit Check
        const status = await aiRateLimiter.checkLimit(userId);
        if (!status.allowed) {
            throw new RateLimitError();
        }

        // 3. Process Request
        return await this.generateRaw(input) as unknown as R;
    }
}
