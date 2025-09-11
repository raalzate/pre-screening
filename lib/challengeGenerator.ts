import { v4 as uuidv4 } from 'uuid';
import { getLLMProvider, LLMProvider } from './LLMProvider';

export type ChallengeInput = { formId: string; answers: Record<string, number>, gaps: string[] };
export type ChallengeResult = {
  challengeId: string;
  challenge: string;
};

export class ChallengeGenerator {
  private llmProvider: LLMProvider;

  constructor() {
    this.llmProvider = getLLMProvider();
  }

  private buildPrompt(input: ChallengeInput): string {
    const gaps = input.gaps.join(', ');
    
    return `Eres un experto en la creación de desafíos técnicos. Tu tarea es generar un desafío técnico basado en las áreas de oportunidad de un candidato. El desafío debe ser práctico y relevante para las áreas de oportunidad identificadas.

Quiero generar un desafío técnico con base en las siguientes áreas de oportunidad: ${gaps}.

Reglas de salida:

1. Devuelve un desafío técnico en el campo "challenge".
2. El desafío debe ser práctico y relevante para las áreas de oportunidad identificadas.
3. Responde únicamente con JSON válido siguiendo este esquema:

{
  "challengeId": "<uuid>",
  "challenge": "<desafío>"
}
`;
  }

  async generate(input: ChallengeInput): Promise<ChallengeResult> {
    const prompt = this.buildPrompt(input);
    const raw = await this.llmProvider.createCompletion(prompt);

    const first = raw.indexOf("{");
    const last = raw.lastIndexOf("}");
    if (first === -1 || last === -1) throw new Error("No se obtuvo JSON válido del modelo");

    const jsonStr = raw.slice(first, last + 1);
    const parsed = JSON.parse(jsonStr);

    return {
      ...parsed,
      challengeId: uuidv4(),
    } as ChallengeResult;
  }
}
