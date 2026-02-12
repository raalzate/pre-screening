export interface Question {
  id: string;
  question: string;
  relatedTo: string[];
  options: string[];
  correctAnswer: string;
  rationale: string;
}

export type SanitizedQuestion = Omit<Question, 'correctAnswer' | 'rationale'>;

export interface FormJson {
  formId: string;
  validityScore: number;
  scoreExplanation: string;
  questions: Question[];
}

export interface ResultDetail {
  questionId: string;
  correct: boolean;
  chosen: string | null;
  correctAnswer: string;
  rationale: string;
  relatedTo: string[];
}

export interface CertificationResult {
  score: number;
  total: number;
  details: ResultDetail[];
  analysis: string;
}