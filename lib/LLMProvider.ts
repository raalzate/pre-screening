import OpenAI from 'openai';

export interface LLMProvider {
  createCompletion(prompt: string): Promise<string>;
}

class OpenAIProvider implements LLMProvider {
  private client: OpenAI;

  constructor() {
    this.client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }

  async createCompletion(prompt: string): Promise<string> {
    const response = await this.client.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
    });
    return response.choices[0].message.content ?? '';
  }
}

export function getLLMProvider(): LLMProvider {
  // For now, we only have OpenAI, but we can add more providers here
  return new OpenAIProvider();
}
