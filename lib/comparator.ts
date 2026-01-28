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
  let comparableSkillsCount = 0;

  const skills = Object.keys(candidate);
  for (const skill of skills) {
    // Verificamos si el candidato realmente tiene esta habilidad en su perfil
    comparableSkillsCount++; // Solo sumamos al total si ambos existen

    const required = requirements[skill] ? requirements[skill] : 1;
    const got = candidate[skill];

    if (got >= required) {
      metCount++;
    }

    gaps.push({ skill, required, got });

  }

  // Si no hubo ninguna coincidencia de habilidades, el score es 0 para evitar NaN
  const coverageScore = comparableSkillsCount > 0
    ? metCount / comparableSkillsCount
    : 0;

  return {
    valid: coverageScore >= 0.6,
    coverageScore,
    gaps,
  };
}
