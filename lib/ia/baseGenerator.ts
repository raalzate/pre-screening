import { genkit, Genkit } from 'genkit';
import { googleAI } from '@genkit-ai/googleai';
import { z } from 'zod';

export abstract class BaseGenerator<I extends z.ZodTypeAny, O extends z.ZodTypeAny> {
    protected ai: Genkit;

    constructor(modelName: string = 'gemini-2.5-flash') {
        this.ai = genkit({
            plugins: [googleAI()],
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

    async generate(input: z.infer<I>): Promise<z.infer<O>> {
        const validatedInput = this.inputSchema.parse(input);
        const flow = this.defineFlow();
        return await flow(validatedInput);
    }
}
