import { v4 as uuidv4 } from "uuid";
import { getLLMProvider, LLMProvider } from "./LLMProvider";

export type Gap = {
  skill: string;
  required: number;
  got: number;
};

export type ChallengeInput = {
  formId: string;
  answers: Record<string, number>;
  gaps: Gap[];
};

export type ChallengeResult = {
  challengeId: string;
  title: string;
  description: string;
  mermaid: string;
  coverages: string[];
  evaluationCriteria: string[];
};

export class ChallengeGenerator {
  private readonly llmProvider: LLMProvider;

  constructor() {
    this.llmProvider = getLLMProvider();
  }

private buildPrompt(input: ChallengeInput): string {
  const gaps = JSON.stringify(input.gaps, null, 2);
  const formId = input.formId.replaceAll("-", " ");

  return `
Eres un experto en ${formId}.
Genera una **pregunta práctica, abierta y desafiante** redactada como un **caso de estudio hipotético (use case)**.
La salida debe ser una **pregunta clara** (no un reto ni instrucción), siempre planteada en términos de un escenario o situación.
El caso de estudio debe incluir además un **diagrama en Mermaid (sequenceDiagram)** que represente el flujo de interacción entre actores o componentes principales del escenario.
La persona deberá analizar el gráfico junto con el caso para responder.

### Reglas
- La salida debe ser una **pregunta redactada como tal**, dentro de un **caso de estudio hipotético**.
- La **pregunta debe estar siempre en negrilla usando formato HTML (<b> ... </b>)** dentro de la descripción, para que sea fácil de identificar.
- La pregunta y el diagrama deben estar **separados**:
  - La **descripción** contiene el caso y la pregunta en HTML <b> ... </b>.
  - El **atributo mermaid** contiene únicamente el código del diagrama.
- La pregunta debe poder resolverse en entrevista en línea.
- Ajusta la complejidad según el nivel (got vs required):
  - 0 → caso complejo y retador que exija explicar razonamiento y decisiones.
  - 1–2 → caso intermedio (teoría aplicada con práctica básica).
  - 3 → caso práctico que evidencie áreas de mejora.
  - 4–5 → no generar pregunta.
- La pregunta debe permitir exponer razonamiento, enfoque y trade-offs.
- El diagrama Mermaid debe ser un **sequenceDiagram válido**, mostrando mensajes, actores y flujos clave que el candidato deba interpretar y ademas señala los puntos de enfoque o mejora según la pregunta y asegúrate de que las líneas dentro de los bloques alt, else, opt, y loop no tengan sangría (indentación). Deben estar al mismo nivel que el bloque al que pertenecen.
- **Formatea cada elemento de la lista "gaps" como una pregunta en el nuevo array "coverageQuestions". Ejemplo: si un gap es "arquitectura", el coverageQuestions debe contener una pregunta como "¿Cómo mejoraría la arquitectura?" o "¿Qué cambios propondría a la arquitectura?".**
### Datos de entrada
${gaps}

### Formato de salida
Devuelve solo un JSON válido con el siguiente esquema:

{
  "title": "string",
  "description": "string (el caso de estudio con la pregunta redactada en <b>negrilla</b>, sin incluir el diagrama)",
  "coverages": ["string"],
  "coverageQuestions": ["string"],
  "evaluationCriteria": ["string"],
  "mermaid": "string (solo el código del diagrama Mermaid, encerrado en triple backticks \`\`\`mermaid ... \`\`\` y usando sequenceDiagram)"
}
`;
}



  async generate(input: ChallengeInput): Promise<ChallengeResult> {
    const prompt = this.buildPrompt(input);
    const raw = await this.llmProvider.createCompletion(prompt);

    const first = raw.indexOf("{");
    const last = raw.lastIndexOf("}");
    if (first === -1 || last === -1) {
      throw new Error("No se obtuvo JSON válido del modelo");
    }

    const jsonStr = raw.slice(first, last + 1);
    let parsed: any;
    try {
      parsed = JSON.parse(jsonStr);
    } catch (err) {
      throw new Error(`Error parseando el JSON: ${err}`);
    }

    // Validación mínima de esquema
    if (
      !parsed.title ||
      !parsed.description ||
      !Array.isArray(parsed.coverages) ||
      !Array.isArray(parsed.evaluationCriteria)
    ) {
      throw new Error("El JSON no cumple con el esquema esperado");
    }

    return {
      ...parsed,
      challengeId: uuidv4(),
    } as ChallengeResult;
  }
}
