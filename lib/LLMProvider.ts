import { GoogleGenerativeAI } from '@google/generative-ai';

export interface LLMProvider {
  createCompletion(prompt: string): Promise<string>;
}



class GeminiProvider implements LLMProvider {
  private genAI: GoogleGenerativeAI;

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY environment variable is not set.');
    }
    this.genAI = new GoogleGenerativeAI(apiKey);
  }

  async createCompletion(prompt: string): Promise<string> {
    const model = this.genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    const result = await model.generateContent(prompt);
    const response = result.response;
    return response.text();
  }
}

export function getLLMProvider(): LLMProvider {
  // For now, we only have OpenAI, but we can add more providers here
  return new GeminiProvider();
}
