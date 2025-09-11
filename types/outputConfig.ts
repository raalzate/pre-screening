export interface Question {
  id: string;
  question: string;
  relatedTo: string[];
  options: string[];
  correctAnswer: string;
  rationale: string;
}

export interface FormJson {
  formId: string;
  validityScore: number;
  scoreExplanation: string;
  questions: Question[];
}