export interface CandidateAnswers {
  [key: string]: number; // ej: { redux: 4, hooks: 3 }
}

export interface ClientRequirements {
  [key: string]: number; // ej: { redux: 5, hooks: 4 }
}

export interface ComparisonResult {
  valid: boolean;
  gaps: Array<{ skill: string; required: number; got: number }>;
}

export function compareAnswers(
  candidate: CandidateAnswers,
  requirements: ClientRequirements
): ComparisonResult {
  const gaps: Array<{ skill: string; required: number; got: number }> = [];

  for (const skill of Object.keys(requirements)) {
    const required = requirements[skill];
    const got = candidate[skill] ?? 0;

    gaps.push({ skill, required, got });
    
  }

  return {
    valid: gaps.some(g => g.required <= g.got),
    gaps,
  };
}
