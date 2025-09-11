export interface Question {
  id: string;
  question: string;
  type: string;
  scaleMax: number;
  example?: string;
}


export interface Category {
  id: string;
  title: string;
  questions: Question[];
}


export interface FormConfig {
  id: string;
  title: string;
  categories: Category[];
}

