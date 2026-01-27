export interface CandidateAnswers {
  [key: string]: number; // ej: { redux: 4, hooks: 3 }
}

export interface ClientRequirements {
  [key: string]: number; // ej: { redux: 5, hooks: 4 }
}

export interface ComparisonResult {
  valid: boolean;
  coverageScore: number; // 0..1
  gaps: Array<{ skill: string; required: number; got: number }>;
}

export function compareAnswers(
  candidate: CandidateAnswers,
  requirements: ClientRequirements
): ComparisonResult {
  const gaps: Array<{ skill: string; required: number; got: number }> = [];
  let metCount = 0;
  const skills = Object.keys(requirements);

  for (const skill of skills) {
    const required = requirements[skill];
    const got = candidate[skill] ?? 0;

    if (got >= required) {
      metCount++;
    }

    gaps.push({ skill, required, got });
  }

  const coverageScore = skills.length > 0 ? metCount / skills.length : 1;

  return {
    valid: coverageScore >= 0.6,
    coverageScore,
    gaps,
  };
}
